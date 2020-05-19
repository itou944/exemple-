import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ListView,
	Alert,
	ActivityIndicator,
	Dimensions,
	LayoutAnimation
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import axios from 'axios';
import firebase from 'firebase';
import OneSignal from 'react-native-onesignal';
import ls from 'react-native-local-storage';
import { Header, ModalSource } from '../../components';
import styles from './styles';
import config from '../../config/config.js';
import images from '../../config/images';

const { width } = Dimensions.get('window');

class MomProfile extends Component {
	constructor(props) {
		super(props);


		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const ds3 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const ds4 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

		this.state = {
			loading: true,
			isModalOpen: false,
			starCount: 3.5,
			modalTitle: '',
			unRead: props.unRead,
			follow: false,
			status: props.status,
			deviceId: '',
			receiver: props.receiver,

			firstName: '',
			name: '',
			age: '',
			imageSource: 'none',
			hobbies: '',
			languages: '',
			withinDist: 1,

			userHobbies: [],
			userLangs: [],
			dynDataModal: {
				name: [],
				icons: [],
				check: []
			},
			modalSource: ds4.cloneWithRows(ModalSource.userHobbies),

			dataSource: ds.cloneWithRows([{ name: '', imageSource: 'none', age: '' }]),
			children: ds2.cloneWithRows([
				{ childIndex: 1, age: 5, languages: ['', ''], hobbies: ['', ''] }
			]),
			modalList: ds3.cloneWithRows(['', '']),
			kids: [],

			wasDeleted: false,
			keyToDelete: ''
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
			this.getData();
		});
		this.itemsRef = firebase.database().ref('chats');
	}

	componentWillUnmount() {
		OneSignal.removeEventListener('received', this.onReceived);
		OneSignal.removeEventListener('opened', this.onOpened);
		OneSignal.removeEventListener('registered', this.onRegistered);
		OneSignal.removeEventListener('ids', this.onIds);
	}

	onReceived(notification) {
		if (notification.payload.additionalData.p2p_notification.type === 'delete') {
			Actions.pop();
		}
		if (notification.payload.additionalData.p2p_notification.type === 'message') {
			//this.setState({ unRead: true });
		}
		if (notification.payload.additionalData.p2p_notification.type === 'acceptFriend') {
			this.setState({ loading: true, follow: false, status: undefined });

			this.getData();
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
		const d = [todate.getTime(), fromdate.getTime()];
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

	getData() {
		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		axios({
			method: 'get',
			url: config.baseUrl.concat('getUser'),
			headers: config.headers,
			params: {
				id: this.props.id,
				user_id: this.props.userID,
				session_token: this.session_token
			}
		})
			.then(response => {
				console.log(response.data);
				this.fillState(response.data);
			})
			.catch(() => {});
		axios({
			method: 'get',
			url: config.baseUrl.concat('viewFriends'),
			headers: config.headers,
			params: {
				id: this.props.id,
				user_id: this.props.userID,
				session_token: this.session_token
			}
		})
			.then(response => {
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
					dataSource: ds.cloneWithRows(users)
				});
			})
			.catch(() => {});
	}

	fillState(data) {
		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		//Get the user Languages
		let userLangs = ' ';
		const languages = [];
		for (let i = 0; i < data.user.languages.length; i++) {
			for (let j = 0; j < this.props.langs.length; j++) {
				if (
					data.user.languages[i].language_id === this.props.langs[j].id &&
					data.user.languages[i].deleted_at === null
				) {
					if (userLangs !== ' ') {
						userLangs += ', ';
					}
					userLangs += this.props.langs[j].name;
					languages.push(this.props.langs[j].name);
				}
			}
		}

		//Get the user Hobbies
		let userHobbies = ' ';
		const hobbies = [];
		for (let i = 0; i < data.user.user_hobbies.length; i++) {
			if (data.user.user_hobbies[i].deleted_at === null) {
				if (userHobbies !== ' ') {
					userHobbies += ', ';
				}
				userHobbies += data.user.user_hobbies[i].name;
				hobbies.push(data.user.user_hobbies[i].name);
			}
		}

		//Get the children data
		let children = [];
		for (let i = 0; i < data.user.children.length; i++) {
			const child = {
				childIndex: i + 1,
				age: this.getAge(data.user.children[i].bdate),
				months: this.getMonths(data.user.children[i].bdate) || 0,
				days: this.getDays(data.user.children[i].bdate),
				languages: [],
				hobbies: []
			};

			//Get the child languages
			for (let m = 0; m < data.user.children[i].languages.length; m++) {
				for (let n = 0; n < this.props.langs.length; n++) {
					if (
						data.user.children[i].languages[m].id === this.props.langs[n].id &&
						data.user.children[i].languages[m].deleted_at === null
					) {
						child.languages.push(this.props.langs[n].name);
					}
				}
			}

			//Get the child hobbie
			for (let z = 0; z < data.user.children[i].child_hobbies.length; z++) {
				if (data.user.children[i].child_hobbies[z].deleted_at === null) {
					child.hobbies.push(data.user.children[i].child_hobbies[z].name);
				}
			}

			if (data.user.children[i].deleted_at === null) {
				children.push(child);
			}
		}
		children = children.sort((a, b) => parseFloat(b.age) - parseFloat(a.age));
		this.setState({
			name: data.user.name.concat(' ', data.user.surname),
			firstName: data.user.name,
			lastName: data.user.surname,
			imageSource: data.user.picture,
			age: this.getAge(data.user.bdate),
			languages: userLangs,
			hobbies: userHobbies,
			deviceId: data.user.device_id,
			children: ds.cloneWithRows(children),
			kids: children,
			withinDist: data.within_dist,

			userHobbies: hobbies,
			userLangs: languages,
			loading: false
		});

		if (this.props.unRead !== undefined) {
			this.goToChat();
		}
	}

	addFriend() {
		axios({
			method: 'post',
			url: config.baseUrl.concat('friendRequest'),
			headers: config.headers,
			data: {
				id: this.props.userID,
				friend: this.props.id,
				session_token: this.session_token
			}
		})
			.then(() => {
				this.setState({ status: 0 });
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
						console.log(response);
						console.log(response.data.device_id);
						if (response.data.device_id !== null) {
							OneSignal.postNotification(
								{
									en: "Vous avez une nouvelle demande d'amie"
								}, // No content
								{
									type: 'request',
									id: this.props.userID
								}, // data
								response.data.device_id, // recipient
								// other params, as introduced in this PR
								{
									priority: 1
								}
							);
						}
					})
					.catch(() => {});
			})
			.catch(() => {});
	}

	acceptRequest() {
		this.setState({ loading: true });
		this.itemsRef.push({ title: 'hello test end' });

		this.itemsRef.once('value', snap => {
			// get children as an array
			const key = Object.keys(snap.val())[Object.keys(snap.val()).length - 1];

			axios({
				method: 'post',
				url: config.baseUrl.concat('acceptRequest'),
				headers: config.headers,
				data: {
					id: this.props.userID,
					friend: this.props.id,
					key,
					session_token: this.session_token
				}
			})
				.then(() => {
					//this.props.get
					ls.get('userFriends').then(userFriends => {
						const user = {
							name: this.state.name.concat(' ', this.state.cogname),
							imageSource: this.state.imageSource,
							id: this.props.id,
							friendCount: 0,
							chatCount: 0
						};
						userFriends.push(user);
						ls.save('userFriends', userFriends);
						this.state.follow = undefined;
						this.state.receiver = undefined;
						this.state.status = undefined;
						this.setState({
							follow: undefined,
							receiver: undefined,
							status: undefined,
							loading: false
						});
						this.props.deleteFriend();
					});
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
							console.log(response);
							console.log(response.data.device_id);
							if (response.data.device_id !== null) {
								OneSignal.postNotification(
									{
										en: 'Vous êtes maintenant amie avec '.concat(
											this.props.user.name,
											' ',
											this.props.user.cogname
										)
									}, // No content
									{
										type: 'accept',
										id: this.props.userID
									}, // data
									response.data.device_id, // recipient
									// other params, as introduced in this PR
									{
										priority: 1
									}
								);
							}
						})
						.catch(() => {});
					this.props.deleteFriend();
				})
				.catch(() => {});
		});
	}

	deleteFriend() {
		this.setState({ loading: true });
		axios({
			method: 'post',
			url: config.baseUrl.concat('unfriend'),
			headers: config.headers,
			data: {
				id: this.props.userID,
				friend: this.props.id,
				session_token: this.session_token
			}
		})
			.then(() => {
				this.setState({ follow: true, loading: false });

				Alert.alert(
					'',
					this.state.name.concat(" n'est plus ton amie"), //' is not your friend anymore'
					[{ text: 'Ok', onPress: () => {} }],
					{ cancelable: false }
				);

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
						console.log(response);
						console.log(response.data.device_id);
						if (response.data.device_id !== null) {
							OneSignal.postNotification(
								{
									en: "Une amie vous a supprimé de ses contacts"
								}, // No content We are sorry to inform you that someone unfriended you
								{
									type: 'delete',
									id: this.props.userID
								}, // data
								response.data.device_id, // recipient
								// other params, as introduced in this PR
								{
									priority: 1
								}
							);
						}
					})
					.catch(() => {});
				this.props.deleteFriend();
			})
			.catch(() => {});
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
				this.itemsRef.child(response.data.chat_key).remove(() => {});

				this.setState({ loading: false });
			})
			.catch(() => {
				this.setState({ loading: false });
			});
	}

	goTo(id) {
		this.setState({ loading: true });
		if (id === this.props.userID) {
			Actions.pop();
		} else {
			axios({
				method: 'get',
				url: config.baseUrl.concat('getStatus'),
				headers: config.headers,
				params: {
					id1: id,
					id2: this.props.userID,
					session_token: this.session_token
				}
			})
				.then(response => {
					if (response.data.status === 'none') {
						this.setState({ loading: false });

						Actions.friendRequest({
							friendID: id,
							langs: this.props.langs,
							userID: this.props.userID
						});
					} else if (response.data.status === 0) {
						Actions.friendRequest({
							status: 0,
							id,
							langs: this.props.langs,
							userID: this.props.userID,
							user: this.props.user,
							receiver: response.data.entry.friend_id,
							deleteFriend: this.props.deleteFriend
						});
						this.setState({ loading: false });
					} else {
						this.setState({ loading: false });
						Actions.momprofile({
							id,
							langs: this.props.langs,
							userID: this.props.userID,
							user: this.props.user,
							deleteFriend: this.props.deleteFriend
						});
					}
				})
				.catch(() => {
					this.setState({ loading: false });
				});
		}
	}

	goToChat() {
		this.state.unRead = undefined;
		this.setState({ unRead: undefined });
		const getBack = () => {
			this.setState({ unRead: undefined });
		};
		Actions.chat({
			id: this.props.id,
			userID: this.props.userID,
			user: this.props.user,
			friend: this.state,
			langs: this.props.langs,
			getBack,
			reviewFriends: this.props.reviewFriends
		});
	}

	openInModal(listData, title) {
		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

		switch (title) {
			case 'Hobbies':
				this.state.dynDataModal.name = ModalSource.userHobbies;
				this.state.dynDataModal.icons = ModalSource.userHobbiesIcons;
				break;
			case 'Children Hobbies':
				this.state.dynDataModal.name = ModalSource.childrenHobbies;
				this.state.dynDataModal.icons = ModalSource.childrenHobbiesIcons;
				break;
			default:
				this.state.dynDataModal.name = ModalSource.languages;
				this.state.dynDataModal.icons = ModalSource.languagesIcons;
		}
		this.setState({
			modalTitle: title,
			modalList: ds.cloneWithRows(listData),
			isOpenModal: true,
			modalSource: ds2.cloneWithRows(listData)
		});
	}

	renderButton() {
		if (this.state.receiver === this.props.userID) {
			return (
				<TouchableOpacity style={styles.buttonContainer} onPress={this.acceptRequest.bind(this)}>
					<Text style={styles.buttonText}>Accepter</Text>
					<Text style={styles.buttonArrow}>
						<Icon name="angle-right" size={22} color="#fff" />
					</Text>
				</TouchableOpacity>
			);
		}
		if (this.state.status !== undefined) {
			return (
				<View style={[styles.buttonContainer, { backgroundColor: '#A4A4A4' }]}>
					<Text style={styles.buttonText}>En attente de réponse</Text>
				</View>
			);
		}
		if (this.state.follow) {
			return (
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => {
						Alert.alert(
							'',
							'Êtes-vous sûr de vouloir suivre cet utilisateur ?', //Are you sure you want to follow this user?
							[
								{ text: 'Oui', onPress: () => this.addFriend() },
								{ text: 'Non', onPress: () => {} }
							],
							{ cancelable: false }
						);
					}}
				>
					<Text style={styles.buttonText}>Suivre</Text>
					<Text style={styles.buttonArrow}>
						<Icon name="angle-right" size={22} color="#fff" />
					</Text>
				</TouchableOpacity>
			);
		}
		return (
			<TouchableOpacity
				style={styles.buttonContainer}
				onPress={() => {
					Alert.alert(
						'',
						'Vous allez supprimer '.concat(
							this.state.name,
							' de vos contacts. Êtes-vous certaine?'
						), //'You are about to unfollow '.concat(this.state.name, '. Are you sure?')
						[
							{ text: 'Oui', onPress: () => this.deleteFriend() },
							{ text: 'Non', onPress: () => {} }
						],
						{ cancelable: false }
					);
				}}
			>
				<Text style={styles.buttonText}>Supprimer de mes contacts</Text>
				<Text style={styles.buttonArrow}>
					<Icon name="angle-right" size={22} color="#fff" />
				</Text>
			</TouchableOpacity>
		);
	}

	renderCard(rowData) {
		return (
			<TouchableOpacity style={styles.cardMomContainer} onPress={this.goTo.bind(this, rowData.id)}>
				<View style={styles.cardPictureContainer}>
					<Image
						style={styles.cardPictureStyle}
						source={rowData.imageSource !== 'none' ? { uri: rowData.imageSource } : images.avatar}
					/>
				</View>
				<View style={styles.cardInformationContainer}>
					<Text style={styles.cardNameStyle}>{rowData.name}</Text>
					<Text style={styles.cardCommentStyle}>{rowData.age} ans</Text>
				</View>
				<View style={styles.cardMomsNumberContainer}>
					<Text style={styles.cardMomsNumber}>
						{rowData.friendCount} {rowData.friendCount === 1 ? 'contact' : 'contacts'}
					</Text>
					<Text />
				</View>
			</TouchableOpacity>
		);
	}

	renderChildren(rowData) {
		const dynWidth = this.state.kids.length > 1 ? width * 0.9 : width * 0.97;
		let age = '';

		if (rowData.days > 729) {
			age = ''.concat(rowData.age, ' ans');
		} else if (rowData.days > 30) {
			age = ''.concat(rowData.months, ' mois');
		} else {
			age = rowData.days > 1 ? ''.concat(rowData.days, ' jours') : ''.concat(rowData.days, ' jour');
		}

		return (
			<View style={[styles.firstKidBox, { width: dynWidth }]}>
				<View style={styles.premierEfantContainer}>
					<Text style={styles.premierEfantText}>
						{ModalSource.ordinal[this.state.kids.indexOf(rowData)][0] || ''} enfant
					</Text>
				</View>
				<View style={styles.enfantDetails}>
					<TouchableOpacity
						style={styles.kidField}
						onPress={this.openInModal.bind(this, rowData.languages, 'Languages')}
					>
						<Text style={styles.nameField}>Langues</Text>
						<View style={styles.cardHobbiesNumber}>
							<Text style={{ color: '#fff' }}>{rowData.languages.length}</Text>
						</View>
					</TouchableOpacity>
					<View style={[styles.kidField, styles.middleDetail]}>
						<Text style={styles.nameField}>Age de l'enfant</Text>
						<Text style={styles.valueField}>{age}</Text>
					</View>
					<TouchableOpacity
						style={styles.kidField}
						onPress={this.openInModal.bind(this, rowData.hobbies, 'Children Hobbies')}
					>
						<Text style={styles.nameField}>Loisirs</Text>
						<View style={styles.cardHobbiesNumber}>
							<Text style={{ color: '#fff' }}>{rowData.hobbies.length}</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
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
			>
				<View style={{ flex: 1, zIndex: 100 }}>
					<View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
						<Header
							logoName={this.state.modalTitle === 'Languages' ? 'Langues' : 'Loisirs'}
							option="PreviousBox"
							iconName=""
							modalClose={() => {
								this.setState({
									isOpenModal: false
								});
							}}
							langID={0}
						/>
						<View style={{ width: '100%', height: '1%' }} />
						<ListView
							dataSource={this.state.modalSource}
							renderRow={rowData => this.renderModalCard(rowData, this.state.dynDataModal)}
							removeClippedSubviews={false}
						/>
					</View>
				</View>
			</Modal>
		);
	}

	renderModalCard(rowData, dataSource) {
		const index = dataSource.name.indexOf(rowData);

		const backgroundColor = '#fff';
		const textColor = '#bc0e91';
		const iconSource = dataSource.icons[index][1];

		return (
			<View style={[styles.cardHobbieContainer, { backgroundColor }]}>
				<View style={{ flexDirection: 'row' }}>
					<Image style={{ width: 25, height: 25, marginRight: 10 }} source={iconSource} />
					<Text style={{ color: textColor, fontSize: 16 }}>{rowData}</Text>
				</View>
			</View>
		);
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={styles.container}>
					<Header option="Go back" iconName="" logoName="Profil" />
					<ActivityIndicator style={{ marginTop: '50%' }} size="small" color="#bc0e91" />
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<Header
					option="Go back"
					iconName=""
					logoName="Profil"
					modalToOpen={() =>
						this.setState({
							isOpenModal: true,
							modalTitle: 'Give your review'
						})
					}
				/>

				<View style={styles.profileContainer}>
					<View style={styles.userInformationContainer}>
						<View style={styles.profilePictureContainer}>
							<Image
								style={styles.profilePictureStyle}
								source={
									this.state.imageSource !== 'none'
										? { uri: this.state.imageSource }
										: images.avatar
								}
							/>
						</View>
						<View style={styles.textInfoContainer}>
							<Text style={styles.nameTextStyle}>
								{this.state.name}
							</Text>
							<TouchableOpacity
								onPress={this.openInModal.bind(this, this.state.userLangs, 'Languages')}
							>
								<Text style={styles.languagesStyle}>
									Langues:
									{this.state.languages.length > 16
										? this.state.languages.substring(0, 16).concat('...')
										: this.state.languages}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
								onPress={this.openInModal.bind(this, this.state.userHobbies, 'Hobbies')}
							>
								<Text style={{ color: '#bc0e91', marginRight: '2%' }}>Loisirs</Text>
								<Icon name="angle-right" size={22} color="#bc0e91" />
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ width: '100%', height: '20%', marginBottom: 0 }}>
						<ListView
							horizontal
							dataSource={this.state.children}
							renderRow={rowData => this.renderChildren(rowData)}
							onMomentumScrollEnd={e => {
								LayoutAnimation.easeInEaseOut();
								this.setState({ index: Math.round(e.nativeEvent.contentOffset.x / (width - 20)) });
							}}
						/>
					</View>

					<View style={styles.ouiMomContainer}>{this.renderButton()}</View>

					<Text style={{ color: '#bc0e91', marginLeft: '5%' }}>Les amies de {this.state.name}</Text>
					<View style={styles.listCardsContiner}>
						<ListView
							dataSource={this.state.dataSource}
							renderRow={rowData => this.renderCard(rowData)}
						/>
					</View>
				</View>

				<View style={styles.navigationBar}>
					{this.state.status === undefined && !this.state.follow ? (
						<TouchableOpacity
							style={[styles.sendMessageContainer]}
							onPress={this.goToChat.bind(this)}
						>
							<Text style={[{ color: '#C389AD', fontSize: 20 }]}>Ecrire votre message</Text>

							<View style={styles.iconContainer}>
								<Icon name="envelope-o" size={25} color="#C389AD" />

								{this.state.unRead !== undefined ? (
									<View style={styles.unseenContainer}>
										<View style={styles.unseenPoint} />
										<Icon
						name="circle"
						size={14}
						style={{ position: 'absolute', left: '95%', top: -4 }}
						color={'#30B5E3'}
					/>
									</View>
								) : (
									<View />
								)}
							</View>
						</TouchableOpacity>
					) : (
						<View />
					)}
				</View>
				{this.renderModal()}
			</View>
		);
	}
}

export { MomProfile };
