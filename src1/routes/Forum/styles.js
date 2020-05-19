import { StyleSheet, Platform } from 'react-native';
import images from '../../config/images';
//import fonts from './../../config/fonts';

const font = Platform.OS === 'ios' ? 'Helvetica' : 'Roboto';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  noFriendsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 5
  },
  cardUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cardUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  cardUserName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#bc0e91'
  },
  cardUserDate: {
    fontSize: 12,
    color: 'gray',
    lineHeight: 20
  },
  cardText: {
    marginHorizontal: 10,
    marginTop: 10
  },
  cardImage: {
    width: '100%',
    height: 200,
    marginTop: 10
  },
  cardFooter: {
    flexDirection: 'row',
    width: '100%',
    height: 50
  },
  cardMiniFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: -5
  },
  cardFooterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  //Comments
  commentHeader: {
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    marginBottom: 20
  },
  commentComposer: {
    height: '100%',
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    paddingVertical: 5,
    justifyContent: 'flex-start'
  },
  commentComposerContainer: {
    height: 60,
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  submitButton: {
    width: 40,
    height: '100%',
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center'
  },
  commentRow: {
    borderRadius: 4,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    paddingVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row'
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10
  },
  commentTime: { 
    fontSize: 12,
    color: 'gray',
    lineHeight: 20,
  },
  commentName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: font,
    color: '#bc0e91'
  },
  commentContent: {
    fontSize: 15,
    fontFamily: font,
    marginTop: 15,
    marginBottom: 5
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: '200'
  },
  modalImageSelector: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bc0e91',
    marginTop: 20
  },
  modalImage: {
    width: '100%',
    height: 150,
    marginTop: 20
  },
  modalInput: {
    height: 250,
    borderColor: '#bc0e91',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    padding: 10
  },
  modalMoreButton: {
    padding: 10,
    alignSelf: 'center'
  },
  moreIcon: {
    width: 30,
    height: 7,
    resizeMode: 'cover',
    tintColor: '#4A4A4A'
  },
  photoText: {
    fontSize: 18,
    color: '#bc0e91',
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: font
  }
});
