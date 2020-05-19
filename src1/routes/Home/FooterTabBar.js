import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FooterTabBar = React.createClass({
	propTypes: {
		goToPage: React.PropTypes.func,
		activeTab: React.PropTypes.number,
		tabs: React.PropTypes.array
	},

	componentDidMount() {},

	tabIcons: [],

	render() {
		return (
			<View style={[styles.tabs, this.props.style]}>
				{this.props.tabs.map((tab, i) => {
					const textColor = this.props.activeTab === i ? '#FFFFFF' : '#C389AD';
					 let tabName = '';
					// switch (i) {
					// 	case 0:
					// 		tabName = 'Profil';
					// 		break;
					// 	case 1:
					// 		tabName = 'Recherche';
					// 		break;
					// 	case 2:
					// 		tabName = 'Messages';
					// 		break;
					// 	case 3:
					// 		tabName = 'Forum';
					// 		break;
					// 	case 4:
					// 		tabName = 'Articles';
					// 		break;
					// 	case 5:
					// 		tabName = 'Promo';
					// 		break;
					// 	default:
					// }
					return (
						<TouchableOpacity
							key={tab}
							onPress={() => {
								this.props.goToPage(i);
								if (i === 2) {
									//this.props.hideUnread();
								} else {
									setTimeout(() => {
										this.props.startLoading();
									}, 1);
									setTimeout(() => {
										this.props.finishLoading();
									}, 100);
								}
							}}
							style={styles.tab}
						>
							<View style={[styles.tab, { marginTop: 5 }]}>
								<Icon
									name={tab}
									size={21}
									color={this.props.activeTab === i ? '#FFFFFF' : '#C389AD'}
									ref={icon => {
										this.tabIcons[i] = icon;
									}}
								/>
								<Text
									style={{
										color: textColor,
										fontSize: 10
									}}
								>
									{tabName}
								</Text>
							</View>
							{(i === 1 && this.props.requestsNumber > 0) ||
							(i === 2 && this.props.unreadMessages > 0) ? (
								<View style={styles.unseenContainer}>
									<View style={styles.unseenPoint}>
										<Text style={{ fontSize: 10, color: '#bc0e91' }}>
											{i === 1 ? this.props.requestsNumber : this.props.unreadMessages}
										</Text>
									</View>
								</View>
							) : (
								<View />
								)}
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}
});
//envelope-o
const styles = StyleSheet.create({
	tab: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		//paddingBottom: 5,
	},
	tabs: {
		backgroundColor: '#822A6C',
		height: "6%",
		flexDirection: 'row',
		paddingTop: 6,
		// borderWidth: 0,
		// borderTopWidth: 0,
		// borderLeftWidth: 0,
		// borderRightWidth: 0,
		borderBottomColor: 'rgba(0,0,0,0.05)'
	},
	unseenContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		alignItems: 'center',
		paddingLeft: '20%'
	},
	unseenPoint: {
		height: 12,
		width: 12,
		backgroundColor: '#fff',
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default FooterTabBar;
