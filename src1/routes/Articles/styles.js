import { StyleSheet } from 'react-native';
//import fonts from './../../config/fonts';

export default StyleSheet.create({
	container: {
		flex: 1
	},
	noFriendsContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},

	cardContainer: {
		width: '100%',
		height: 200,
		marginVertical: 10
	},
	cardImage: {
		width: '100%',
		height: '100%'
	},
	titleContainer: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center'
	},
	cardTitle: {
		fontSize: 14,
		backgroundColor: '#bc0e91',
		padding: 5,
		color: '#fff',
		fontWeight: '800'
	},

	modalImage: {
		width: '100%',
		height: 200
	},
	modalTitle: {
		fontSize: 30,
		fontWeight: '200'
	},
	modalContent: {
		marginTop: 20
	}
});
