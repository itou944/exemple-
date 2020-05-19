import { StyleSheet, Dimensions } from 'react-native';
import fonts from './../../config/fonts';

const childWidth = Dimensions.get('window').width * 0.9;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fdfdfd'
  },
  //profile View
  profileTabView: {
    paddingHorizontal: 10,
    width: '100%',
    height: '85%'
  },
  logoButton: {
    width: height * 0.12,
    height: height * 0.12,
    borderRadius: height * 0.06,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '2%',
    backgroundColor: '#fdfdfd'
  },
  credentialRow: {
    width: '100%',
    height: '8%',
    marginBottom: '2%',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  nameField: {
    color: '#B2B2B2',
    fontSize: 13,
    fontFamily: fonts.regularSF
  },
  valueField: {
    color: '#212121',
    fontSize: 16,
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
    height: '80%',
    marginRight: 5,
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
    marginTop: 0,
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

  sliderContainer: {
    height: '17%',
    width: '100%',
    justifyContent: 'center'
  },
  track: {
    height: 4,
    borderRadius: 2
  },
  thumb: {
    width: 17,
    height: 17,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderColor: '#CA008C',
    borderWidth: 2,
    top: 22
  },

  sliderLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  kmText: {
    fontSize: 8,
    color: '#CA008C',
    fontWeight: 'bold'
  },
  sliderText: {
    fontSize: 10,
    color: '#CA008C',
    fontWeight: 'bold'
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
  cardHobbiesNumber: {
    width: height * 0.04,
    height: height * 0.04,
    borderRadius: 14,
    backgroundColor: '#bc0e91',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%'
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

  sideArrow: {
    position: 'absolute'
  }
});
