import React, { Component } from 'react';
import {
	View,
	Text,
	ListView,
	Image,
	TouchableOpacity,
	Platform,
	Dimensions,
	ActivityIndicator,
	FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TimerMixin from 'react-timer-mixin';
import OneSignal from 'react-native-onesignal';
import { BoxShadow } from 'react-native-shadow';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import ls from 'react-native-local-storage';

import styles from './styles';
import images from '../../config/images';
import config from '../../config/config.js';

const { width } = Dimensions.get('window');
const reactMixin = require('react-mixin');

class MyMoms extends Component {
	constructor(props) {
		super(props);

		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const ds1 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			loading: false,
			dataSource: ds.cloneWithRows([]),
			//closeRange: ds1.cloneWithRows([]),
			//farRange: ds2.cloneWithRows([]),
			friends: [],
			unreadMessages: 0
		};

		this.session_token = '';
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

	componentWillUnmount() {
		OneSignal.removeEventListener('received', this.onReceived);
		OneSignal.removeEventListener('opened', this.onOpened);
		OneSignal.removeEventListener('registered', this.onRegistered);
		OneSignal.removeEventListener('ids', this.onIds);
	}

	onReceived(notification) {
		if (notification.payload.additionalData.p2p_notification.type === 'message') {
			this.autoSearch();
		}
	}

	onOpened() { }

	onRegistered() { }

	onIds() { }

	autoSearch() {
		this.setState({ loading: true });
		axios({
			method: 'get',
			url: config.baseUrl.concat('viewFriends'),
			headers: config.headers,
			params: {
				id: this.props.userID,
				user_id: this.props.userID,
				session_token: this.session_token
			}
		})
			.then(response => {
				let datas = [];
				let unreadMessages = 0;
				for (let i = 0; i < response.data.users.length; i++) {
					let count = 0;
					count = response.data.users[i].chat.read_user1;
					if (response.data.users[i].chat.user1 === this.props.userID) {
						count = response.data.users[i].chat.read_user2;
					}
					if (count !== 0) {
						unreadMessages += 1;
					}
					const user = {
						name: response.data.users[i].name.concat(' ', response.data.users[i].surname),
						imageSource: response.data.users[i].picture,
						id: response.data.users[i].id,
						friendCount: response.data.users[i].friendCount,
						chatCount: count,
						withinDist: response.data.users[i].within_dist
					};
					datas.push(user);
				}
				datas = datas.sort((a, b) => parseFloat(b.chatCount) - parseFloat(a.chatCount));
				//const closeRange = [...datas].filter(i => i.withinDist === 1);
				//const farRange = [...datas].filter(i => i.withinDist === 0);

				const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
				//const ds1 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
				//const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
				this.setState({
					dataSource: ds.cloneWithRows(datas),
					//closeRange: ds1.cloneWithRows(closeRange),
					//farRange: ds2.cloneWithRows(farRange),
					friends: datas,
					unreadMessages,
					loading: false
				});
			})
			.catch(() => { });
	}

	renderCard(rowData) {
		const reviewFriends = () => {
			this.autoSearch();
			this.props.getFriends();
		};
		const deleteFriend = () => {
			this.autoSearch();
			this.props.deleteFriend();
		};
		const unRead = rowData.chatCount === 0 ? undefined : true;
		return (
			<TouchableOpacity
				style={styles.cardMom}
				onPress={() =>
					Actions.momprofile({
						id: rowData.id,
						langs: this.props.langs,
						userID: this.props.userID,
						user: this.props.user,
						unRead,
						reviewFriends,
						deleteFriend
					})
				}
			>
				<View style={styles.profilPicContainer}>
					<Image
						style={styles.profilPic}
						source={rowData.imageSource !== 'none' ? { uri: rowData.imageSource } : images.avatar}
					/>
				</View>
				<View style={styles.textInformation}>
					<Text style={styles.momNameText}>{rowData.name}</Text>
					<View style={styles.rencontresContainer}>
						<Text style={styles.rencontresNumber}>{rowData.friendCount} </Text>
						<Text style={styles.rencontresText}>{rowData.friendCount === 1 ? 'contact' : 'contacts'}</Text>
					</View>
				</View>
				{rowData.chatCount !== 0 && (
					<Icon
						name="circle"
						size={14}
						style={{ position: 'absolute', left: '95%', top: -4 }}
						color={'#30B5E3'}
					/>
				)}
			</TouchableOpacity>
		);
	}

	renderFriends(dataSource) {
		const shadowOpt = {
			width: width * 0.45,
			height: 140,
			color: '#000',
			border: 1,
			radius: 1,
			opacity: 0.1,
			x: 0,
			y: 3,
			style: {
				marginVertical: 5,
				marginHorizontal: 1,
				marginLeft: '2%',
				marginRight: '2%',
				marginBottom: '5%',
				marginTop: '2%'
			}
		};

		if (this.state.friends.length !== 0) {
			//const isClose = dataSource === 'closeRange';
			return (
				<View style={{ marginTop: 5 }}>
					<Text style={{ color: 'black', marginBottom: 5, height: 10 }}>
					</Text>

					<ListView
						contentContainerStyle={styles.listStyle}
						dataSource={this.state[dataSource]}
						renderRow={rowData => {
							if (Platform.OS === 'android') {
								return <BoxShadow setting={shadowOpt}>{this.renderCard(rowData)}</BoxShadow>;
							}
							return this.renderCard(rowData);
						}}
					/>
				</View>
			);
		}
		return (
			<View style={styles.noFriendsContainer}>
				<Text style={{ fontSize: 18 }}>Votre liste de contacts est vide</Text>
			</View>
		);
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={[styles.container, { justifyContent: 'space-between' }]}>
					<ActivityIndicator size="small" color="#bc0e91" />
				</View>
			);
		};
		return (
			<View style={styles.container}>
				<View style={styles.resultListContainer}>
					<Text style={{ justifyContent: 'center', backgroundColor: '#FDFDFD' }}>Mes contacts</Text>
					{/* TODO: What is this ? */}
					<FlatList
						dataSource={this.state.dataSource}
						renderItem={({ item }) => <Text>{item.key}</Text>}
					/>

					<View style={styles.listContainer}>{this.renderFriends('dataSource')}
					</View>
				</View>
			</View>
		);
	}
}

reactMixin(MyMoms.prototype, TimerMixin);

export default MyMoms;
