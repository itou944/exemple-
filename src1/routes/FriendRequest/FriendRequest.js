import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import ls from 'react-native-local-storage';

import { Header } from '../../components';
import config from '../../config/config.js';
import Search from '.././Search/Search';
import styles from './styles';
import { MomProfile } from '../../routes';

class FriendRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: true,
            headerTitle: this.props.friendID === undefined ? "Demande(s) d'amie(s)" : '',
        };

        this.session_token = '';
        ls.get('session_token').then((sessionToken) => {
            this.session_token = sessionToken;
            this.getData();
        });
    }

    getData() {
        const methodName = this.props.friendID === undefined ? 'viewRequests' : 'getUser';
        const params = {
            id: this.props.userID,
            session_token: this.session_token
        };
        if (this.props.friendID !== undefined) {
            params.user_id = this.props.userID;
            params.id = this.props.friendID;
        }
        axios({
                method: 'get',
                url: config.baseUrl.concat(methodName),
                headers: config.headers,
                params
            })
        .then((resp) => {
            const Data = this.props.friendID === undefined ? resp.data : resp.data.user;
            
            this.setState({
                data: Data,
                loading: false
            });
        })
        .catch(() => {
            this.setState({ loading: false });
        });
    }

    renderHeader() {
        return (
            <Header
                option="Go back"
                iconName=""
                logoName={this.state.headerTitle}
            />
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <Header option="" iconName="" />
                    <ActivityIndicator
                      style={{ marginTop: '50%' }}
                      size="small"
                      color="#bc0e91"
                    />
                </View>
            );
        }
        if (this.props.status !== undefined) {
            return (
                <View style={{ flex: 1 }}>
                    <MomProfile
                        id={this.props.id}
                        langs={this.props.langs}
                        userID={this.props.userID}
                        user={this.props.user}
                        status={this.props.status}
                        receiver={this.props.receiver}
                        deleteFriend={this.props.deleteFriend}
                    />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Search
                    data={this.state.data}
                    userID={this.props.userID}
                    langs={this.props.langs}
                    user={this.props.user}
                    friend={
                        this.props.friendID === undefined ? true : undefined
                    }
                    fullName={this.props.fullName}
                    getRequests={this.props.getRequests}
                    getFriends={this.props.getFriends}
                    suggestedFriend={this.props.friendID}
                    renderHeader={() => this.renderHeader()}
                />
            </View>
        );
    }
}

export { FriendRequest };
