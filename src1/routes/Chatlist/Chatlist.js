import React, { Component } from 'react';
import { View, Text, ListView, Image, TouchableOpacity } from 'react-native';
import OneSignal from 'react-native-onesignal';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import ls from 'react-native-local-storage';

import styles from './styles';
import images from '../../config/images';
import config from '../../config/config.js';
import { Header, ModalSource } from '../../components';

const CancelToken = axios.CancelToken;

class Chatlist extends Component {
	constructor(props) {
		super(props);
		const isData = props.data !== null && props.data !== undefined;

		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			loading: false,
			firstTime: !isData,
			dataSource: ds.cloneWithRows(isData ? props.data : []),
			friends: isData ? props.data : [],
			friendCount: 0,
			unreadMessages: 0,
			noDataMessage: "Vous n'avez pas de message"
		};

		this.session_token = '';
		this.cancelToken = CancelToken.source();
	}

	componentWillMount() {
		OneSignal.addEventListener('received', this.onReceived.bind(this));
		OneSignal.addEventListener('opened', this.onOpened);
		OneSignal.addEventListener('registered', this.onRegistered);
		OneSignal.addEventListener('ids', this.onIds);

		ls.get('session_token').then(sessionToken => {
			this.session_token = sessionToken;
			this.autoSearch();
		});
	}

	componentDidMount() {
		const getBack = () => {
			this.setState({ unRead: undefined });
		};
		const reviewFriends = () => {
			this.props.getFriends();
		};
		ls.get('notifData').then(notifData => {
			//notification
			if (notifData !== null) {
				const index = this.state.friends.findIndex(x => x.id === notifData.id);

				const chatParams = {
					id: notifData.id,
					langs: this.props.langs,
					userID: notifData.userID,
					user: this.props.user,
					friend: notifData.user,
					getBack,
					reviewFriends,
					chatKey: notifData.chatKey,
					changeLastMessage: () => {}
				};

				if (index !== -1) {
					const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
					try {
						this.state.friends[index].chatCount = 0;
						this.setState({
							dataSource: ds.cloneWithRows(this.state.friends)
						});
					} catch (e) {
					}

					ls.get(notifData.chatKey).then(messages => {
						chatParams.friend = this.state.friends[index];
						chatParams.changeLastMessage = newMessage => {
							try {
								this.state.friends[index].lastMessage = newMessage;
								this.state.friends = this.state.friends.sort(
									(a, b) => b.lastMessage[2] - a.lastMessage[2]
								);
								this.setState({
									dataSource: ds.cloneWithRows(this.state.friends)
								});
							} catch (e) {
							}
						};
						if (messages !== undefined && messages !== null) {
							chatParams.messages = messages;
						}

						Actions.chat(chatParams);
						ls.save('notifData', null);
					});
					return;
				}
				Actions.chat(chatParams);
				ls.save('notifData', null);
			}
		});
	}

	componentWillReceiveProps() {
		if (!this.state.loading) {
			this.state.loading = true;
			setTimeout(() => {
				this.state.loading = false;
			}, 3000);
			this.autoSearch();
		}
	}

	componentWillUnmount() {
		OneSignal.removeEventListener('received', this.onReceived);
		OneSignal.removeEventListener('opened', this.onOpened);
		OneSignal.removeEventListener('registered', this.onRegistered);
		OneSignal.removeEventListener('ids', this.onIds);
	}

	onReceived(notification) {
		const type = notification.payload.additionalData.p2p_notification.type;
		if (type === 'message' || type === 'delete') {
			this.autoSearch();
		}
	}

	onOpened() {}

	onRegistered() {}

	onIds() {}

	autoSearch() {
		this.cancelToken.cancel();
		this.cancelToken = CancelToken.source();
		axios({
			method: 'get',
			url: config.baseUrl.concat('viewFriends'),
			headers: config.headers,
			params: {
				id: this.props.userID,
				user_id: this.props.userID,
				session_token: this.session_token
			},
			cancelToken: this.cancelToken.token
		})
			.then(response => {
				const datas = [];
				let unreadMessages = 0;
				this.setState({ friendCount: response.data.users.length });
				for (let i = 0; i < response.data.users.length; i++) {
					if (response.data.users[i].chat.last_msg) {
						const lastMessage = [];
						let count = 0;
						count = response.data.users[i].chat.read_user1;
						if (response.data.users[i].chat.user1 === this.props.userID) {
							count = response.data.users[i].chat.read_user2;
						}
						if (count !== 0) {
							unreadMessages += 1;
						}
						const chatKey = response.data.users[i].chat.chat_key;
						const lastMsg = JSON.parse(response.data.users[i].chat.last_msg);
						const dt = new Date(lastMsg.timestamp);
						lastMessage.push(lastMsg.content);
						lastMessage.push(lastMsg.sender);
						lastMessage.push(dt);
						lastMessage.push(lastMsg.timestamp);
						//this.itemsRef = firebase.database().ref('chats').child(chatKey);
						const user = {
							name: response.data.users[i].name.concat(' ', response.data.users[i].surname),
							firstName: response.data.users[i].name,
							lastName: response.data.users[i].surname,
							imageSource: response.data.users[i].picture,
							deviceId: response.data.users[i].device_id,
							id: response.data.users[i].id,
							chatCount: count,
							chatKey,
							lastMessage
						};
						datas.push(user);
					}
				}

				const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
				datas.sort((a, b) => b.lastMessage[2] - a.lastMessage[2]);
				ls.save('chatList', datas);
				this.setState({
					loading: false,
					firstTime: false,
					unreadMessages,
					friends: datas,
					dataSource: ds.cloneWithRows(datas),
					noDataMessage:
						response.data.users.length === 0 ? "Vous n'avez pas de message" : "Vous n'avez pas de message"
				});
			})
			.catch(err => '');
	}

	renderCard(rowData) {
		const getBack = () => {
			this.setState({ unRead: undefined });
		};
		const reviewFriends = () => {
			// this.autoSearch();
			this.props.getFriends();
		};
		let color = 'transparent';
		let sender = '';
		let message = '';
		let messageDate = '';
		try {
			color = rowData.chatCount === 0 ? 'transparent' : '#bc0e91';
			sender = rowData.lastMessage[1] === this.props.userID ? 'Vous: ' : '';
			message =
				rowData.lastMessage[0].length < 20
					? rowData.lastMessage[0]
					: rowData.lastMessage[0].substring(0, 18).concat('...');
			const date = new Date();
			const messageTime = new Date(rowData.lastMessage[3]);
			const hours = Math.abs(date - messageTime) / 36e5;

			if (hours <= 24) {
				const minutes =
					messageTime.getMinutes() / 10 >= 1
						? messageTime.getMinutes()
						: '0'.concat(messageTime.getMinutes());
				messageDate = ''.concat(messageTime.getHours(), ':', minutes);
			} else if (hours > 24 && hours <= 48) {
				messageDate = 'Hier';
			} else {
				messageDate = ''.concat(
					messageTime.getDate(),
					' ',
					ModalSource.months[messageTime.getMonth()],
					' ',
					messageTime.getFullYear()
				);
			}
		} catch (e) {
		}

		return (
			<TouchableOpacity
				style={styles.cardMom}
				onPress={() => {
					const index = this.state.friends.indexOf(rowData);
					const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
					try {
						this.state.friends[index].chatCount = 0;
						this.setState({
							dataSource: ds.cloneWithRows(this.state.friends)
						});
					} catch (e) {
					}
					ls.get(rowData.chatKey).then(messages => {
						const chatParams = {
							id: rowData.id,
							langs: this.props.langs,
							userID: this.props.userID,
							user: this.props.user,
							friend: rowData,
							getBack,
							reviewFriends,
							chatKey: rowData.chatKey,
							changeLastMessage: newMessage => {
								try {
									this.state.friends[index].lastMessage = newMessage;
									this.state.friends = this.state.friends.sort(
										(a, b) => b.lastMessage[2] - a.lastMessage[2]
									);
									this.setState({
										dataSource: ds.cloneWithRows(this.state.friends)
									});
								} catch (e) {
								}
							}
						};
						if (messages !== undefined && messages !== null) {
							chatParams.messages = messages;
						}
						Actions.chat(chatParams);
					});
				}}
			>
				<View style={styles.profilPicContainer}>
					<Image
						style={styles.profilPic}
						source={rowData.imageSource !== 'none' ? { uri: rowData.imageSource } : images.avatar}
					/>
				</View>
				<View style={styles.textInformation}>
					<Text style={styles.momNameText}>{rowData.name}</Text>
					<View style={{ flexDirection: 'row' }}>
						<Text style={styles.momMessageText}>
							{sender}
							{message}
						</Text>
					</View>
				</View>
				<View style={[styles.textInformation, { width: '30%', alignItems: 'center' }]}>
					<Text style={styles.momMessageText}>{messageDate}</Text>
					<View style={[styles.newMessagesContainer, { backgroundColor: color }]}>
						<Text style={{ color: '#fff', fontSize: 12 }}>{rowData.chatCount}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	renderFriends() {
		if (this.state.friends.length !== 0) {
			return (
				<ListView
					dataSource={this.state.dataSource}
					contentContainerStyle={styles.listContainer}
					renderRow={rowData => this.renderCard(rowData)}
				/>
			);
		}
		return (
			<View style={styles.noFriendsContainer}>
				<Text style={{ fontSize: 18 }}>{this.state.noDataMessage}</Text>
			</View>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<Header option="" iconName="" logoName="Messagerie" userID={this.state.userID} />
				{this.renderFriends()}
				{this.state.firstTime && (
					<View style={styles.loadingContainer}>
						<Header option="" iconName="" logoName="Messages" userID={this.state.userID} loading />
					</View>
				)}
			</View>
		);
	}
}

export default Chatlist;
