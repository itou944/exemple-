import { StyleSheet, Platform } from 'react-native';
import fonts from './../../config/fonts';

const margin = Platform.OS === 'ios' ? '5%' : 0;

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '7%',
    width: '100%',
    backgroundColor: '#FDFDFD',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ADADAD',
    marginTop: margin,
  },
  iconContainer: {
      paddingTop: '23%',
      paddingBottom: '20%',
      paddingLeft: '15%'
  },
  optionNameContainer: {
      width: '25%',
      height: '100%',
      justifyContent: 'center'
  },
  logoContainer: {
      width: '50%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
  },
  optionIconContainer: {
      width: '25%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
  },
  settingStyle: {
      fontSize: 10,
      color: '#bc0e91',
      fontFamily: fonts.regularSF
  },
  logo: {
      width: 90,
      height: 20
  },
  titleBar: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: fonts.regularSF,
      marginRight: 20
  },
  requestsIconContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      alignItems: 'center'
  },
  requestsText: {
      color: 'white',
      marginLeft: 2,
      marginTop: 2,
      fontFamily: fonts.regularSF
  }

});
