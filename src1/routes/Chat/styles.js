import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9'
    },
    loadMoreContainer: {
        width: 140,
        height: 30,
        backgroundColor: '#A4A4A4',
        alignSelf: 'center',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3%',
        marginBottom: '3%'
    },
    modalContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        position: 'absolute'
    },
    profilPicContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
