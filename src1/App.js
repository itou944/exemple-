/* global bugsnag */
import React, { Component } from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Client } from 'bugsnag-react-native';
import firebase from 'firebase';
import OneSignal from 'react-native-onesignal';
import ls from 'react-native-local-storage';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import {
  Login,
  SignUp,
  Home,
  MomProfile,
  Chat,
  History,
  ModifyProfile,
  FriendRequest,
  ForgetPassword,
  AllUsers
} from './routes';
import { NoInternet } from './components';
import reducers from './reducers';

const bugsnag = new Client();
const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));


const scenes = Actions.create(
  <Scene key="root">
    <Scene key="login" initial>
      <Scene key="loginOrSignUp" component={Login} initial hideNavBar />
      <Scene key="forgotPassword" component={ForgetPassword} hideNavBar />
      <Scene key="signUp" component={SignUp} hideNavBar />
      <Scene key="home" component={Home} hideNavBar />
      <Scene key="momprofile" component={MomProfile} hideNavBar />
      <Scene key="allUsers" component={AllUsers} hideNavBar />
      <Scene key="chat" component={Chat} hideNavBar />
      <Scene key="history" component={History} hideNavBar />
      <Scene key="modifyProfile" component={ModifyProfile} hideNavBar />
      <Scene key="noInternet" component={NoInternet} hideNavBar />
      <Scene key="friendRequest" component={FriendRequest} hideNavBar />
    </Scene>
  </Scene>
);

const config = {
  apiKey: "AIzaSyCeahdBJaFXJvWXYug_KEPY_oXXWegy7Hw",
  authDomain: "omum-aec39.firebaseapp.com",
  databaseURL: "https://omum-aec39.firebaseio.com",
  projectId: "omum-aec39",
  storageBucket: "omum-aec39.appspot.com",
  messagingSenderId: "1058158368098",
  appId: "1:1058158368098:web:39c5538e769f9721"
};

EStyleSheet.build();

class App extends Component {
  constructor() {
    super();
    this.onOpened = this.onOpened.bind(this);
    this.onIds = this.onIds.bind(this);
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(0);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onOpened(openResult) {
    if (openResult.notification.payload.additionalData.p2p_notification.type === 'message') {
      const user = {
        name: openResult.notification.payload.additionalData.p2p_notification.name,
        cogname: openResult.notification.payload.additionalData.p2p_notification.cogname,
        imageSource: openResult.notification.payload.additionalData.p2p_notification.imageSource,
        deviceId: openResult.notification.payload.additionalData.p2p_notification.deviceId
      };
      const data = {
        type: openResult.notification.payload.additionalData.p2p_notification.type,
        id: openResult.notification.payload.additionalData.p2p_notification.idT,
        userID: openResult.notification.payload.additionalData.p2p_notification.userID,
        chatKey: openResult.notification.payload.additionalData.p2p_notification.chatKey,
        user,
        unRead: true
      };
      ls.save('notifData', data);
    }
    if (openResult.notification.payload.additionalData.p2p_notification.type === 'request') {
      ls.save('notifData', { type: 'request' });
    }
    if (
      openResult.notification.payload.additionalData.p2p_notification.type === 'accept' ||
      openResult.notification.payload.additionalData.p2p_notification.type === 'delete'
    ) {
      ls.save('notifData', { type: 'accept' });
    }
    if (openResult.notification.payload.additionalData.p2p_notification.type === 'acceptFriend') {
      ls.save('notifData', {
        type: 'acceptFriend',
        id: openResult.notification.payload.additionalData.p2p_notification.id
      });
    }
  }

  onIds(device) {
    ls.save('deviceId', device.userId);
  }

  render() {
    return (
      <Provider store={store}>
        <Router scenes={scenes} />
      </Provider>
    );
  }
}



export default App;
