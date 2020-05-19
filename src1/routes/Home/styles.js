import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tabView: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  //profile View
  profileTabView: {
      paddingLeft: '3%',
      paddingRight: '3%'
  },
  logoButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '4%',
    marginBottom: '7%'
  },
  credentialRow: {
      width: '100%',
      height: '9%',
      marginBottom: '5%',
      borderBottomWidth: 1,
      borderBottomColor: '#dddddd',
      backgroundColor: 'transparent'
  },
  nameField: {
      color: '#B2B2B2',
      fontSize: 15
  },
  valueField: {
      color: '#212121',
      fontSize: 20,
      fontWeight: '300'
  },
  firstKidBox: {
      width: '100%',
      height: '17%',
      backgroundColor: '#FDFDFD',
      marginBottom: '5%',
      marginTop: '3%',
      borderWidth: 0.5,
      borderColor: '#dddddd',
  },
  premierEfantContainer: {
      height: '25%',
      alignItems: 'center'
  },
  premierEfantText: {
      color: '#CA008C',
      fontWeight: '500',
      fontSize: 15,
      marginTop: '2%'
  },
  enfantDetails: {
      height: '75%',
      width: '100%',
      flexDirection: 'row',
      paddingLeft: '3%',
      paddingRight: '3%',
      paddingTop: '2%'
  },
  kidField: {
      width: '30%',
      height: '70%',
      alignItems: 'center'
  },
  middleDetail: {
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderColor: '#dddddd',
      width: '40%'
  },
  track: {
    height: 4,
    borderRadius: 2,
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
    flexDirection: 'row'
  },
  km1: {
    flex: 2,
    fontSize: 8,
    alignSelf: 'flex-start',
    color: '#CA008C',
    fontWeight: 'bold',
    marginLeft: '2%'
  },
  km2: {
    alignSelf: 'flex-end',
    fontSize: 8,
    color: '#CA008C',
    fontWeight: 'bold',
    marginRight: '2%'
  },
  field_title: {
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#F7CBE2',
    height: '5%',
    fontSize: 23,
    marginTop: '1%'
  },
  field: {
    marginBottom: 2,
    flexDirection: 'row'
  },
  text_field: {
    flex: 2,
    fontSize: 20,
    alignSelf: 'flex-start',
    marginTop: '1%',
    marginLeft: '4%'
  },
  dataText: {
    alignSelf: 'flex-end',
    fontSize: 20,
    marginRight: '13%',
  },
  dateStyle: {
    width: '40%',
    height: '10%',
    alignSelf: 'flex-end',
    marginRight: '4%',
    marginTop: '1%'
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#01A9DB'
  },
  rechercheText: {
    color: '#F7CBE2',
    fontSize: 18,
    marginLeft: '4%',
    marginTop: '2%'
  },
  sliderValue: {
    alignSelf: 'flex-end'
  },

  buttonBlock: {
    marginBottom: 0
  }

  //search View
});
