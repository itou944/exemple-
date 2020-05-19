import React, { Component } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	ListView,
	Platform,
	Dimensions,
	FlatList,
	Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';
import { BoxShadow } from 'react-native-shadow';
import ls from 'react-native-local-storage';
import axios from 'axios';
import { connect } from 'react-redux';

import DeckSwiper from './DeckSwiper';

import * as actions from '../../actions';
import styles from './styles';
import images from '../../config/images';
import config from '../../config/config.js';
import strings from '../../config/strings.js';
import { Header, ModalSource } from '../../components';

const { width, height } = Dimensions.get('window');

const CancelToken = axios.CancelToken;

class Search extends Component {
	constructor(props) {
		super(props);

		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const ds3 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const ds4 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

		const Users = [];
		const Ids = [];

		let msg1 = strings.noMamanFound[this.props.langID];
		let msg2 = strings.tryIncrase[this.props.langID];
		if (this.props.friend !== undefined) {
			msg1 = strings.noMoreRequests[this.props.langID];
			msg2 = strings.tryAgain[this.props.langID];
		}

		const shadowOpt = {
			width: width * 0.9,
			height: height * 0.55,
			paddingLeft: '1%',
			paddingTop: '1%',
			color: '#000',
			border: 1,
			radius: 1,
			opacity: 0.1,
			x: 0,
			y: 3,
			style: {
				alignItems: 'center',
				marginVertical: 1
			}
		};

		this.state = {
			isModalOpen: false,
			modalTitle: '',
			noMoreMessage1: msg1,
			noMoreMessage2: msg2,
			loadChatKeys: false,
			userFriends: [],
			shadowOpt,
			dynDataModal: {
				name: [],
				icons: [],
				check: []
			},
			modalSource: ds4.cloneWithRows(ModalSource.userHobbies),

			Cards: Users,
			Ids,
			message: '',
			endList: false,
			loading: false,
			modalList: ds3.cloneWithRows(['', '']),
			isSearchShown: false,
			textSearch: '',
			isSearching: false,
			dataSource: ds.cloneWithRows([]),
			dataFriends: ds2.cloneWithRows([]),
			searchedUsers: []
		};

		this.session_token = '';
	}

	componentDidMount() {
		const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		ls.get('userFriends').then(userFriends => {
			this.setState({
				userFriends,
				dataFriends: ds2.cloneWithRows(userFriends)
			});
		});

		ls.get('session_token').then(sessionToken => {
			this.session_token = sessionToken;
			if (this.props.suggestedFriend === undefined) {
				this.refreshList();
			} else {
				this.setState({ loading: true });
				this.fillState([this.props.data]);
			}
		});

		this.cancelToken = CancelToken.source();
	}

	componentWillReceiveProps() {
		this.startFriends();
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

	fillState(resp) {
		const Data = this.props.suggestedFriend === undefined ? resp.data.usersClose : resp;
		const Users = [];
		const Ids = [];
		let message = '';
		for (let i = 0; i < Data.length; i++) {
			const user = {
				name: Data[i].name.concat(' ', Data[i].surname),
				age: this.getAge(Data[i].bdate),
				imageSource: Data[i].picture,
				languages: [],
				childAge: 0,
				childMonths: 0,
				id: Data[i].id,
				friendCount: Data[i].friendCount,
				deviceId: Data[i].device_id,
				hobbies: []
			};

			//Get the user Languages
			const userLangs = [];
			for (let m = 0; m < Data[i].languages.length; m++) {
				for (let n = 0; n < this.props.langs.length; n++) {
					if (
						Data[i].languages[m].id === this.props.langs[n].id &&
						Data[i].languages[m].deleted_at === null
					) {
						userLangs.push(this.props.langs[n].name);
					}
				}
			}
			user.languages = userLangs;

			//Get the user hobbies
			const userHobbies = [];
			for (let m = 0; m < Data[i].user_hobbies.length; m++) {
				if (Data[i].user_hobbies[m].deleted_at === null) {
					userHobbies.push(Data[i].user_hobbies[m].name);
				}
			}
			user.hobbies = userHobbies;

			//Get the first child ID
			let firstKid = this.getAge(Data[i].children[0].bdate);
			let firstKidBirthday = Data[i].children[0].bdate;

			for (let z = 0; z < Data[i].children.length; z++) {
				if (this.getAge(Data[i].children[z].bdate) > firstKid) {
					firstKid = this.getAge(Data[i].children[z].bdate);
					firstKidBirthday = Data[i].children[z].bdate;
				}
			}
			user.childAge = this.getAge(firstKidBirthday);
			user.childMonths = this.getMonths(firstKidBirthday);

			Users.push(user);
			Ids.push(user.id);
			message = 'Pas de suggestion';
		}

		this.setState({
			Cards: Users,
			Ids,
			message,
			endList: Users.length === 0,
			loading: false
		});
	}

	openInModal(listData, title) {
		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state.dynDataModal.name =
			title === 'Hobbies' ? ModalSource.userHobbies : ModalSource.languages;

		this.state.dynDataModal.icons =
			title === 'Hobbies' ? ModalSource.userHobbiesIcons : ModalSource.languagesIcons;
		this.setState({
			modalTitle: title,
			isOpenModal: true,
			modalSource: ds.cloneWithRows(listData)
		});
	}

	goTo(id) {
		this.setState({ loading: true });
		if (id === this.props.userID) {
			this.setState({ loading: false });
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
						Actions.friendRequest({
							friendID: id,
							langs: this.props.langs,
							userID: this.props.userID
						});
						setTimeout(() => {
							this.setState({ loading: false });
						}, 1500);
					} else if (response.data.status === 0) {
						Actions.friendRequest({
							status: 0,
							id,
							langs: this.props.langs,
							userID: this.props.userID,
							user: this.props.user
						});
						setTimeout(() => {
							this.setState({ loading: false });
						}, 1500);
					} else {
						Actions.momprofile({
							id,
							langs: this.props.langs,
							userID: this.props.userID,
							user: this.props.user
						});
						setTimeout(() => {
							this.setState({ loading: false });
						}, 1500);
					}
				})
				.catch(() => { });
		}
		this.setState({
			isSearchShown: false,
			textSearch: '',
			isSearching: false
		});
		this.refs.searchField.blur();
	}

	accept() {
		if (this.deckswiper) {
			this.deckswiper.getWrappedInstance().swipeRight();
		}
	}

	reject() {
		if (this.deckswiper) {
			this.deckswiper.getWrappedInstance().swipeLeft();
		}
	}

	endSuggestions() {
		this.setState({ endList: true });
	}

	startFriends() {
		const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		ls.get('userFriends').then(userFriends => {
			this.setState({
				userFriends,
				dataFriends: ds2.cloneWithRows(userFriends)
			});
		});
	}

	refreshList() {
		this.setState({ loading: true });
		const methodName = this.props.friend === undefined ? 'getUsersByRadius' : 'viewRequests';

		axios({
			method: 'get',
			url: config.baseUrl.concat(methodName),
			headers: config.headers,
			params: {
				id: this.props.userID,
				session_token: this.session_token
			}
		})
			.then(resp => {
				console.log(resp);
				this.fillState(resp);
			})
			.catch(() => {
				this.setState({ loading: false, endList: true });
			});
	}

	renderCard(cardSource) {
		const age =
			cardSource.childAge >= 2
				? ''.concat(cardSource.childAge, ' ', strings.age[this.props.langID])
				: ''.concat(cardSource.childMonths, ' ', strings.months[this.props.langID]);
		return (
			<View style={styles.cardContainer}>
				<View style={styles.cardPhotoContainer}>
					<Image
						style={styles.cardUserPhoto}
						source={
							cardSource.imageSource !== 'none' ? { uri: cardSource.imageSource } : images.avatar
						}
					/>
					<Text style={styles.cardUserName}>
						{cardSource.name}, {cardSource.age} {strings.age[this.props.langID]}
					</Text>
				</View>

				<View style={styles.cardUserDetailsContainer}>
					<TouchableOpacity
						style={styles.dataField}
						onPress={this.openInModal.bind(this, cardSource.languages, 'Languages')}
					>
						<Text style={styles.nameField}>{strings.languages[this.props.langID]}</Text>
						<View style={styles.cardHobbiesNumber}>
							<Text style={{ color: '#fff' }}>{cardSource.languages.length}</Text>
						</View>
					</TouchableOpacity>
					<View style={[styles.dataField, styles.middleDetail]}>
						<Text style={styles.nameField}>{strings.ageOfChild[this.props.langID]}</Text>
						<Text style={[styles.valueField, { marginTop: '15%' }]}>{age}</Text>
					</View>
					<TouchableOpacity
						style={styles.dataField}
						onPress={this.openInModal.bind(this, cardSource.hobbies, 'Hobbies')}
					>
						<Text style={styles.nameField}>{strings.hobbies[this.props.langID]}</Text>
						<View style={styles.cardHobbiesNumber}>
							<Text style={{ color: '#fff' }}>{cardSource.hobbies.length}</Text>
						</View>
					</TouchableOpacity>

				</View>
			</View>
		);
	}

	renderCardSearch(rowData) {
		return (
			<TouchableOpacity
				style={styles.cardMom}
				onPress={() => {
					this.goTo(rowData.id);
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
					<View style={styles.rencontresContainer}>
						<Text style={styles.rencontresNumber}>{rowData.friendCount} </Text>
						<Text style={styles.rencontresText}>{rowData.friendCount === 1 || rowData.friendCount === 0 ? 'contact' : 'contacts'}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	renderCardFriends(rowData) {
		const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const reviewFriends = () => {
			this.refreshList.bind(this);
		};
		const deleteFriend = () => {
			this.state.userFriends.splice(this.state.userFriends.indexOf(rowData), 1);
			this.setState({
				dataFriends: ds2.cloneWithRows(this.state.userFriends)
			});
			ls.save('userFriends', this.state.userFriends);
			this.refreshList.bind(this);
			if (this.props.friend !== undefined) {
				this.props.getFriends();
			}
		};
		return (
			<TouchableOpacity
				style={styles.cardMom}
				onPress={() =>
					Actions.momprofile({
						id: rowData.id,
						langs: this.props.langs,
						userID: this.props.userID,
						user: this.props.user,
						reviewFriends,
						deleteFriend
					})
				}
			>
				<View style={[styles.profilPicContainer, { backgroundColor: '#D8D8D8' }]}>
					<Image
						style={styles.profilPic}
						source={rowData.imageSource !== 'none' ? { uri: rowData.imageSource } : images.avatar}
					/>
				</View>
				<View style={[{ backgroundColor: '#D8D8D8', width: '100%', height: '40%' }]}>
					<Text style={[styles.momNameText, { alignSelf: 'center' }]}>{rowData.name}</Text>
				</View>
			</TouchableOpacity>
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
							logoName={
								this.state.modalTitle === 'Hobbies'
									? strings.hobbies[this.props.langID]
									: strings.languages[this.props.langID]
							}
							option=""
							iconName="close"
							modalClose={() => {
								this.setState({
									isOpenModal: false
								});
							}}
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

	renderSearchBar() {
		const placeHolder = this.state.isSearchShown ? strings.search[this.props.langID] : '';
		if (this.props.friend === undefined && this.props.toSearch !== undefined) {
			return (
				<View style={styles.searchBarContainer}>
					<TextInput
						style={styles.searchInput}
						placeholderTextColor="#830a65"
						placeholder={placeHolder}
						underlineColorAndroid="transparent"
						onChangeText={textSearch => {
							this.setState({ textSearch });
							if (textSearch === '') {
								this.refs.searchField.blur();
								this.setState({
									isSearching: false,
									isSearchShown: false
								});
							} else {
								const ds = new ListView.DataSource({
									rowHasChanged: (r1, r2) => r1 !== r2
								});
								this.cancelToken.cancel();
								this.cancelToken = CancelToken.source();
								axios({
									method: 'get',
									url: config.baseUrl.concat('search'),
									headers: config.headers,
									params: {
										name: textSearch,
										id: this.props.userID,
										session_token: this.session_token
									},
									cancelToken: this.cancelToken.token
								})
									.then(response => {
										const datas = [];
										for (let i = 0; i < response.data.users.length; i++) {
											const user = {
												name: response.data.users[i].name.concat(
													' ',
													response.data.users[i].surname
												),
												imageSource: response.data.users[i].picture,
												id: response.data.users[i].id,
												friendCount: response.data.users[i].friendCount,
												chatCount: 0
											};
											datas.push(user);
										}
										this.setState({
											isSearching: true,
											dataSource: ds.cloneWithRows(datas),
											searchedUsers: datas
										});
									})
									.catch(err => console.log(err));
							}
						}}
						value={this.state.textSearch}
						ref="searchField"
						onSubmitEditing={() => {
							//this.refs.password.focus();
						}}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					{!this.state.isSearchShown ? (
						<TouchableOpacity
							style={styles.searchIconContainer}
							onPress={() => {
								this.setState({
									isSearchShown: true
								});
								this.refs.searchField.focus();
							}}
						>
							<Icon name="search" size={17} color="#bc0e91" />
						</TouchableOpacity>
					) : (
							<View />
						)}
				</View>
			);
		}
		return <View />;
	}

	renderSearchUsers() {
		return (
			<View style={styles.searchListContainer}>
				{this.state.searchedUsers.length !== 0 ? (
					<ListView
						dataSource={this.state.dataSource}
						contentContainerStyle={styles.listSearchContainer}
						renderRow={rowData => this.renderCardSearch(rowData)}
					/>
				) : (
						<Text style={{ fontSize: 18 }}>{strings.noResults[this.props.langID]}</Text>
					)}
			</View>
		);
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={styles.container}>
					{this.props.renderHeader()}
					<ActivityIndicator style={{ marginTop: '50%' }} size="small" color="#bc0e91" />
					<FlatList
						dataSource={this.state.dataSource}
						renderItem={({ item }) => <Text>{item.key}</Text>}
					/>
					<ListView
						dataSource={this.state.dataFriends}
						contentContainerStyle={styles.listSearchContainer}
						renderRow={rowData => this.renderCardFriends(rowData)}
					/>
				</View>
			);
		}

		if (this.state.endList && this.props.suggestedFriend === undefined) {
			if (this.state.userFriends.length !== 0 && !this.state.isSearching) {
				return (
					<View style={styles.container}>
						{this.props.renderHeader()}
						{this.renderSearchBar()}
						<View style={styles.searchListContainer}>
							<ListView
								dataSource={this.state.dataFriends}
								contentContainerStyle={styles.listSearchContainer}
								renderRow={rowData => this.renderCardFriends(rowData)}
							/>
						</View>
					</View>
				);
			}
			return (
				<View style={styles.container}>
					{this.props.renderHeader()}
					{this.renderSearchBar()}
					{!this.state.isSearching ? (
						<View style={{ height: '80%', width: '100%' }}>
							<View style={styles.listContainer}>
								<View style={styles.inviteCard}>
									<Image source={images.noInternet} />
									<Text style={{ fontSize: 20, marginTop: '10%' }}>
										{this.state.noMoreMessage1}
									</Text>
									<Text
										style={{
											fontSize: 14,
											marginTop: '2%',
											color: '#A4A4A4'
										}}
									>
										{this.state.noMoreMessage2}
									</Text>
								</View>
							</View>
							<View style={styles.acceptContainer}>
								<TouchableOpacity
									onPress={this.refreshList.bind(this)}
									style={styles.buttonContainer}
								>
									<Icon name="refresh" size={28} color="#bc0e91" />
								</TouchableOpacity>
							</View>
						</View>
					) : (
							this.renderSearchUsers()
						)}
					{this.renderModal()}
				</View>
			);
		}
		return (
			<View style={styles.container}>
				{this.props.renderHeader()}
				{this.renderSearchBar()}
				{!this.state.isSearching ? (
					<View style={{ height: Platform.OS === 'ios' ? '75%' : '80%', width: '100%' }}>
						<View style={styles.listContainer}>
							<View style={styles.inviteCard}>
								<DeckSwiper
									dataSource={this.state.Cards}
									renderItem={cardSource => {
										if (Platform.OS === 'android') {
											return (
												<BoxShadow setting={this.state.shadowOpt}>
													{this.renderCard(cardSource)}
												</BoxShadow>
											);
										}
										return this.renderCard(cardSource);
									}}
									ref={deckswiper => {
										this.deckswiper = deckswiper;
									}}
									Ids={this.state.Ids}
									userID={this.props.userID}
									friend={this.props.friend}
									fullName={this.props.fullName}
									getRequests={this.props.getRequests}
									getFriends={this.props.getFriends}
									message={this.props.suggestedFriend === undefined ? "Pas d'autre suggestion" : ''}
									finish={this.endSuggestions.bind(this)}
									startFriends={this.startFriends.bind(this)}
									suggestedFriend={this.props.suggestedFriend}
									hideAcceptContainer={() => {
										this.setState({ loadChatKeys: true });
									}}
									showAcceptContainer={() => {
										this.setState({ loadChatKeys: false });
									}}
									refreshList={this.refreshList.bind(this)}
								/>
							</View>
						</View>
						{!this.state.loadChatKeys ? (
							<View style={styles.acceptContainer}>
								<View style={{ alignItems: 'center' }}>
									<TouchableOpacity onPress={this.reject.bind(this)} style={styles.buttonContainer}>
										<Icon name="close" size={28} color="#D70016" />
									</TouchableOpacity>
									<Text style={{ color: '#D70016' }}>
										{this.props.friend !== undefined
											? strings.refuse[this.props.langID]
											: strings.ignore[this.props.langID]}
									</Text>
								</View>

								<View style={styles.middleButton} />

								<View style={{ alignItems: 'center' }}>
									<TouchableOpacity
										style={styles.buttonContainer}
										onPress={() => {
											Alert.alert(
												"Confirmation",
												"Valider la demande ?",
												[
													{ text: 'Ok', onPress: () => { this.accept() } },
													{ text: 'Annuler', onPress: () => { } },

												],
												{ cancelable: false }
											);
										}}
									>
										<Icon name="check" size={28} color="#00B54D" />
									</TouchableOpacity>
									<Text style={{ color: '#00B54D' }}>
										{this.props.friend !== undefined
											? strings.accept[this.props.langID]
											: strings.add[this.props.langID]}
									</Text>
								</View>
							</View>
						) : (
								<View style={styles.acceptContainer} />
							)}
					</View>
				) : (
						this.renderSearchUsers()
					)}
				{this.renderModal()}
			</View>
		);
	}
}

const mapStateToProps = ({ main }) => {
	const { langID } = main;
	return { langID };
};

export default connect(mapStateToProps, actions)(Search);
