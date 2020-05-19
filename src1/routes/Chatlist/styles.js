import { StyleSheet } from 'react-native';
import fonts from './../../config/fonts';

export default StyleSheet.create({
  container: {
      flex: 1
  },
  listContainer: {
      marginTop: '1%',
      paddingHorizontal: '2%'
  },
  cardMom: {
      backgroundColor: 'transparent',
      width: '100%',
      height: 80,
      marginBottom: '1%',
      flexDirection: 'row',

      //ios shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 3,

      //android shadow
      elevation: 1
  },
  profilPicContainer: {
      height: '100%',
      width: '30%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
  },
  profilPic: {
      width: 50,
      height: 70,
      borderRadius: 25
  },
  textInformation: {
      height: '100%',
      width: '40%',
      backgroundColor: '#fff',
      justifyContent: 'space-between',
      paddingVertical: '5%'
  },
  momNameText: {
      fontSize: 16,
      fontFamily: fonts.displaySF
  },
  momMessageText: {
      fontSize: 14,
      fontFamily: fonts.regularSF,
      color: '#B2B2B2'
  },
  newMessagesContainer: {
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center'
  },


  noFriendsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
  loadingContainer: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: 'transparent'
  },
});
