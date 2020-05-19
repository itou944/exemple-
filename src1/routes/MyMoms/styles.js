import { StyleSheet, Platform } from 'react-native';
import fonts from './../../config/fonts';

export default StyleSheet.create({
	container: {
		flex: 1,
        alignItems: 'center',
	},
	resultListContainer: {
		width: '100%',
        height: '100%',
        alignItems: 'center',
		justifyContent: 'center',
		marginTop: '-5%'
	},
	listContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: '5%',
		width: '100%',
		height: '100%'
	},
	listStyle: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		width: '100%',
	},
	cardMom: {
		backgroundColor: '#fff',
		width: '44%',
		height: 140,
		marginLeft: '3%',
        marginRight: '3%',
		marginBottom: '6%',		

		//ios shadow
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.1,
		shadowRadius: 3,

		//android shadow
		elevation: 1
	},
	profilPicContainer: {
		height: '55%',
		width: '100%',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingTop: '3%'
	},
	profilPic: {
		width: 70,
		height: 70,
		borderRadius: 35
	},
	textInformation: {
		height: '50%',
		//width: '100%',
		backgroundColor: '#FDFDFD',
		alignItems: 'center',
		justifyContent: 'center',
	},
	momNameText: {
		marginBottom: '3%',
		fontSize: 18,
		fontFamily: fonts.regularSF
	},
	rencontresContainer: {
		flexDirection: 'row',
		alignItems: 'flex-end'
	},
	rencontresNumber: {
		color: '#CC008D',
		fontSize: 15,
		fontWeight: 'bold',
		fontFamily: fonts.regularSF
	},
	rencontresText: {
		color: '#CC008D',
		fontSize: 12,
		fontFamily: fonts.regularSF
	},
	noFriendsContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginBottom: '80%',
		marginTop: '60%'
	}
});
