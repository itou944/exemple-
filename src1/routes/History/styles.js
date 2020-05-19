import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
      flex: 1
  },
  listCardsContiner: {
      height: '100%',
      width: '100%',
      backgroundColor: '#FFFFFF'
  },
  cardMomContainer: {
      width: '100%',
      height: 85,
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: '#dddddd'
  },
  cardPictureContainer: {
      width: '25%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
  },
  cardPictureStyle: {
      width: '70%',
      height: '80%',
      borderRadius: 30
  },
  cardInformationContainer: {
      width: '50%',
      height: '100%',
      justifyContent: 'center'
  },
  cardNameStyle: {
      fontSize: 18,
      marginBottom: '2%'
  },
  cardCommentStyle: {
      color: '#BCBCBC'
  },
  cardMomsNumberContainer: {
      width: '25%',
      height: '100%',
      justifyContent: 'center'
  },
  cardMomsNumber: {
      marginBottom: '2%',
      color: '#CA008C'
  },

  noFriendsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
});
