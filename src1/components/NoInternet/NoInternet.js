import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';

import styles from './styles';
import config from '../../config/config.js';

class NoInternet extends Component {

    checkConnection() {
          axios({
                method: 'get',
                url: config.baseUrl.concat('checkConnection'),
                headers: config.headers,
                params: {}
            })
            .then(() => {
                if (this.props.back !== undefined) {
                    Actions.pop();
                } else {
                    Actions.loginOrSignUp({ type: 'reset' });
                }
            }).catch(() => {
                Actions.noInternet({ type: 'reset' });
        });
    }

    goTo() {
        this.checkConnection();
    }

    render() {
        return (
          <View style={styles.container}>
              <Text>
                There is no Internet connection
              </Text>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                    this.goTo();
                }}
              >
                  <Text style={styles.buttonText}>
                    Try Again
                  </Text>
              </TouchableOpacity>
          </View>
      );
    }
}

export { NoInternet };
