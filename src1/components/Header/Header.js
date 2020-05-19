/*eslint import/no-unresolved: [2, { ignore: ['react-native-facebook-login$'] }]*/
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FBLoginManager } from 'react-native-facebook-login';
import ls from 'react-native-local-storage';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';

import styles from './styles';
import images from '../../config/images';
import config from '../../config/config.js';
import strings from './../../config/strings';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: this.props.loading !== undefined,
      disabled: false
    };
    this.session_token = '';
    ls.get('session_token').then(sessionToken => {
      this.session_token = sessionToken;
    });
  }

  componentWillReceiveProps() {}

  leftOnPress() {
    const langID = this.props.langID || 0;
    const getRequests = () => {
      this.props.getRequests();
    };
    const getFriends = () => {
      this.props.getFriends();
    };
    const refresh = this.props.refresh !== undefined && this.props.refresh;

    if (!this.state.disabled) {
      switch (this.props.option) {
        case 'Go back':
          if (refresh) {
            Actions.loginOrSignUp({ type: 'reset' });
          } else if (this.props.modalToClose !== undefined) {
            this.props.modalToClose();
          } else {
            Actions.pop({ type: 'reset' });
          }
          break;

        case 'Save':
          this.props.modalClose();
          break;

        case 'PreviousBox':
          this.props.modalClose();
          break;

        case 'Cancel':
          this.props.modalClose();
          break;

        case 'Edit':
          Actions.modifyProfile({ data: this.props.data, langID });
          break;

        case 'Annuler':
          this.props.modalClose();
          break;

        case 'bell':
          Actions.friendRequest({
            userID: this.props.userID,
            langs: this.props.langs,
            fullName: this.props.fullName,
            getRequests,
            getFriends,
            user: this.props.user
          });
          break;
        case 'communauté':
        Actions.allUsers();
           break;
        default:
      }

      this.state.disabled = true;
      setTimeout(() => {
        this.state.disabled = false;
      }, 500);
    }
  }

  rightOnPress() {
    const langID = this.props.langID || 0;
    const getRequests = () => {
      this.props.getRequests();
    };
    const getFriends = () => {
      this.props.getFriends();
    };
    switch (this.props.iconName) {
      case 'Sauver':
        this.props.save();
        break;

      case 'close':
        this.props.modalClose();
        break;

      case 'Publish':
        this.props.applyChanges();
        break;

      case 'Apply':
        this.props.applyChanges();
        break;

      case 'bell':
        Actions.friendRequest({
          userID: this.props.userID,
          langs: this.props.langs,
          fullName: this.props.fullName,
          getRequests,
          getFriends,
          user: this.props.user
        });
        break;

      case 'plus':
        this.props.openModal();
        break;

      default:
        Alert.alert(
          '',
          strings.logoutMessage[langID],
          [
            { text: strings.yes[langID], onPress: () => this.logOut() },
            { text: strings.no[langID], onPress: () => {} }
          ],
          { cancelable: false }
        );
    }
  }

  logOut() {
    ls.get('fbToken').then(fbToken => {
      if (fbToken) {
        FBLoginManager.logout(() => {});
        ls.save('fbToken', null);
      }
    });

    axios({
      method: 'post',
      url: config.baseUrl.concat('logout'),
      headers: config.headers,
      data: {
        id: this.props.userID,
        session_token: this.session_token
      }
    })
      .then(() => {
        ls.save('token', null);
        ls.save('chatList', null);
        ls.save('data', '').then(() => {
          ls.get('data').then(tkn => {
            if (tkn === '') {
              Actions.loginOrSignUp({ type: 'reset' });
            } else {
              this.logOut();
            }
          });
        });
      })
      .catch(() => {});
  }

  renderLeftOption() {
    const langID = this.props.langID || 0;
    let color = '#bc0e91';
    if (this.props.option === 'bell') {
      color = this.props.requestsNumber !== '' ? '#bc0e91' : '#CECECE';
      return (
        <TouchableOpacity onPress={this.leftOnPress.bind(this)} style={styles.iconContainer}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialIcon name={'message'} size={23} color={color} />
            <View style={styles.requestsIconContainer}>
              <Text style={styles.requestsText}>{this.props.requestsNumber}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    if (this.props.option === 'PreviousBox') {
      return (
        <TouchableOpacity
          onPress={this.leftOnPress.bind(this)}
          style={[styles.iconContainer, { flexDirection: 'row', alignItems: 'center' }]}
        >
          <Icon name="angle-left" size={23} color="#BC0E91" />
          <Text style={[styles.settingStyle, { color, marginLeft: '10%' }]}>
            {strings.back[langID]}
          </Text>
        </TouchableOpacity>
      );
    }
    if (this.props.option === 'Go back') {
      return (
        <TouchableOpacity
          onPress={this.leftOnPress.bind(this)}
          style={[styles.iconContainer, { flexDirection: 'row', alignItems: 'center' }]}
        >
          <Icon name="angle-left" size={23} color="#BC0E91" />
          <Text style={[styles.settingStyle, { color, marginLeft: '10%'}]}>
            {strings.back[langID]}
          </Text>
        </TouchableOpacity>
      );
    }
    if (this.props.option === 'Cancel') {
      return (
        <TouchableOpacity onPress={this.leftOnPress.bind(this)} style={styles.iconContainer}>
          <Text style={[styles.settingStyle, { color }]}>{strings.cancel[langID]}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={this.leftOnPress.bind(this)} style={styles.iconContainer}>
        <Text style={[styles.settingStyle, { color }]}>
          {this.props.option === 'Edit' ? strings.modify[langID] : this.props.option}
        </Text>
      </TouchableOpacity>
    );
  }

  renderRightOption() {
    const langID = this.props.langID || 0;
    let color = '#bc0e91';
    if (this.props.iconName === 'bell') {
      color = this.props.requestsNumber !== '' ? '#bc0e91' : '#CECECE';
      return (
        <TouchableOpacity onPress={this.rightOnPress.bind(this)} style={styles.iconContainer}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialIcon name={'message'} size={23} color={color} />
            <View style={styles.requestsIconContainer}>
              <Text style={styles.requestsText}>{this.props.requestsNumber}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    if (this.props.iconName === 'Sauver') {
      return (
        <TouchableOpacity onPress={this.rightOnPress.bind(this)} style={styles.iconContainer}>
          <Text style={styles.settingStyle}>{strings.save[langID]}</Text>
        </TouchableOpacity>
      );
    }
    if (this.props.iconName === 'close') {
      return (
        <TouchableOpacity onPress={this.rightOnPress.bind(this)} style={styles.iconContainer}>
          <Text style={styles.settingStyle}>{strings.close[langID]}</Text>
        </TouchableOpacity>
      );
    }
    if (this.props.iconName === 'Save') {
      return (
        <TouchableOpacity style={styles.iconContainer}>
          <Text style={styles.settingStyle}>Save</Text>
        </TouchableOpacity>
      );
    }
    if (this.props.iconName === 'cog') {
      return (
        <TouchableOpacity style={styles.iconContainer} onPress={this.rightOnPress.bind(this)}>
          <Text style={styles.settingStyle}>{strings.logout[langID]}</Text>
        </TouchableOpacity>
      );
    }
    if (this.props.iconName === 'Apply') {
      return (
        <TouchableOpacity style={styles.iconContainer} onPress={this.rightOnPress.bind(this)}>
          <Text style={styles.settingStyle}>{strings.apply[langID]}</Text>
        </TouchableOpacity>
      );
    }

    if (this.props.iconName === 'Publish') {
      return (
        <TouchableOpacity style={styles.iconContainer} onPress={this.rightOnPress.bind(this)}>
          <Text style={styles.settingStyle}>{strings.publish[langID]}</Text>
        </TouchableOpacity>
      );
    }

    if (this.props.iconName !== '') {
      return (
        <TouchableOpacity style={styles.iconContainer} onPress={this.rightOnPress.bind(this)}>
          <Icon name={this.props.iconName} size={23} color={this.props.iconColor || '#CECECE'} />
        </TouchableOpacity>
      );
    }
    return <View />;
  }

  renderLogo() {
    if (this.props.logoName === undefined) {
      return <Image source={images.logo} style={styles.logo} />;
    }
    return <Text style={[styles.titleBar, {marginLeft: '10%'}]}>{this.props.logoName}</Text>;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.optionNameContainer}>{this.renderLeftOption()}</View>
        <View style={styles.logoContainer}>{this.renderLogo()}</View>

        <View style={styles.optionIconContainer}>
          {!this.props.loading ? (
            this.renderRightOption()
          ) : (
            <ActivityIndicator
              style={{ alignSelf: 'flex-end', marginRight: 10 }}
              size="small"
              color="#bc0e91"
            />
          )}
        </View>
      </View>
    );
  }
}

export { Header };
