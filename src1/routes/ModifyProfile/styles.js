import { StyleSheet, Dimensions } from 'react-native';
import fonts from './../../config/fonts';

const childWidth = Dimensions.get('window').width * 0.9;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FDFDFD'
  },
  //profile View
  profileTabView: {
    paddingLeft: '3%',
    paddingRight: '3%',
    width: '100%',
    height: '90%'
  },
  logoButton: {
    width: height * 0.12,
    height: height * 0.12,
    borderRadius: height * 0.06,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '3%',
    marginBottom: '5%'
  },
  credentialRow: {
    width: '100%',
    height: '12%',
    marginBottom: '2%',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  nameField: {
    color: '#B2B2B2',
    fontSize: 15,
    fontFamily: fonts.regularSF
  },
  valueField: {
    color: '#212121',
    fontSize: 18,
    fontWeight: '300',
    fontFamily: fonts.displaySF
  },

  childrenContainer: {
    width: '100%',
    height: '20%',
    marginTop: 0,
    marginBottom: '1%',
    justifyContent: 'center'
  },
  firstKidBox: {
    width: childWidth,
    height: '90%',
    marginRight: 5,
    backgroundColor: '#fff',
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
    height: '60%'
  },
  removeChildContainer: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center'
  },

  dateConainer: {
    width: '90%',
    height: 50,
    marginTop: '3%'
  },
  dateIcon: {
    position: 'absolute',
    left: '85%',
    top: 4,
    marginLeft: 0
  },
  dateInput: {
    borderColor: 'transparent',
    height: '100%',
    width: '100%',
    alignItems: 'center'
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

  textInputStyle: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    fontFamily: fonts.regularSF
  },

  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  modalTitle: {
    fontWeight: '300',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    color: '#bc0e91',
    fontFamily: fonts.regularSF
  },
  cardContainer: {
    marginLeft: '15%',
    marginBottom: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5%'
  },
  cardTextStyle: {
    fontSize: 16,
    color: '#808080',
    marginLeft: '1%',
    fontFamily: fonts.regularSF
  },
  cardHobbiesNumber: {
    width: height * 0.04,
    height: height * 0.04,
    borderRadius: 14,
    backgroundColor: '#bc0e91',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%'
  },

  checkbox: {
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
    marginRight: '3%'
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

  addChildConainer: {
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  addChildText: {
    marginLeft: '3%',
    fontSize: 15,
    fontWeight: '100',
    fontFamily: fonts.regularSF
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
  },

  sideArrow: {
    position: 'absolute'
  }
});
