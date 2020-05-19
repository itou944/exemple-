import { StyleSheet, Platform, Dimensions } from 'react-native';
import fonts from './../../config/fonts';

const containerHeight = Platform.OS === 'ios' ? '82%' : '85%';
const childWidth = Dimensions.get('window').width * 0.9;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#FDFDFD'
	},

	profileContainer: {
		height: containerHeight,
		width: '100%',
		backgroundColor: '#F9F9F9'
	},
	userInformationContainer: {
		height: '25%',
		width: '100%',
		backgroundColor: '#F9F9F9',
		flexDirection: 'row'
	},
	profilePictureContainer: {
		width: '30%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	profilePictureStyle: {
		width: 80,
		height: 80,
		borderRadius: 40
	},
	informationContainer: {
		width: '60%',
		height: '100%',
		alignItems: 'center',
		flexDirection: 'row'
	},
	textInfoContainer: {
		height: '100%',
		width: '80%',
		justifyContent: 'center'
	},
	nameTextStyle: {
		fontSize: 20,
		fontWeight: '300',
		marginBottom: '3%',
		fontFamily: fonts.displaySF
	},
	languagesStyle: {
		fontSize: 16,
		fontWeight: '300',
		fontFamily: fonts.regularSF
	},

	listCardsContiner: {
		height: '30%',
		width: '100%',
		backgroundColor: '#F9F9F9'
	},
	cardMomContainer: {
		width: '100%',
		height: 75,
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		borderBottomColor: '#dddddd'
	},
	cardPictureContainer: {
		width: '25%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	cardPictureStyle: {
		width: 60,
		height: 60,
		borderRadius: 30
	},
	cardInformationContainer: {
		width: '50%',
		height: '100%',
		justifyContent: 'center'
	},
	cardNameStyle: {
		fontSize: 18,
		marginBottom: '2%',
		fontFamily: fonts.regularSF
	},
	cardCommentStyle: {
		color: '#BCBCBC',
		fontFamily: fonts.regularSF
	},
	cardMomsNumberContainer: {
		width: '25%',
		height: '100%',
		justifyContent: 'center'
	},
	cardMomsNumber: {
		marginBottom: '2%',
		color: '#CA008C',
		fontFamily: fonts.regularSF
	},

	firstKidBox: {
		width: childWidth,
		height: '100%',
		marginRight: 5,
		marginLeft: 5,
		backgroundColor: '#fff',
		marginBottom: '5%',
		marginTop: '1%',
		borderWidth: 0.5,
		borderColor: '#f3f3f3'
	},
	premierEfantContainer: {
		height: '25%',
		alignItems: 'center',
		backgroundColor: '#FDFDFD'
	},
	premierEfantText: {
		color: '#CA008C',
		fontWeight: '500',
		fontSize: 15,
		marginTop: '1%',
		fontFamily: fonts.regularSF
	},
	enfantDetails: {
		backgroundColor: '#FDFDFD',
		flexDirection: 'row',
		paddingLeft: '3%',
		paddingRight: '3%',
		paddingTop: '1%'
	},
	kidField: {
		width: '30%',
		height: '100%',
		alignItems: 'center',
		backgroundColor: '#FDFDFD'
	},
	middleDetail: {
		borderRightWidth: 1,
		borderLeftWidth: 1,
		borderColor: '#dddddd',
		width: '40%',
		height: '60%',
		backgroundColor: '#FDFDFD'
	},
	nameField: {
		color: '#B2B2B2',
		fontSize: 15,
		fontFamily: fonts.regularSF
	},
	valueField: {
		color: '#212121',
		fontSize: 16,
		fontWeight: '300',
		fontFamily: fonts.displaySF
	},

	ouiMomContainer: {
		height: '20%',
		width: '100%',
		backgroundColor: '#F9F9F9',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonContainer: {
		flexDirection: 'row',
		height: '50%',
		backgroundColor: '#bc0e91',
		borderWidth: 0,
		borderRadius: 35,
		width: '90%',
		marginTop: '7%',
		marginBottom: '5%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText: {
		color: 'white',
		fontWeight: '900',
		fontSize: 14,
		fontFamily: fonts.regularSF
	},
	buttonArrow: {
		marginTop: 0,
		marginLeft: 10,
		fontWeight: '800'
	},

	navigationBar: {
		height: '10%',
		width: '100%',
		backgroundColor: '#842363',
		borderTopWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	iconContainer: {
		width: '25%',
		height: '5%',
		marginLeft: '10%'
	},
	sendMessageContainer: {
		flexDirection: 'row',
		marginBottom: '3%',
		marginLeft: '15%'
	},

	modalContainer: {
		width: '100%',
		height: '100%',
		backgroundColor: '#fff',
		position: 'absolute'
	},
	modalTitle: {
		fontWeight: '300',
		fontSize: 22,
		marginTop: 10,
		marginBottom: 10,
		alignSelf: 'center',
		color: '#bc0e91'
	},
	ratingContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingLeft: '10%',
		paddingRight: '10%'
	},

	cardContainer: {
		marginLeft: '15%',
		marginBottom: '3%',
		flexDirection: 'row',
		alignItems: 'center'
	},
	cardTextStyle: {
		fontSize: 16,
		color: '#808080',
		marginLeft: '1%'
	},

	unseenContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingLeft: 0
	},
	unseenPoint: {
		height: 5,
		width: 5,
		backgroundColor: '#fff',
		borderRadius: 20
	},

	//hobbie Form
	cardHobbiesNumber: {
		width: height * 0.04,
		height: height * 0.04,
		borderRadius: 14,
		backgroundColor: '#bc0e91',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '10%'
	},
	//hobbie Form
	cardHobbieContainer: {
		width: '100%',
		height: 50,
		flexDirection: 'row',
		marginBottom: '1%',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: '5%',
		paddingRight: '5%'
	}
});
