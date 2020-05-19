/*eslint import/no-unresolved: [2, { ignore: ['react-native-facebook-login$'] }]*/
import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	TextInput,
	ListView,
	ActivityIndicator,
	Alert,
	Keyboard
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modalbox';
//import { FBLoginManager } from 'react-native-facebook-login';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import ls from 'react-native-local-storage';
import MediaDeviceInfo from 'react-native-device-info';

import TabBar from './TabBar';
import styles from './styles';
import config from '../../config/config.js';
import { Header, ModalSource } from '../../components';

import images from '../../config/images';
import strings from '../../config/strings';

const deviceId = MediaDeviceInfo.getUniqueID();


class SignUp extends Component {
	constructor(props) {
		super(props);
		const today = new Date();
		const max = ''.concat(today.getFullYear(), '-', today.getMonth() + 1, '-', today.getDate());

		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

		const languagesCheck = [];
		const userHobbiesCheck = [];
		const childrenHobbiesCheck = [];
		for (let i = 0; i < ModalSource.userHobbies.length; i++) {
			userHobbiesCheck[i] = false;
			childrenHobbiesCheck[i] = false;
		}
		for (let i = 0; i < ModalSource.languages.length; i++) {
			languagesCheck[i] = false;
		}

		let device = '';
		ls.get('deviceId').then(deviceId => {
			device = deviceId;
		});
		this.state = {
			page: 0,
			errorMessage: '',
			cameraOption: 'Choisir une photo',
			modalTitle: '',
			deviceId: device,
			loading: false,
			loadingEmail: false,

			name: '',
			cogname: '',
			email: '',
			imageSource: '',
			imageSourceUpload: '',
			location: {
				latitude: 0,
				longitude: 0
			},
			maxDate: max,
			date: this.props.token !== undefined ? '10/10/1997' : '',
			user: {
				languages: []
			},

			password: '',
			confirmPassword: '',

			dataSource: ds.cloneWithRows(ModalSource.userHobbies),
			dynDataModal: {
				name: [],
				icons: [],
				check: []
			},

			isOpenModal: false,
			languagePlaceholder: 'Langues',
			hobbiesPlaceholder: 'Loisirs',
			userHobbies: [],
			userLangs: [],

			child: {
				bdate: '',
				languages: [],
				hobbies: []
			},
			childBirthday: '',
			childHobbies: [],
			childLanguages: [],
			childlanguagePlaceholder: 'Langues',
			childHobbiesPlaceholder: 'Loisirs',

			childrens: {
				childrensList: []
			}
		};
	}

	/*OneSignal.push(function() {
		OneSignal.on('subscriptionChange', function(isSubscribed) {
		  if (isSubscribed) {
			// The user is subscribed
			//   Either the user subscribed for the first time
			//   Or the user was subscribed -> unsubscribed -> subscribed
			OneSignal.getUserId( function(userId) {
			  console.log('player_id of the subscribed user is : ' + userId)
			  // Make a POST call to your server with the user ID
			});
		  }
		});
	  });*/

	  /*client = OneSignal("MY_APP_ID", "MY_REST_API_KEY")
		notification_to_users = DeviceNotification(
    	contents={
        "fr": "Notifications OneSignal"
    	},
    	include_player_ids=[user_id]
		)*/
	
		//client.send(notification_to_users)

	componentWillMount() {
		this.setState({ loading: true });
		ls.get('deviceId').then(deviceId => {
			this.setState({
				deviceId,
				loading: false
			});
		});
		if (this.props.token !== undefined) {
			this.setState({
				name: 'test',
				cogname: 'test',
				email: 'test@mail.com'
			});
		}

		this.getLocation();

		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {});
	}

	getLocation() {
		navigator.geolocation.getCurrentPosition(
			position => {
				this.state.location.latitude = position.coords.latitude;
				this.state.location.longitude = position.coords.longitude;
			},
			() => {
				Alert.alert(
					'',
					"Quelque chose ne fonctionne pas, nous n'arrivons pas à activer la localisation",
					[{ text: 'OK', onPress: () => Actions.pop({ type: 'reset' }) }],
					{ cancelable: false }
				);
			},
			{ enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
		);
	}

	checkEmailExist(email) {
		this.setState({ loadingEmail: true });
		axios({
			method: 'post',
			url: config.baseUrl.concat('doesExist'),
			headers: config.headers,
			data: {
				email
			}
		})
			.then(response => {
				if (response.data.success === 1) {
					this.setState({
						page: this.state.page + 1,
						errorMessage: ''
					});
				} else {
					this.setState({
						errorMessage: 'Cette adresse e-mail est déjà utilisé'
					});
				}
				this.setState({ loadingEmail: false });
			})
			.catch(() => {
				this.setState({ loading: false });
			});
	}

	checkTheFields(field1, field2, field3, type) {
		const pat = ModalSource.emailPattern;
		const areFilled = [true, ''];
		switch (type) {
			case 0:
				areFilled[0] = field1 !== '' && field2 !== '' && field3 !== '' && pat.test(field3);
				if (areFilled[0]) {
					areFilled[1] = '';
				} else if (field1 === '' || field2 === '' || field3 === '') {
					areFilled[1] = '*Veuillez remplir tous les champs requis';
				} else if (!pat.test(field3)) {
					areFilled[1] = "L'adresse E-Mail n'est pas valide";
				}
				this.refs.email.blur();
				break;
			case 1:
				areFilled[0] = field1 === field2 && field1.length >= 8;
				if (areFilled[0]) {
					areFilled[1] = '';
				} else if (field1 === '' || field2 === '') {
					areFilled[1] = '*Veuillez remplir tous les champs requis';
				} else if (field1.length < 8) {
					areFilled[1] = 'Le mot de de passe que vous avez saisi est trop court'; //'Password is too short';
				} else if (field1 !== field2) {
					areFilled[1] = 'Les mots de passe ne sont pas identiques '; //'Passwords are not the same';
				}
				this.refs.confirm.blur();
				break;
			case 2:
				areFilled[0] = field1.length > 0 && field2.length > 0 && field3 !== '';
				areFilled[1] = areFilled[0] ? '' : '*Veuillez remplir tous les champs requis';
				break;
			default:
		}
		return areFilled;
	}

	changeCheckList(listSource, nameSource) {
		const checkList = [];
		for (let i = 0; i < nameSource.length; i++) {
			checkList[i] = listSource.indexOf(nameSource[i]) !== -1;
		}
		return checkList;
	}

	openModal(title, dataSource) {
		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		switch (title) {
			case 'User Hobbies':
				this.state.dynDataModal.name = ModalSource.userHobbies;
				this.state.dynDataModal.icons = ModalSource.userHobbiesIcons;
				break;

			case 'Child Hobbies':
				this.state.dynDataModal.name = ModalSource.childrenHobbies;
				this.state.dynDataModal.icons = ModalSource.childrenHobbiesIcons;
				break;

			default:
				//Languages Case
				this.state.dynDataModal.name = ModalSource.languages;
				this.state.dynDataModal.icons = ModalSource.languagesIcons;
		}

		const dynSource = this.state.dynDataModal;
		dynSource.check = this.changeCheckList(dataSource, dynSource.name);

		this.setState({
			isOpenModal: true,
			modalTitle: title,
			dataSource: ds.cloneWithRows(dynSource.name)
		});
	}

	nextPage() {
		let areFilled = [];
		const { user, date, name, cogname, email, password, confirmPassword, userHobbies } = this.state;

		switch (this.state.page) {
			case 0:
				if (this.props.token !== undefined) {
					areFilled = this.checkTheFields(user.languages, userHobbies, date, 2);
				} else {
					areFilled = this.checkTheFields(name, cogname, email, 0);
				}
				break;
			case 1:
				areFilled = this.checkTheFields(password, confirmPassword, '', 1);
				break;
			case 2:
				areFilled = this.checkTheFields(user.languages, userHobbies, date, 2);
				break;
			default:
		}
		if (areFilled[0]) {
			if (this.props.token === undefined && this.state.page === 0) {
				this.checkEmailExist(this.state.email);
			} else {
				this.setState({
					page: this.state.page + 1,
					errorMessage: ''
				});
			}
		} else {
			this.setState({
				errorMessage: areFilled[1]
			});
		}
	}

	takePhoto() {
		const options = {
			title: 'Select Avatar',
			storageOptions: {
				skipBackup: true,
				path: 'images'
			},
			takePhotoButtonTitle: 'Choisir une photo',
			chooseFromLibraryButtonTitle: 'Choisir à partir de votre bibliothèque',
			cancelButtonTitle: 'Annuler',
			mediaType: 'photo',
			maxWidth: 300,
			maxHeight: 300
		};

		ImagePicker.showImagePicker(options, response => {
			const source = 'data:image/jpeg;base64,'.concat(response.data);

			if (response.data !== undefined) {
				this.setState({
					imageSource: source,
					cameraOption: 'Change Photo',
					imageSourceUpload: response.data
				});
			}
		});
	}

	saveFromModal() {
		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const isLanguage =
			this.state.modalTitle === 'Child Languages' || this.state.modalTitle === 'Languages';
		let show = '';
		const newNames = [];
		const languagesIds = [];
		for (let i = 0; i < this.state.dynDataModal.check.length; i++) {
			if (this.state.dynDataModal.check[i]) {
				if (isLanguage) {
					languagesIds.push(i + 1);
				}
				newNames.push(this.state.dynDataModal.name[i]);
				if (show !== '') {
					show += ', ';
				}
				show += this.state.dynDataModal.name[i];
			}
		}
		if (show.length > 38) {
			show = show.substring(0, 38).concat('...');
		}

		switch (this.state.modalTitle) {
			case 'Languages':
				this.state.user.languages = languagesIds;
				show = show === '' ? 'Langues' : show;
				this.setState({
					languagePlaceholder: show,
					userLangs: newNames
				});
				break;

			case 'User Hobbies':
				show = show === '' ? 'Loisirs' : show;
				this.setState({
					hobbiesPlaceholder: show,
					userHobbies: newNames
				});
				break;

			case 'Child Languages':
				this.state.child.languages = languagesIds;
				show = show === '' ? 'Loisirs' : show;
				this.setState({
					childlanguagePlaceholder: show,
					childLanguages: newNames
				});
				break;

			case 'Child Hobbies':
				show = show === '' ? 'Loisirs' : show;
				this.setState({
					childHobbies: newNames,
					childHobbiesPlaceholder: show
				});
				break;
			default:
		}

		this.setState({
			dataSource: ds.cloneWithRows(this.state.dynDataModal.name)
		});
	}

	addChild() {
		const { child, childHobbies, childBirthday } = this.state;
		const areFilled = this.checkTheFields(child.languages, childHobbies, childBirthday, 2);
		if (areFilled[0]) {
			this.state.child.bdate = this.state.childBirthday;
			this.state.child.hobbies = this.state.childHobbies;
			const childToUpload = {
				bdate: this.state.childBirthday,
				languages: this.state.child.languages,
				hobbies: this.state.childHobbies
			};
			this.state.childrens.childrensList.push(childToUpload);

			this.state.childBirthday = '';
			this.state.childHobbies = [];
			this.state.childLanguages = [];
			this.state.child.languages = [];
			this.state.childlanguagePlaceholder = 'Langues';
			this.state.childHobbiesPlaceholder = 'Loisirs';
		}
		this.setState({ errorMessage: areFilled[1] });
	}

	signUp() {
		const { child, childHobbies, childBirthday } = this.state;
		const areFilled = this.checkTheFields(child.languages, childHobbies, childBirthday, 2);
		if (areFilled[0]) {
			this.setState({ loading: true });
			this.state.child.bdate = this.state.childBirthday;
			this.state.child.hobbies = this.state.childHobbies;
			this.state.childrens.childrensList.push(this.state.child);

			const userData = {
				latitude: this.state.location.latitude,
				longitude: this.state.location.longitude,
				hobbies: this.state.userHobbies,
				languages: this.state.user.languages,
				children: this.state.childrens.childrensList,
				device_id: this.state.deviceId
			};
			if (this.props.token !== undefined) {
				userData.fb_token = this.props.token;
				this.singUpRequest(userData, 'signUpFB');
			} else {
				userData.name = this.state.name;
				userData.surname = this.state.cogname;
				userData.email = this.state.email;
				userData.bdate = this.state.date;
				userData.password = this.state.password;
				userData.picture = this.state.imageSourceUpload;
				this.singUpRequest(userData, 'createAccount');
			}
		}
		this.setState({ errorMessage: areFilled[1] });
	}

	singUpRequest(userData, methodName) {
		axios({
			method: 'post',
			url: config.baseUrl.concat(methodName),
			headers: config.headers,
			deviceId: deviceId,
			data: userData
		})
			.then(response => {
				let message =
					'Votre compte a été créé avec succès. Un mail de confirmation vous a été adressé.';
				if (response.data.session_token === undefined) {
					message = 'Cet email est pris'; //This email is taken
				}
				const action =
					response.data.session_token !== undefined
						? { text: 'Se connecter', onPress: () => Actions.loginOrSignUp({ type: 'reset' }) }
						: { text: 'Change Email', onPress: () => this.setState({ page: 0 }) };
				Alert.alert('', message, [action], { cancelable: false });
				this.setState({ loading: false, errorMessage: '' });
			})
			.catch(error => {
				console.log(error);
				this.setState({ loading: false, errorMessage: '' });
				Alert.alert(
					'',
					'Une erreur est survenue',
					[{ text: 'OK', onPress: () => Actions.loginOrSignUp({ type: 'reset' }) }],
					{ cancelable: false }
				);
			});
	}

	renderCard(rowData) {
		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const dataSource = this.state.dynDataModal;

		const index = dataSource.name.indexOf(rowData);
		const isLanguage =
			this.state.modalTitle === 'Child Languages' || this.state.modalTitle === 'Languages';

		let backgroundColor = dataSource.check[index] ? '#bc0e91' : '#fff';
		let textColor = dataSource.check[index] ? '#fff' : '#000';
		const iconSource = dataSource.icons[index][dataSource.check[index] ? 0 : 1];

		if (isLanguage && dataSource.check[index]) {
			backgroundColor = '#E7E7E7';
			textColor = '#000';
		}
		return (
			<TouchableOpacity
				style={[styles.cardHobbieContainer, { backgroundColor }]}
				onPress={() => {
					dataSource.check[index] = !dataSource.check[index];
					this.setState({
						dataSource: ds.cloneWithRows(dataSource.name)
					});
				}}
			>
				<View style={{ flexDirection: 'row' }}>
					<Image style={{ width: 25, height: 25, marginRight: 10 }} source={iconSource} />
					<Text style={{ color: textColor, fontSize: 16 }}>{rowData}</Text>
				</View>
				<View>
					<Icon name="check" size={23} color="#fff" />
				</View>
			</TouchableOpacity>
		);
	}

	renderModal() {
		return (
			<Modal
				backdropPressToClose={false}
				isOpen={this.state.isOpenModal}
				onClosed={() => this.setState({ isOpenModal: false })}
				style={styles.modalContainer}
				position={'center'}
				backdropOpacity={0}
				position={'top'}
			>
				<View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
					<Header
						logoName="Choisir des loisirs"
						option="Cancel"
						iconName="Apply"
						modalClose={() => {
							this.setState({
								isOpenModal: false
							});
						}}
						applyChanges={() => {
							this.saveFromModal();
							this.setState({
								isOpenModal: false
							});
						}}
					/>
					<View style={{ width: '100%', height: '1%' }} />
					<ListView
						dataSource={this.state.dataSource}
						renderRow={rowData => this.renderCard(rowData)}
						removeClippedSubviews={false}
					/>
				</View>
			</Modal>
		);
	}

	renderTab0() {
		return (
			<KeyboardAwareScrollView contentContainerStyle={styles.tabViewForm} extraHeight={190}>
				<Text style={styles.tabTitle}>{this.state.cameraOption}</Text>
				<TouchableOpacity style={styles.userPhotoContainer} onPress={this.takePhoto.bind(this)}>
					<Image
						style={styles.userImage}
						source={this.state.imageSource ? { uri: this.state.imageSource } : images.avatar}
					/>
				</TouchableOpacity>
				<Text style={styles.civiliteText}>Civilité</Text>
				<View style={{ height: '50%' }}>
					<TextInput
						style={styles.inputStyle}
						placeholderTextColor="#830a65"
						placeholder="Prénom*"
						underlineColorAndroid="transparent"
						onChangeText={name => this.setState({ name })}
						value={this.state.name}
						inputRef={name => {
							this.name = name;
						}}
						onSubmitEditing={() => {
							this.refs.cogname.focus();
						}}
						returnKeyType="next"
						blurOnSubmit={false}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<TextInput
						style={styles.inputStyle}
						placeholderTextColor="#830a65"
						placeholder="Nom*"
						underlineColorAndroid="transparent"
						onChangeText={cogname => this.setState({ cogname })}
						value={this.state.cogname}
						ref="cogname"
						onSubmitEditing={() => {
							this.refs.email.focus();
						}}
						returnKeyType="next"
						blurOnSubmit={false}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<TextInput
						style={styles.inputStyle}
						placeholderTextColor="#830a65"
						placeholder="E-mail*"
						underlineColorAndroid="transparent"
						onChangeText={email => this.setState({ email })}
						value={this.state.email}
						keyboardType="email-address"
						ref="email"
						onSubmitEditing={this.nextPage.bind(this)}
						returnKeyType="go"
						blurOnSubmit={false}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					{this.state.loadingEmail ? (
						<ActivityIndicator size="small" color="red" />
					) : (
						<View style={{ alignItems: 'center' }}>
							<Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
						</View>
					)}
					<TouchableOpacity
						style={[styles.loginButton, { height: '23%' }]}
						onPress={this.nextPage.bind(this)}
					>
						<Text style={styles.loginButtonText}>Etape suivante</Text>
						<Text style={styles.loginArrow}>
							<Icon name="angle-right" size={22} color="#fff" />
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAwareScrollView>
		);
	}

	renderTab1() {
		return (
			<KeyboardAwareScrollView contentContainerStyle={styles.tabViewForm}>
				<Text style={styles.civiliteText}>Mot de passe</Text>
				<View style={{ height: '50%' }}>
					<TextInput
						style={styles.inputStyle}
						placeholderTextColor="#830a65"
						placeholder="Mot de passe*"
						underlineColorAndroid="transparent"
						onChangeText={password => this.setState({ password })}
						value={this.state.password}
						secureTextEntry
						ref="password"
						onSubmitEditing={() => {
							this.refs.confirm.focus();
						}}
						returnKeyType="next"
						blurOnSubmit={false}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<TextInput
						style={styles.inputStyle}
						placeholderTextColor="#830a65"
						placeholder="Confirmer votre mot de passe*"
						underlineColorAndroid="transparent"
						onChangeText={confirmPassword => this.setState({ confirmPassword })}
						value={this.state.confirmPassword}
						secureTextEntry
						ref="confirm"
						onSubmitEditing={this.nextPage.bind(this)}
						returnKeyType="go"
						blurOnSubmit={false}
						autoCapitalize="none"
						autoCorrect={false}
					/>
				</View>
				<View style={styles.errorTab1Container}>
					<View style={{ alignItems: 'center' }}>
						<Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
					</View>
					<TouchableOpacity
						style={[styles.loginButton, { height: '35%' }]}
						onPress={this.nextPage.bind(this)}
					>
						<Text style={styles.loginButtonText}>Etape suivante</Text>
						<Text style={styles.loginArrow}>
							<Icon name="angle-right" size={22} color="#fff" />
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAwareScrollView>
		);
	}

	renderTab2() {
		return (
			<View style={styles.tabViewForm}>
				<View style={styles.formContainer}>
					<Text style={styles.tabTitle}>Maman</Text>
					{this.props.token === undefined && (
						<DatePicker
							style={styles.dateConainer}
							date={this.state.date}
							mode="date"
							placeholder="Date de naissance*"
							format="YYYY-MM-DD"
							minDate="1930-05-01"
							maxDate={this.state.maxDate}
							confirmBtnText="Confirmer"
							cancelBtnText="Annuler"
							customStyles={{
								dateIcon: styles.dateIcon,
								dateInput: styles.dateInput,
								placeholderText: styles.datePlaceholderText,
								dateText: styles.dateText
								// ... You can check the source to find the other keys.
							}}
							onDateChange={date => {
								this.setState({ date });
							}}
						/>
					)}
					<View style={styles.inputLanguagesStyle}>
						<TouchableOpacity
							style={styles.placeholderContainer}
							onPress={this.openModal.bind(this, 'Languages', this.state.userLangs)}
						>
							<Text style={styles.textLanguagesStyle}>
								{this.state.languagePlaceholder}
								{this.state.languagePlaceholder === 'Langues' && '*'}
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.inputLanguagesStyle}>
						<TouchableOpacity
							style={styles.placeholderContainer}
							onPress={this.openModal.bind(this, 'User Hobbies', this.state.userHobbies)}
						>
							<Text style={styles.textLanguagesStyle}>
								{this.state.hobbiesPlaceholder}
								{this.state.hobbiesPlaceholder === 'Loisirs' && '*'}
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.addChildConainer} />
					<View style={{ alignItems: 'center', marginTop: '25%' }}>
						<Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
					</View>
				</View>

				<View style={styles.buttonContainer}>
					<View style={styles.nextStep}>
						<TouchableOpacity style={styles.loginButton} onPress={this.nextPage.bind(this)}>
							<Text style={styles.loginButtonText}>Etape suivante</Text>
							<Text style={styles.loginArrow}>
								<Icon name="angle-right" size={22} color="#fff" />
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}

	renderTab3() {
		return (
			<View style={styles.tabViewForm}>
				<View style={styles.formContainer}>
					<Text style={styles.tabTitle}>Enfant</Text>
					<DatePicker
						style={styles.dateConainer}
						date={this.state.childBirthday}
						mode="date"
						placeholder="Date de naissance*"
						format="YYYY-MM-DD"
						minDate="1930-05-01"
						maxDate={this.state.maxDate}
						confirmBtnText="Confirmer"
						cancelBtnText="Annuler"
						customStyles={{
							dateIcon: styles.dateIcon,
							dateInput: styles.dateInput,
							placeholderText: styles.datePlaceholderText,
							dateText: styles.dateText
							// ... You can check the source to find the other keys.
						}}
						onDateChange={date => {
							this.setState({ childBirthday: date });
						}}
					/>
					<View style={styles.inputLanguagesStyle}>
						<TouchableOpacity
							style={styles.placeHolderContainer}
							onPress={this.openModal.bind(this, 'Child Languages', this.state.childLanguages)}
						>
							<Text style={styles.textLanguagesStyle}>
								{this.state.childlanguagePlaceholder}
								{this.state.childlanguagePlaceholder === 'Langues' && '*'}
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.inputLanguagesStyle}>
						<TouchableOpacity
							style={styles.placeHolderContainer}
							onPress={this.openModal.bind(this, 'Child Hobbies', this.state.childHobbies)}
						>
							<Text style={styles.textLanguagesStyle}>
								{this.state.childHobbiesPlaceholder}
								{this.state.childHobbiesPlaceholder === 'Loisirs' && '*'}
							</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.addChildConainer} onPress={this.addChild.bind(this)}>
						<Icon name="plus" size={24} color="#dfdfdf" />
						<Text style={styles.addChildText}>{strings.addChild}</Text>
					</TouchableOpacity>
					<View style={{ alignItems: 'center' }}>
						<Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
					</View>
				</View>
				<View style={styles.buttonContainer}>
					<View style={styles.nextStep}>
						<TouchableOpacity style={styles.loginButton} onPress={this.signUp.bind(this)}>
							<Text style={styles.loginButtonText}>Confirmer</Text>
							<Text style={styles.loginArrow}>
								<Icon name="angle-right" size={22} color="#fff" />
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={{ flex: 1 }}>
					<Header option="" iconName="" />
					<ActivityIndicator style={{ marginTop: '50%' }} size="small" color="#bc0e91" />
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<View style={styles.logoContainer}>
					<Image source={images.logo} style={styles.logo} />
					<Text style={styles.moto}>Créer un compte</Text>
				</View>
				{this.props.token === undefined ? (
					<View style={styles.form}>
						<ScrollableTabView
							style={{ marginTop: '3%' }}
							initialPage={0}
							renderTabBar={() => <TabBar />}
							tabBarActiveTextColor="#CA008C"
							page={this.state.page}
							locked
						>
							<View tabLabel="Change Photo" style={styles.tabView}>
								{this.renderTab0()}
							</View>
							<View tabLabel="Password" style={styles.tabView}>
								{this.renderTab1()}
							</View>
							<View tabLabel="Mom" style={styles.tabView}>
								{this.renderTab2()}
							</View>
							<View tabLabel="Child" style={styles.tabView}>
								{this.renderTab3()}
							</View>
						</ScrollableTabView>
					</View>
				) : (
					<View style={styles.form}>
						<ScrollableTabView
							style={{ marginTop: '3%' }}
							initialPage={0}
							renderTabBar={() => <TabBar />}
							tabBarActiveTextColor="#CA008C"
							page={this.state.page}
							locked
						>
							<View tabLabel="Mom" style={styles.tabView}>
								{this.renderTab2()}
							</View>
							<View tabLabel="Child" style={styles.tabView}>
								{this.renderTab3()}
							</View>
						</ScrollableTabView>
					</View>
				)}
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => {
						if (this.state.page === 0) {
							Actions.pop();
							ls.save('token', '');
						} else {
							this.setState({
								page: this.state.page - 1
							});
						}
					}}
				>
					<Icon name="angle-left" size={30} color="#bc0e91" />
					<Text style={styles.backText}>Précédent</Text>
				</TouchableOpacity>
				{this.renderModal()}
			</View>
		);
	}
}

export { SignUp };
