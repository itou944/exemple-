import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

import { Header } from '../../components';
import styles from './styles';
import config from '../../config/config.js';
import images from '../../config/images';

class History extends Component {

    constructor() {
        super();
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
          dataSource: ds.cloneWithRows(['Maud Santos', 'Brus Wayne', 'Brad Pitt']),
          friends: [],
          loading: false,
        };
    }

    componentWillMount() {
        this.setState({ loading: true });
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        axios({
                method: 'get',
                url: config.baseUrl.concat('viewFriends'),
                headers: config.headers,
                params: {
                    id: this.props.id
                }
            })
        .then((response) => {
            const users = [];
            for (let i = 0; i < response.data.users.length; i++) {
                const user = {
                    name: response.data.users[i].name.concat(' ', response.data.users[i].surname),
                    imageSource: response.data.users[i].picture,
                    age: this.getAge(response.data.users[i].bdate),
                    friendCount: response.data.users[i].friendCount,
                    id: response.data.users[i].id
                };
                users.push(user);
            }
            this.setState({
                dataSource: ds.cloneWithRows(users),
                friends: users,
                loading: false
            });
        });
    }

    getAge(dateString) {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    goTo(id) {
        this.setState({ loading: true });
        axios({
                method: 'get',
                url: config.baseUrl.concat('getStatus'),
                headers: config.headers,
                params: {
                    id1: id,
                    id2: this.props.userID
                }
            })
        .then((response) => {
            if (response.data.status === 'none') {
                this.setState({ loading: false });
                Actions.friendRequest({
                    friendID: id,
                    langs: this.props.langs,
                    userID: this.props.userID,
                });
            } else if (response.data.status === 0) {
                Actions.friendRequest({
                    status: 0,
                    id,
                    langs: this.props.langs,
                    userID: this.props.userID,
                    user: this.props.user
                });
                this.setState({ loading: false });
            } else {
                this.setState({ loading: false });
                Actions.momprofile({
                    id,
                    langs: this.props.langs,
                    userID: this.props.userID,
                    user: this.props.user
                });
            }
        }).catch(() => {
            this.setState({ loading: false });
        });
    }

    renderFriends() {
        if (this.state.friends.length !== 0) {
            return (
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this.renderCard(rowData)}
                />
            );
        }
        return (
            <View style={styles.noFriendsContainer}>
                <Text style={{ fontSize: 18 }}>
                    Ce membre n'a pas encore de contact
                </Text>
            </View>
        );
    }

    renderCard(rowData) {
        return (
            <TouchableOpacity
                style={styles.cardMomContainer}
                onPress={this.goTo.bind(this, rowData.id)}
            >
                <View style={styles.cardPictureContainer}>
                    <Image
                        style={styles.cardPictureStyle}
                        source={rowData.imageSource !== 'none'
                            ? { uri: rowData.imageSource } : images.avatar}
                    />
                </View>
                <View style={styles.cardInformationContainer}>
                    <Text style={styles.cardNameStyle}>
                        {rowData.name}
                    </Text>
                    <Text style={styles.cardCommentStyle}>
                        {rowData.age} ans
                    </Text>
                </View>
                <View style={styles.cardMomsNumberContainer}>
                    <Text style={styles.cardMomsNumber}>
                        {rowData.friendCount} mamans
                    </Text>
                    <Text>

                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <Header option="Go back" iconName="cog" logoName={this.state.logoName} />
                    <ActivityIndicator
                      style={{ marginTop: '50%' }}
                      size="small"
                      color="#bc0e91"
                    />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Header option="Go back" iconName="" logoName="Historique" />
                <View style={styles.listCardsContiner}>
                    {this.renderFriends()}
                </View>
            </View>
        );
    }
}

export { History };
