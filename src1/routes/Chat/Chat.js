/*eslint no-param-reassign: ["error", { "props": false }]*/
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Alert } from 'react-native';
import firebase from 'firebase';
import OneSignal from 'react-native-onesignal';
import ls from 'react-native-local-storage';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import styles from './styles';
import { Header, GiftedChat } from '../../components';
import config from '../../config/config';

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: this.props.messages !== undefined ? this.props.messages : [],
			user: 1,
			loading: this.props.messages === undefined,
			isOpenModal: false,
			profilePicture: '',
			mounted: true,
			chatKey: this.props.chatKey !== undefined ? this.props.chatKey : '',
			logoName:
				this.props.friend.firstName !== undefined
					? 'Chat avec ' + this.props.friend.firstName
					: '',
			showLoadMore: false,
			maxCount: 30,
			withinDist: 1
		};
		this.onSend = this.onSend.bind(this);
	}

	componentWillMount() {
		OneSignal.addEventListener('received', this.onReceived.bind(this));
		OneSignal.addEventListener('opened', this.onOpened);
		OneSignal.addEventListener('registered', this.onRegistered);
		OneSignal.addEventListener('ids', this.onIds);
		OneSignal.inFocusDisplaying(0);
		this.session_token = '';
		if (this.props.chatKey === undefined) {
			ls.get('session_token').then(sessionToken => {
				this.session_token = sessionToken;
				axios({
					method: 'get',
					url: config.baseUrl.concat('getChat'),
					headers: config.headers,
					params: {
						id1: this.props.id,
						id2: this.props.userID,
						session_token: this.session_token
					}
				})
					.then(response => {
						this.setState({
							chatKey: response.data.chat_key
						});
						axios({
							method: 'post',
							url: config.baseUrl.concat('readMessage'),
							headers: config.headers,
							data: {
								id: this.props.id,
								key: response.data.chat_key,
								user_id: this.props.userID,
								session_token: this.session_token
							}
						})
							.then(() => {})
							.catch(() => {});

						this.itemsRef = firebase
							.database()
							.ref('chats')
							.child(response.data.chat_key);
						this.listenForItems();
					})
					.catch(() => {});
			});
		} else {
			this.itemsRef = firebase
				.database()
				.ref('chats')
				.child(this.props.chatKey);
			ls.get('session_token').then(sessionToken => {
				this.session_token = sessionToken;
				axios({
					method: 'post',
					url: config.baseUrl.concat('readMessage'),
					headers: config.headers,
					data: {
						id: this.props.id,
						key: this.props.chatKey,
						user_id: this.props.userID,
						session_token: this.session_token
					}
				})
					.then(() => {})
					.catch(() => {});
				this.listenForItems();
			});
		}
	}

	componentWillUnmount() {
		OneSignal.removeEventListener('received', this.onReceived);
		OneSignal.removeEventListener('opened', this.onOpened);
		OneSignal.removeEventListener('registered', this.onRegistered);
		OneSignal.removeEventListener('ids', this.onIds);
		firebase
			.database()
			.ref('chats')
			.child(this.state.chatKey)
			.off();
		//OneSignal.inFocusDisplaying(2);

		axios({
			method: 'post',
			url: config.baseUrl.concat('readMessage'),
			headers: config.headers,
			data: {
				id: this.props.id,
				key: this.state.chatKey,
				user_id: this.props.userID,
				session_token: this.session_token
			}
		})
			.then(() => {
				this.props.reviewFriends();
			})
			.catch(() => {});
		this.props.getBack();
	}

	onReceived(notification) {
		if (notification.payload.additionalData.p2p_notification.type === 'delete') {
			Actions.pop();
		}
	}

	onOpened() {
		ls.save('notifData', null);
	}

	onRegistered() {}
	
	onIds() {}

	onLoadEarlier() {}

	onSend(messages = []) {
		messages[0].user.avatar = this.props.friend.imageSource;
		this.setState(previousState => ({
			messages: GiftedChat.append(previousState.messages, messages)
		}));
		const date = new Date().getTime();
		const message = {
			content: messages[0].text,
			sender: this.props.userID,
			timestamp: date
		};
		this.itemsRef.push(message);

		axios({
			method: 'post',
			url: config.baseUrl.concat('sendMessage'),
			headers: config.headers,
			data: {
				id: this.props.userID,
				key: this.state.chatKey,
				session_token: this.session_token,
				last_msg: message
			}
		})
			.then(() => {})
			.catch(() => {});

		const playerId = this.props.friend.deviceId;
		let userFullName = '';
		try {
			userFullName = this.props.user.name.concat(' ', this.props.user.cogname);
		} catch (e) {
		}
		axios({
			method: 'post',
			url: config.baseUrl.concat('get-device-id'),
			headers: config.headers,
			data: {
				id: this.props.userID,
				user_id: this.props.id,
				session_token: this.session_token
			}
		})
			.then(response => {
				if (response.data.device_id !== null) {
					OneSignal.postNotification(
						{
							en: 'vous avez un message de '.concat(userFullName)
						}, // No content
						{
							type: 'message',
							notificationID: this.props.userID,
							idT: this.props.userID,
							userID: this.props.id,
							name: this.props.friend.firstName,
							cogname: this.props.friend.lastName,
							imageSource: this.props.friend.imageSource,
							chatKey: this.state.chatKey,
							deviceId: response.data.device_id
						}, // data
						playerId, // recipient
						// other params, as introduced in this PR
						{
							priority: 1,
							id: 5,
							android_group: 'Vous avez $[notif_count] nouveaux messages',
							ios_badgeType: 'Increase',
							ios_badgeCount: 1
						}
					);
				}
			})
			.catch(() => {});
		const lastMessage = [];
		const dt = new Date(date);
		lastMessage.push(messages[0].text);
		lastMessage.push(this.props.userID);
		lastMessage.push(dt);
		lastMessage.push(date);
		if (this.props.chatKey !== undefined) {
			this.props.changeLastMessage(lastMessage);
		}
	}

	listenForItems() {
		const maxCount = this.state.maxCount + 1;
		// this.itemsRef.on('value', (snap) => {
		//     let snapLength = 0;
		//     snap.forEach(() => {
		//       snapLength += 1;
		//     });
		//
		//     if (this.state.maxCount < snapLength) {
		//           this.setState({ showLoadMore: true });
		//     } else {
		//           this.setState({ showLoadMore: false });
		//     }
		//   });
		this.itemsRef
			.orderByChild('timestamp')
			.limitToLast(maxCount)
			.on('value', snap => {
				const items = [];

				snap.forEach(child => {
					if (child.val() !== 'hello test end') {
						const dt = new Date(child.val().timestamp);
						let imageSource = '';
						let userName = '';
						if (this.props.userID === child.val().sender) {
							imageSource = 'none';
							try {
								imageSource = this.props.user.imageSource;
								userName = this.props.user.name;
							} catch (e) {
							}
						} else {
							imageSource = this.props.friend.imageSource;
							userName = this.props.friend.name;
						}
						items.push({
							_id: child.val().timestamp,
							text: child.val().content,
							createdAt: dt,
							user: {
								_id: child.val().sender,
								name: userName,
								avatar: imageSource,
								openModal: profilePicture => {
									this.setState({ isOpenModal: true, profilePicture });
								}
							}
						});
					}
				});

				this.setState({
					messages: items.reverse(),
					loading: false,
					showLoadMore: maxCount <= items.length
				});
				if (this.state.messages.length > 30) {
					ls.save(this.state.chatKey, this.state.messages.slice(0, 30));
				} else {
					ls.save(this.state.chatKey, this.state.messages);
				}
			});
	}

	loadMore() {
		this.state.maxCount = this.state.maxCount + 30;
		this.listenForItems();
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
			>
				<View style={{ flex: 1, zIndex: 100 }}>
					<Header
						logoName=""
						option=""
						iconName="close"
						modalClose={() => this.setState({ isOpenModal: false })}
					/>
					<View style={styles.profilPicContainer}>
						<Image style={{ width: '100%', height: '100%' }} source={{uri: this.state.profilePicture}} />
					</View>
				</View>
			</Modal>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<Header option="Go back" iconName="" logoName={this.state.logoName} />
				<GiftedChat
					messages={this.state.messages}
					onSend={this.onSend}
					user={{
						_id: this.props.userID
					}}
					withinDist={1}
					keyboardShouldPersistTaps="never"
					loadEarlier={this.state.showLoadMore}
					renderLoadEarlier={() => (
						<TouchableOpacity style={styles.loadMoreContainer} onPress={this.loadMore.bind(this)}>
							<Text style={{ fontSize: 12, color: '#fff' }}>Messages précédent</Text>
						</TouchableOpacity>
					)}
				/>
				{this.renderModal()}
			</View>
		);
	}
}

export { Chat };
