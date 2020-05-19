/*eslint import/no-unresolved: [2, { ignore: ['react-native-facebook-login$'] }]*/
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import ls from 'react-native-local-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { FBLoginManager } from 'react-native-facebook-login';
import RNRestart from 'react-native-restart';
import Permissions from 'react-native-permissions';
import MediaDeviceInfo from 'react-native-device-info';
import { Linking } from 'react-native';


import styles from './styles';
import images from '../../config/images';
import config from '../../config/config.js';
import { Header, ModalSource } from '../../components';

const deviceId = MediaDeviceInfo.getUniqueID();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      location: {
        latitude: '',
        longitude: ''
      },
      loading: true,
      deviceId: ''
    };
    this.session_token = '';
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: '',
        ok: '',
        cancel: ''
      })
        .then(() => {
          this.getLocation();
        })
        .catch(() => {
          this.getLocation();
        });
    } else {
      //navigator.geolocation.requestAuthorization();
      Permissions.request('location').then(response => {
        //returns once the user has chosen to 'allow' or to 'not allow' access
        //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        this.setState({ photoPermission: response });
      });
      this.getLocation();
    }
  }

  getLocation() {
    const afterLocation = () => {
      ls.get('data').then(data => {
        ls.get('deviceId').then(deviceId => {
          this.setState({ deviceId });
          if (data) {
            this.chechSessionToken(data, deviceId);
          } else {
            this.setState({ loading: false });
          }
        });
      });
    };

    navigator.geolocation.getCurrentPosition(
      position => {
        this.state.location.latitude = position.coords.latitude;
        this.state.location.longitude = position.coords.longitude;
        afterLocation();
      },
      error => {
        afterLocation();
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  }

  facebookLogin() {
    FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web);
    FBLoginManager.loginWithPermissions(
      ['public_profile', 'email', 'user_birthday'],
      (error, data) => {
        if (!error) {
          if (this.state.deviceId === null || this.state.deviceId === undefined) {
            RNRestart.Restart();
            return;
          }
          axios({
            method: 'post',
            url: config.baseUrl.concat('loginByFB'),
            headers: config.headers,
            data: {
              fb_token: data.credentials.token,
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              deviceId: this.state.deviceId
            }
          })
            .then(response => {
              if (response.data === '') {
                Actions.signUp({ token: data.credentials.token });
              } else {
                this.session_token = response.data.session_token;
                ls.save('fbToken', data.credentials.token);
                this.finalStepLogin(response.data);
              }
            })
            .catch(() => {
              ls.get('data').then(dataUser => {
                if (dataUser) {
                  this.finalStepLogin(dataUser);
                }
                this.setState({ loading: false });
              });
            });
        } else {
          ls.get('data').then(dataUser => {
            if (dataUser) {
              this.finalStepLogin(dataUser);
            }
            this.setState({ loading: false });
          });
        }
      }
    );
  }

  emailLogin(email, password) {
    this.setState({ loading: true });
    deviceId = MediaDeviceInfo.getUniqueID();
    this.state.deviceId = deviceId;
    if (this.state.deviceId === null || this.state.deviceId === undefined) {
      setTimeout(() => {
        RNRestart.Restart();
      }, 1000);
      return;
    }
    const emailPattern = ModalSource.emailPattern;
    if (email === '' || password === '') {
      this.setState({
        errorMessage: '* Veuillez remplir tous les champs requis',
        loading: false
      });
    } else if (!emailPattern.test(email)) {
      this.setState({ errorMessage: "L'adresse e-mail n'est pas valide", loading: false });
    } else {
      axios({
        method: 'post',
        url: config.baseUrl.concat('login'),
        headers: config.headers,
        data: {
          email,
          password,
          latitude: this.state.location.latitude,
          longitude: this.state.location.longitude,
          deviceId: this.state.deviceId
        }
      },)
       .then(response => {
          if (typeof response.data.message === 'undefined') {
            this.session_token = response.data.session_token;
            this.finalStepLogin(response.data);
          } else {
            const errorMessage =
              response.data.message === 'User account not confirmed!'
                ? 'Veuillez confirmer votre compte avant de vous connecter'
                : "L'adresse e-mail ou le mot de passe n'est pas valide";
            this.setState({ errorMessage });
            this.loginFailed(errorMessage);
          }
        })
        .catch(error => {
          ls.get('data').then(dataUser => {
            if (dataUser) {
              this.finalStepLogin(dataUser);
            }
            this.setState({ loading: false });
          });
        });
    }
  }

  chechSessionToken(data, deviceId) {
    axios({
      method: 'post',
      url: config.baseUrl.concat('checkSessionToken'),
      headers: config.headers,
      data: {
        id: data.user.id,
        session_token: data.session_token,
        deviceId: deviceId
      }
    })
      .then(response => {
        if (response.data.token) {
          const newData = { ...data };
          newData.session_token = response.data.token;
          newData.user.session_token = response.data.token;

          if (this.props.changed) {
            this.updateUserData(newData);
          } else {
            this.finalStepLogin(newData);
          }
        }
        this.setState({ loading: !!this.props.changed });
      })
      .catch(error => {
        this.finalStepLogin(data);
        this.setState({ loading: false });
      });
  }

  updateUserData(userData) {
    axios({
      method: 'get',
      url: config.baseUrl.concat('getUser'),
      headers: config.headers,
      params: {
        id: userData.user.id,
        user_id: userData.user.id,
        session_token: userData.session_token
      }
    })
      .then(response => {
        const newData = { ...userData };
        newData.children = response.data.user.children;
        newData.radius = response.data.user.radius;
        newData.user_languages = response.data.user.languages;
        newData.user_hobbies = response.data.user.user_hobbies;
        newData.user = response.data.user;
        this.finalStepLogin(newData);
      })
      .catch(() => {});
  }

  finalStepLogin(userData) {
    const source = this.props.imageSource !== undefined ? this.props.imageSource : undefined;
    ls.save('session_token', userData.session_token);
    ls.save('data', userData);

    axios
      .post(config.baseUrl.concat('changeData'), {
        id: userData.user.id,
        user_id: userData.user.id,
        session_token: userData.session_token,
        latitude: this.state.location.latitude,
        longitude: this.state.location.longitude,
        deviceId: this.state.deviceId
      })
      .then(res => console.log('UPDATE', res))
      .catch(err => console.log('UPDATE', err, err.response));

    Actions.home({
      type: 'reset',
      data: userData,
      imageSource: source,
      notifData: this.props.notifData
    });

    if (Platform.OS === 'android') {
      axios({
        method: 'post',
        url: 'https://onesignal.com/api/v1/notifications',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Basic ZTc1Zjg4OTQtN2JiNC00Mzk0LWJkNjQtM2UxZjNkMjYwYjhi'
        },
        data: {
          app_id: 'e43748ae-df65-431f-9f63-011b4be1f0c3',
          include_player_ids: [this.state.deviceId],
          contents: { en: '' },
          data: {
            hidden: true,
            p2p_notification: { type: '' }
          }
        }
      })
        .then(() => {
          console.log('erreur onesignal')
        })
        .catch(() => {
          console.log('erreur 2 onesignal')
        });
    }
   
  }

  loginFailed(errorMessage) {
    ls.save('data', '');
    ls.save('token', '');
    this.setState({ loading: false });
    return Alert.alert('Une erreur est survenue', errorMessage, [{ text: 'Ok' }], { cancelable: false });
  }

  signUp(isFb) {
    const goTo = isFb ? () => this.facebookLogin() : () => Actions.signUp();
    if (Platform.OS === 'android') {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: '',
        ok: '',
        cancel: ''
      })
        .then(success => {
          console.log(success); // success => "enabled"
          goTo();
        })
        .catch(error => {
          console.log(error); // error.message => "disabled"
          Alert.alert(
            '',
            "Afin de terminé le paramétrage de votre compte merci d'activer ".concat(
              'le service de localisation'
            ),
            [{ text: 'OK', onPress: () => {} }],
            { cancelable: false }
          );
        });
    } else {
      goTo();
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Header option="" iconName="" />
          <ActivityIndicator style={{ marginTop: '50%' }} size="small" color="#bc0e91" />
        </View>
      );
    }
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={images.logo} style={styles.logo} />
          <Text style={styles.moto}>Partagez des moments</Text>
          <Text style={styles.moto}>entre mamans !</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.inputStyle}
            textContentType='username'
            autoCompleteType='username'
            autoComplete='on'
            placeholderTextColor="#830a65"
            placeholder="E-mail"
            underlineColorAndroid="transparent"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            keyboardType="email-address"
            ref="username"
            onSubmitEditing={() => {
              this.refs.password.focus();
            }}
            returnKeyType="next"
            blurOnSubmit={false}
            autoCapitalize="none"
            autoCorrect={false}
            />
          <TextInput
            style={styles.inputStyle}
            textContentType='password'
            placeholderTextColor="#830a65"
            placeholder="Mot de passe"
            underlineColorAndroid="transparent"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
            ref="password"
            onSubmitEditing={() => {
              this.emailLogin(this.state.email, this.state.password);
            }}
            returnKeyType="go"
            blurOnSubmit={false}
            autoCapitalize="none"
            autoCorrect={false}
            />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={this.emailLogin.bind(this, this.state.email, this.state.password)}
            >
            <Text style={styles.loginButtonText}>Connexion</Text>
            <Text style={styles.loginArrow}>
              <Icon name="angle-right" size={22} color="#fff" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword} onPress={() => Actions.forgotPassword()}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.column1} onPress={this.signUp.bind(this, false)}>
              <View style={styles.createPlusContainer}>
                <Text style={styles.bottomLogo}>
                  <Icon name="plus" size={24} color="#dfdfdf" />
                </Text>
              </View>
              <View style={styles.createTextContainer}>
                <Text style={styles.bottomText}>Créer un</Text>
                <Text style={styles.bottomText}>compte</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.column2} onPress={this.signUp.bind(this, true)}>
              <View style={styles.facebookContainer}>
                <Text style={styles.bottomLogo}>
                  <Icon name="facebook-official" size={30} color="#dfdfdf" />
                </Text>
              </View>
              <View style={styles.facebookTextContainer}>
                <Text style={styles.bottomText}>Connexion avec</Text>
                <Text style={styles.bottomText}>facebook</Text>
              </View>
            </TouchableOpacity>
          </View>
          
            <View style={styles.nousContacter}>
                  <Icon name="envelope" size={15} color="#bc0e9150"/>
                <Text style={styles.mailContact}s color="#787878" onPress={() => Linking.openURL('mailto:contact@bonbo.fr') }title=" contact@bonbo.fr">  contact@bonbo.fr</Text>
            </View>



        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export { Login };
