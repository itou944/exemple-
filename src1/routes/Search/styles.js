import { StyleSheet, Dimensions, Platform } from 'react-native';
import fonts from './../../config/fonts';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    searchBarContainer: {
        width: '90%',
        height: 25,
        marginTop: '2%',
        borderWidth: 1,
        borderColor: '#bc0e91',
        borderRadius: 25,
        justifyContent: 'center',
        marginBottom: '2%'
    },
    searchInput: {
        width: '80%',
        height: Platform.OS === 'ios' ? 25 : 40,
        marginLeft: '10%',
        fontSize: 16,
    },
    searchIconContainer: {
        position: 'absolute',
        zIndex: 100,
        backgroundColor: 'transparent',
        paddingLeft: '10%',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    listContainer: {
        width: '100%',
        height: '80%',
        backgroundColor: '#F9F9F9',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: '2%'
    },
    inviteCard: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%'
    },
    cardContainer: {
        width: Platform.OS === 'ios' ? '100%' : '99%',
        height: Platform.OS === 'ios' ? height * 0.6 : '98%',
        backgroundColor: '#FDFDFD',

        //ios shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,

        //android shadow
        elevation: 20
    },
    cardPhotoContainer: {
        width: '100%',
        height: '60%',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    cardUserPhoto: {
        width: height * 0.25,
        height: height * 0.25,
        borderRadius: height * 0.125,
        marginTop: '5%'
    },
    cardUserName: {
        fontSize: 15,
        marginTop: '2%',
        color: '#CA008C',
        fontWeight: '600',
        fontFamily: fonts.regularSF
    },
    cardUserDetailsContainer: {
        width: '100%',
        height: '35%',
        flexDirection: 'row',
    },
    cardUserDetails: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
    },
    dataField: {
        width: '30%',
        height: '75%',
        alignItems: 'center',
    },
    middleDetail: {
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#dddddd',
        width: '40%'
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
        marginTop: '8%',
        fontFamily: fonts.displaySF
    },
    historyViewText: {
        fontSize: 12,
        color: '#AAAAAA',
        marginRight: '3%'
    },
    historyViewIcon: {
        marginTop: '2%'
    },
    acceptContainer: {
        width: '100%',
        height: '22%',
        marginTop: '2%',
        paddingTop: '5%',
        backgroundColor: '#F9F9F9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        width: height * 0.1,
        height: height * 0.1,
        backgroundColor: '#FDFDFD',
        borderRadius: height * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '5%',

        //ios shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,

        //android shadow
        elevation: 1
    },
    middleButton: {
        width: '15%'
    },
    modalContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        zIndex: 200
    },
    modalTitle: {
        fontWeight: '300',
        fontSize: 22,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
        color: '#bc0e91'
    },
    cardModalContainer: {
        marginLeft: '15%',
        marginBottom: '3%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTextStyle: {
        fontSize: 16,
        color: '#808080',
        marginLeft: '1%'
    },

    //Search results
    searchListContainer: {
        width: '100%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listSearchContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: '5%',
        width: '100%',
    },
    cardMom: {
        backgroundColor: 'transparent',
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
        height: '50%',
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: '1%'
    },
    profilPic: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    textInformation: {
        height: '50%',
        backgroundColor: '#FDFDFD',
        alignItems: 'center',
        justifyContent: 'center'
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
        fontWeight: 'bold'
    },
    rencontresText: {
        color: '#CC008D',
        fontSize: 12,
        fontFamily: fonts.regularSF
    },
    noFriendsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    //hobbie Form
    cardHobbiesNumber: {
        width: height * 0.04,
        height: height * 0.04,
        borderRadius: 14,
        backgroundColor: '#bc0e91',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30%'
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
