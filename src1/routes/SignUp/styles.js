import { StyleSheet, Dimensions } from 'react-native';
import fonts from './../../config/fonts';

const photoHeight = Dimensions.get('window').height * 0.17;
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,

  },
  logoContainer: {
      height: '20%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  logo: {
      marginTop: '5%',
      marginBottom: '5%'
  },
  moto: {
      fontSize: 16,
      color: '#bc0e91',
      fontWeight: '100',
      fontFamily: fonts.regularSF
  },
  form: {
      height: '82%',
      justifyContent: 'center',
      alignItems: 'center'
  },
  icon: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },
  tabView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  tabTitle: {
    fontSize: 16,
    color: '#313131',
    fontFamily: fonts.regularSF
  },
  //form 1
  userPhotoContainer: {
      width: photoHeight,
      height: photoHeight,
      marginTop: '3%',

  },
  userImage: {
      width: '100%',
      height: '100%',
      borderRadius: photoHeight / 2
  },
  tabViewForm: {
      width: '100%',
      height: '100%',
      alignItems: 'center'
  },
  civiliteText: {
      fontSize: 16,
      color: '#313131',
      marginTop: '3%',
      marginBottom: '3%',
      fontFamily: fonts.regularSF
  },
  inputStyle: {
      height: '21%',
      borderColor: '#bc0e91',
      color: '#848484',
      fontSize: 14,
      paddingLeft: 20,
      borderWidth: 1,
      borderRadius: height / 25,
      width: width * 0.9,
      marginBottom: '2%',
      fontFamily: fonts.regularSF
  },
  loginButton: {
      flexDirection: 'row',
      height: '100%',
      backgroundColor: '#bc0e91',
      borderWidth: 0,
      borderRadius: 35,
      width: width*0.9,
      marginBottom: '5%',
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

  //tab2
  formContainer: {
      height: '70%',
      width: '100%',
      alignItems: 'center'
  },
  dateConainer: {
      width: '90%',
      height: '14%',
      marginTop: '7%',
      marginBottom: '2%'
  },
  dateIcon: {
      position: 'absolute',
      left: '85%',
      top: 4,
      marginLeft: 0,
      width: '5%',
      height: '20%',
      top: '45%'
  },
  dateInput: {
      borderColor: '#bc0e91',
      height: '80%',
      width: '100%',
      borderRadius: 25,
      alignItems: 'flex-start'
  },
  datePlaceholderText: {
      color: '#bc0e91',
      marginLeft: '5%',
      fontFamily: fonts.regularSF
  },
  dateText: {
      color: '#848484',
      marginLeft: '5%',
      fontFamily: fonts.regularSF
  },

  inputLanguagesStyle: {
      height: '12%',
      borderColor: '#bc0e91',
      paddingLeft: 20,
      borderWidth: 1,
      borderRadius: 25,
      width: '90%',
      marginBottom: '3%',
      marginTop: '3%',
      justifyContent: 'center',
  },
  textLanguagesStyle: {
      color: '#bc0e91',
      fontSize: 14,
      fontFamily: fonts.regularSF
  },
  placeholderContainer: {
      width: '90%',
      height: '90%',
      justifyContent: 'center'
  },

  hobbiesInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#bc0e91',
      width: '90%',
      borderRadius: 25,
      paddingLeft: 20,
      paddingRight: 15
  },

  buttonContainer: {
      height: '25%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: '1%'
  },
  nextStep: {
      height: '50%',
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center'
  },


  modalContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
      backgroundColor: '#fff'
    },
  modalTitle: {
      fontWeight: '300',
      fontSize: 22,
      marginTop: 10,
      marginBottom: 10,
      alignSelf: 'center',
      color: '#bc0e91'
  },
  checkbox: {
      marginLeft: '15%',
      height: 20,
      width: 20,
      marginBottom: '1%'
  },
  modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: '5%'
  },
  cancel: {
      backgroundColor: '#f8f8f8',
      marginRight: '3%',
  },
  button: {
      backgroundColor: '#bc0e91',
      width: '34%',
      height: 50,
      marginTop: 15,
      marginBottom: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10
  },
  errorTab1Container: {
      height: '35%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },

  //tab3
  placeHolderContainer: {
      width: '90%',
      height: '100%',
      justifyContent: 'center'
  },
  addChildConainer: {
      height: '10%',
      width: '100%',
      marginTop: '5%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
  },
  addChildText: {
      marginLeft: '3%',
      fontSize: 15,
      fontWeight: '100',
      fontFamily: fonts.regularSF
  },

  backButton: {
      position: 'absolute',
      width: '25%',
      height: '10%',
      marginTop: '5%',
      alignItems: 'center',
      paddingLeft: '10%',
      flexDirection: 'row'
  },
  backText: {
      color: '#bc0e91',
      fontSize: 14,
      marginLeft: '2%'
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
