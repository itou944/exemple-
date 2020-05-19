import { StyleSheet } from 'react-native';
import fonts from './../../config/fonts';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	noFriendsContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	cardContainer: {
		width: '100%',
		height: 225,
		marginVertical: 20,
	},
	cardImage: {
		// width: 'auto',
		height: '100%',
		maxHeight: 225,
		resizeMode: 'contain',
	},
	modalImage: {
		maxWidth: '100%',
		height: 225,
		// maxHeight: 225,
		// flexDirection: 'column',
		// justifyContent: 'center',
		// alignItems: 'center',
		// resizeMode: 'contain',
	},
	modalContent: {
		marginTop: 20,
		fontSize: 16,
		fontWeight: '500',
		fontFamily: fonts.displaySF,
		marginHorizontal: 15,
		textDecorationLine: "underline"
	},
	spaceCards: {
		alignItems: 'center',
		padding: 10
	}
});
