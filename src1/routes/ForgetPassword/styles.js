import { StyleSheet, Dimensions } from 'react-native';
import fonts from './../../config/fonts';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    logoContainer: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        marginTop: '1%',
        marginBottom: '7%'
    },
    moto: {
        fontSize: 16,
        color: '#bc0e91',
        marginBottom: '1%',
        fontWeight: '100'
    },
    form: {
        height: '50%',
    },
    inputStyle: {
        height: '16%',
        borderColor: '#bc0e91',
        color: '#848484',
        fontSize: 14,
        paddingLeft: 20,
        borderWidth: 1,
        borderRadius: height / 25,
        width: width * 0.9,
        marginBottom: '3%',
        fontFamily: fonts.regularSF
    },
    loginButton: {
        flexDirection: 'row',
        height: '16%',
        backgroundColor: '#bc0e91',
        borderWidth: 0,
        borderRadius: 35,
        width: width * 0.9,
        marginBottom: '3%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginButtonText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 14,
        fontFamily: fonts.regularSF
    },
    loginArrow: {
        marginTop: 0,
        marginLeft: 10,
        fontWeight: '800',
    },
    forgotPassword: {
        alignItems: 'center'
    },
    forgotPasswordText: {
        color: '#b9b9b9',
        fontSize: 13,
        fontFamily: fonts.regularSF
    },
    bottomButtons: {
        flexDirection: 'row',
        marginTop: '5%',
        width: '90%',
        height: '20%'
    },
    bottomText: {
        color: '#787878',
        fontSize: 14,
        fontFamily: fonts.regularSF
    },
    bottomLogo: {
        fontWeight: '100'
    },
    column1: {
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    createPlusContainer: {
        width: '15%',
    },
    createTextContainer: {
        flexDirection: 'column',
        marginTop: 0,
        marginLeft: '5%'
    },
    column2: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    facebookContainer: {
        width: '18%',
    },
    facebookTextContainer: {
        flexDirection: 'column',
        marginLeft: '10%'
    },

    backButton: {
        position: 'absolute',
        width: '25%',
        height: '10%',
        marginTop: '5%',
        alignItems: 'center',
        paddingLeft: '10%',
        flexDirection: 'row',
        top: 0,
        left: 0
    },
    backText: {
        color: '#bc0e91',
        fontSize: 14,
        marginLeft: '2%'
    },

});
