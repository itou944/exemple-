import React, { Component } from 'react';
import { View, ActivityIndicator, LayoutAnimation } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import OneSignal from 'react-native-onesignal';
import ls from 'react-native-local-storage';
import { Actions } from 'react-native-router-flux';

import FooterTabBar from './FooterTabBar';
import Profile from './../Profile/Profile';
import Search from './../Search/Search';
import Chatlist from './../Chatlist/Chatlist';
import Forum from './../Forum/Forum';
import Articles from './../Articles/Articles';
import Reductions from './../Reductions/Reductions';
import { Header } from '../../components';
import styles from './styles';
import config from '../../config/config.js';

const reactMixin = require('react-mixin');


class Home extends Component {
	constructor(props) {
		super(props);


		//Get the user Languages
		const userLangs = [];
		let userLangsPlaceholder = '';
		for (let i = 0; i < props.data.user_languages.length; i++) {
			for (let j = 0; j < props.data.languages.length; j++) {
				if (
					props.data.user_languages[i].language_id === props.data.languages[j].id &&
					props.data.user_languages[i].deleted_at === null
				) {
					userLangs.push(props.data.languages[j].name);
					if (userLangsPlaceholder !== '') {
						userLangsPlaceholder = userLangsPlaceholder.concat(', ');
					}
					userLangsPlaceholder = userLangsPlaceholder.concat(props.data.languages[j].name);
				}
			}
		}

		//Get the user hobbies
		const userHobbies = [];
		let userHobbiesPlaceholder = '';
		for (let i = 0; i < props.data.user_hobbies.length; i++) {
			if (props.data.user_hobbies[i].deleted_at === null) {
				userHobbies.push(props.data.user_hobbies[i].name);
				if (userHobbiesPlaceholder !== '') {
					userHobbiesPlaceholder = userHobbiesPlaceholder.concat(', ');
				}
				userHobbiesPlaceholder = userHobbiesPlaceholder.concat(props.data.user_hobbies[i].name);
			}
		}

		//Get the children data
		let children = [];
		for (let i = 0; i < props.data.children.length; i++) {
			const child = {
				languages: [],
				age: this.getAge(props.data.children[i].bdate),
				months: this.getMonths(props.data.children[i].bdate) || 0,
				days: this.getDays(props.data.children[i].bdate),
				hobbies: [],
				birthDate: props.data.children[i].bdate,
				childID: props.data.children[i].id,
				childIndex: i + 1
			};

			//Get the child languages
			const languages = [];
			for (let m = 0; m < props.data.children[i].languages.length; m++) {
				for (let j = 0; j < props.data.languages.length; j++) {
					if (
						props.data.children[i].languages[m].id === props.data.languages[j].id &&
						props.data.children[i].languages[m].deleted_at === null
					) {
						languages.push(props.data.languages[j].name);
					}
				}
			}
			child.languages = languages;

			//Get the child hobbies
			const hobbies = [];
			for (let z = 0; z < props.data.children[i].child_hobbies.length; z++) {
				if (props.data.children[i].child_hobbies[z].deleted_at === null) {
					hobbies.push(props.data.children[i].child_hobbies[z].name);
				}
			}

			child.hobbies = hobbies;

			if (props.data.children[i].deleted_at === null) {
				children.push(child);
			}
		}
		children = children.sort((a, b) => parseFloat(b.age) - parseFloat(a.age));

		let source = props.data.user.picture;
		try {
			if (this.props.imageSource !== undefined) {
				source = this.props.imageSource;
			}
		} catch (e) {
			source = props.data.user.picture;
		}
		this.state = {
			loading: false,
			page: 0,
			newFriend: false,
			openMymoms: false,

			name: props.data.user.name,
			cogname: props.data.user.surname,
			fullName: props.data.user.name.concat(' ', props.data.user.surname),
			imageSource: source,
			languages: userLangs,
			hobbies: userHobbies,
			userLangsPlaceholder,
			userHobbiesPlaceholder,
			deviceId: props.data.user.device_id,
			sliderValue: '',
			isModalOpen: false,
			modalTitle: '',
			child: {
				languages: ['', ''],
				age: 5,
				hobbies: ['', ''],
				birthDate: '10/10/2005'
			},
			children,
			dataSource: userLangs,
			userID: props.data.user.id,
			childID: 1,
			radius: props.data.radius,
			requestsNumber: 0,
			unreadMessages: 0,
			usersByRadius: props.usersByRadius,
			userFriends: [],
			chatList: []
		};
		this.session_token = '';
	}

	componentWillMount() {
		ls.get('chatList').then(chatList => {
			this.setState({ chatList });
			ls.get('session_token').then(sessionToken => {
				this.session_token = sessionToken;
				this.getFriends();
				this.getRequests();
			});
		});

		OneSignal.addEventListener('received', this.onReceived.bind(this));
		OneSignal.addEventListener('opened', this.onOpened.bind(this));
		OneSignal.addEventListener('registered', this.onRegistered);
		OneSignal.addEventListener('ids', this.onIds);

		OneSignal.inFocusDisplaying(0);
	}

	componentDidMount() {
		ls.get('notifData').then(notifData => {
			if (notifData !== null) {
				if (notifData.type === 'message') {
					this.setState({ page: 2 });
					this.setState({ unreadMessages: 1 });
				}
				if (notifData.type === 'request') {
					Actions.friendRequest({
						userID: this.state.userID,
						langs: this.props.data.languages,
						user: this.state
					});
					ls.save('notifData', null);
				}
				if (notifData.type === 'accept' || notifData.type === 'acceptFriend') {
					this.setState({ openMymoms: true, loading: true });
					setTimeout(() => {
						this.setState({ loading: false });
						setTimeout(() => {
							this.setState({ openMymoms: false });
						}, 3000);
					}, 1000);
					ls.save('notifData', null);
				}
			}
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
			this.getFriends();
			this.setState({ unreadMessages: 1 });
		}
		if (notification.payload.additionalData.p2p_notification.type === 'request') {
			this.getRequests();
		}
		if (
			notification.payload.additionalData.p2p_notification.type === 'accept' ||
			notification.payload.additionalData.p2p_notification.type === 'delete'
		) {
			this.getFriends();
			setTimeout(() => {
				this.setState({
					loading: true,
					newFriend: true
				});
			}, 1);
			setTimeout(() => {
				this.setState({ loading: false });
			}, 1000);
		}
	}

	onOpened() {}

	onRegistered() {}

	onIds() {}

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

	getMonths(fromdt) {
		const todate = new Date();
		const fromdate = new Date(fromdt);

		const y = [todate.getFullYear(), fromdate.getFullYear()];
		let ydiff = y[0] - y[1];
		const m = [todate.getMonth(), fromdate.getMonth()];
		let mdiff = m[0] - m[1];
		const d = [todate.getDate(), fromdate.getDate()];
		let ddiff = d[0] - d[1];

		if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) {
			--ydiff;
		}
		if (mdiff < 0) {
			mdiff += 12;
		}
		if (ddiff < 0) {
			fromdate.setMonth(m[1] + 1, 0);
			ddiff = fromdate.getDate() - d[1] + d[0];
			--mdiff;
		}
		return ydiff * 12 + mdiff;
	}

	getDays(dateVar) {
		const dToday = new Date();
		const dDate = new Date(dateVar);
		const dVar = [dToday.getTime(), dDate.getTime()];
		let dDiffTime = dVar[0] - dVar[1];
		let dDiffDays = dDiffTime / (1000 * 3600 * 24);

		return Math.floor(dDiffDays);
	}

	getFriends() {
		axios({
			method: 'get',
			url: config.baseUrl.concat('viewFriends'),
			headers: config.headers,
			params: {
				id: this.state.userID,
				user_id: this.state.userID,
				session_token: this.session_token
			}
		})
			.then(response => {

				let count = 0;
				for (let i = 0; i < response.data.users.length; i++) {
					if (response.data.users[i].chat.user1 === this.state.userID) {
						count += response.data.users[i].chat.read_user2;
					} else {
						count += response.data.users[i].chat.read_user1;
					}
				}

				const datas = [];
				for (let i = 0; i < response.data.users.length; i++) {
					const chatKey = response.data.users[i].chat.chat_key;
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
						lastMessage: []
					};
					datas.push(user);
				}

				ls.save('userFriends', datas);
				this.setState({ 
					userFriends: datas,
					unreadMessages: count,
					loading: false 
					});
			})
			.catch(error => {

				ls.get('userFriends').then(userFriends => {
					this.setState({ userFriends, loading: false });
				});
			});
	}

	getRequests() {
		axios({
			method: 'get',
			url: config.baseUrl.concat('viewRequests'),
			headers: config.headers,
			params: {
				id: this.props.data.user.id,
				session_token: this.session_token
			}
		})
			.then(resp => {
				this.setState({ requestsNumber: '' });
				if (resp.data.usersClose.length > 0) {
					this.setState({ requestsNumber: resp.data.usersClose.length });
				}
			})
			.catch(error => {
				this.setState({ loading: false });
			});
	}

	renderFooter() {
		return (
			<FooterTabBar
				requestsNumber={this.state.requestsNumber}
				unreadMessages={this.state.unreadMessages}
				hideUnread={() => {
					this.setState({ unreadMessages: 0 });
				}}
				startLoading={() => {
					LayoutAnimation.easeInEaseOut();
					this.getRequests();
					this.setState({ loading: true });
				}}
				finishLoading={() => {
					LayoutAnimation.easeInEaseOut();
					this.setState({ loading: false });
				}}

			/>
		);
	}

	renderHeader() {
		return (
			<Header
				option=""
				iconName="bell"
				userID={this.state.userID}
				langs={this.props.data.languages}
				requestsNumber={this.state.requestsNumber}
				fullName={this.state.fullName}
				user={this.state}
				getRequests={() => {
					this.getRequests();
				}}
				getFriends={() => {
					setTimeout(() => {
						this.setState({ loading: true });
					}, 1);
					setTimeout(() => {
						this.setState({ loading: false });
					}, 100);
				}}
			/>
		);
	}

	renderProfile() {
		return (
			<Profile
				propsData={this.props.data}
				data={this.state}
				userID={this.state.userID}
				userFriends={this.state.userFriends}
				langs={this.props.data.languages}
				user={this.state}
				openMymoms={this.state.openMymoms}
				getFriends={() => {
					this.getFriends();
				}}
				getRequests={() => {
					this.getRequests();
				}}
				deleteFriend={() => {
					this.getFriends();
					this.getRequests();
					setTimeout(() => {
						this.setState({ loading: true });
					}, 1);
					setTimeout(() => {
						this.setState({ loading: false });
					}, 1000);
				}}
			/>
		);
	}

	renderSearch() {
		if (this.state.loading) {
			return (
				<View style={{ flex: 1 }}>
					<Header option="" iconName="" />
					<ActivityIndicator style={{ marginTop: '50%' }} size="small" color="#bc0e91" />
				</View>
			);
		}
		return (
			<View style={{ flex: 1 }}>
				<Search
					userID={this.state.userID}
					langs={this.props.data.languages}
					user={this.state}
					toSearch
					renderHeader={() => this.renderHeader()}
					requestsNumber={this.state.requestsNumber}
				/>
			</View>
		);
	}

	renderChatlist() {
		return (
			<View style={{ flex: 1 }}>
				<Chatlist
					data={this.state.chatList}
					userID={this.state.userID}
					user={this.state}
					getFriends={() => {
						this.getFriends();
					}}
					langs={this.props.data.languages}
				/>
			</View>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{ width: '100%', height: '100%' }}>
					<ScrollableTabView
						tabBarPosition="bottom"
						tabBarActiveTextColor="#FFFFFF"
						tabBarInactiveTextColor="#C389AD"
						initialPage={0}
						locked
						page={this.state.page}
						onChangeTab={tab => {
							this.setState({ page: tab.i });
						}}
						renderTabBar={() => this.renderFooter()}
					>
						
						<View tabLabel="user-circle" tabName="Mon Profil" style={styles.tabView}>
							{this.renderProfile()}
						</View>
						<View tabLabel="search" tabName="Recherche" style={styles.tabView}>
							{this.renderSearch()}
						</View>
						<View tabLabel="envelope-o" tabName="Mes Mamans" style={styles.tabView}>
							{this.renderChatlist()}
						</View>
						<View tabLabel="comments" tabName="Forum" style={styles.tabView}>
							<Forum user={this.state} userID={this.state.userID} />
						</View>
						<View tabLabel="file-text" tabName="Articles" style={styles.tabView}>
							<Articles userID={this.state.userID} />
						</View>
						<View tabLabel="percent" tabName="Réductions" style={styles.tabView}>
							<Reductions userID={this.state.userID} />
							
						</View>
					</ScrollableTabView>
				</View>
			</View>
		);
	}
}


reactMixin(Home.prototype, TimerMixin);

export { Home };
