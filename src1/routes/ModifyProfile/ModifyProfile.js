import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ListView,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  LayoutAnimation
} from 'react-native';
import Modal from 'react-native-modalbox';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import ls from 'react-native-local-storage';

import { Header, ModalSource } from '../../components';
import styles from './styles';
import config from '../../config/config.js';
import images from '../../config/images';
import strings from './../../config/strings';

const { width } = Dimensions.get('window');

class ModifyProfile extends Component {
  constructor(props) {
    super(props);


    const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const ds3 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    const today = new Date();
    const max = ''.concat(today.getFullYear(), '-', today.getMonth() + 1, '-', today.getDate());
    let langsPlaceholder = props.data.userLangsPlaceholder;
    if (langsPlaceholder.length > 35) {
      langsPlaceholder = langsPlaceholder.substring(0, 30).concat('...');
    }

    let hobbiesPlaceholder = props.data.userHobbiesPlaceholder;
    if (hobbiesPlaceholder.length > 35) {
      hobbiesPlaceholder = hobbiesPlaceholder.substring(0, 30).concat('...');
    }

    const oldKids = [];
    const interactivityKids = [];
    for (let i = 0; i < props.data.children.length; i++) {
      interactivityKids.push({
        birthDate: undefined,
        languages: undefined,
        hobbies: undefined,
        childID: props.data.children[i].childID
      });
      oldKids.push(props.data.children[i]);
    }

    this.state = {
      isSaved: false,
      loading: false,
      cords: {
        x: 0
      },
      x: 0,
      axiosCount: 0,
      isOpenModal: false,
      modalTitle: '',
      langsPlaceholder,
      hobbiesPlaceholder,

      name: props.data.name,
      cogname: props.data.cogname,
      imageSource: props.data.imageSource,
      imageSourceUpload: '',
      user: {
        languages: props.data.languages,
        hobbies: props.data.hobbies
      },

      dynDataModal: {
        name: [],
        icons: [],
        check: []
      },
      dataSource: ds3.cloneWithRows(ModalSource.userHobbies),

      child: {
        languages: [],
        age: props.data.child.age,
        hobbies: props.data.child.hobbies
      },
      maxDate: max,
      childID: 0,
      childrenIndex: 0,
      children: ds2.cloneWithRows(props.data.children),
      kids: props.data.children,
      oldKids,

      interactivity: {
        wasLangOpen: false,
        wasHobbOpen: false,
        wasKidLangOpen: false,
        wasKidHobbOpen: false,
        wasPhotoChange: false,

        languages: [],
        hobbies: [],

        children: interactivityKids
      },
      index: 0
    };

    this.session_token = '';
    ls.get('session_token').then(sessionToken => {
      this.session_token = sessionToken;
    });
  }

  addChild() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state.kids.push({
      languages: [],
      age: 5,
      hobbies: [],
      birthDate: '',
      id: undefined
    });

    this.setState({
      children: ds.cloneWithRows(this.state.kids)
    });

    setTimeout(() => {
      const childWidthOne = width * 0.9;
      this.listView.scrollTo({ x: (this.state.kids.length - 1) * childWidthOne });
    }, 1);
  }

  changeCheckList(listSource, nameSource) {
    const checkList = [];
    for (let i = 0; i < nameSource.length; i++) {
      checkList[i] = listSource.indexOf(nameSource[i]) !== -1;
    }
    return checkList;
  }

  handleScroll(event: Object) {
    this.state.cords.x = event.nativeEvent.contentOffset.x;
  }

  updateFailed() {
    this.setState({ isSaved: true, loading: false });
    return Alert.alert(
      '',
      strings.errorMessage[this.props.langID],
      [{ text: 'Ok', onPress: () => Actions.loginOrSignUp({ type: 'reset' }) }],
      { cancelable: false }
    );
  }

  openModal(title, dataSource) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    switch (title) {
      case 'User Hobbies':
        this.state.dynDataModal.name = ModalSource.userHobbies;
        this.state.dynDataModal.icons = ModalSource.userHobbiesIcons;
        break;

      case 'Child Hobbies':
        this.state.dynDataModal.name = ModalSource.childrenHobbies;
        this.state.dynDataModal.icons = ModalSource.childrenHobbiesIcons;
        break;

      default:
        //Languages Case
        this.state.dynDataModal.name = ModalSource.languages;
        this.state.dynDataModal.icons = ModalSource.languagesIcons;
    }
    const dynSource = this.state.dynDataModal;
    dynSource.check = this.changeCheckList(dataSource, dynSource.name);

    this.setState({
      isOpenModal: true,
      modalTitle: title,
      dataSource: ds.cloneWithRows(dynSource.name)
    });
  }

  makeRequest(methodName, id, param, isChild) {
    const data = { ...param };
    data.id = id;
    data.session_token = this.session_token;
    if (isChild) {
      data.user_id = this.props.data.userID;
    }

    this.state.axiosCount++;
    axios({
      method: 'post',
      url: config.baseUrl.concat(methodName),
      headers: config.headers,
      data
    })
      .then(response => {
        console.log(response);
        this.setState({ axiosCount: this.state.axiosCount - 1 });
      })
      .catch(error => {
        console.log(methodName);
        console.log(error);
        this.updateFailed();
      });
  }

  removeChild(id, index) {
    //nuk mund te fshish nese ke vetem nje femije
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const isFromOld = this.state.oldKids.indexOf(this.state.kids[index]) !== -1;
    if (this.state.kids.length === 1) {
      Alert.alert('', 'Désolé. Vous devez avoir au moins un enfant renseigné.', [{ text: 'Ok' }], {
        cancelable: false
      });
    }

    if (this.state.kids.length > 1 || this.state.oldKids.length > 1) {
      if (isFromOld && this.state.oldKids.length > 1) {
        Alert.alert(
          '',
          strings.removeChild[this.props.langID],
          [
            { text: strings.no[this.props.langID] },
            {
              text: strings.yes[this.props.langID],
              style: 'cancel',
              onPress: () => {
                //heqim child e klikuar nga array i kids
                this.state.kids.splice(index, 1);
                this.state.oldKids.splice(index, 1);
                this.setState({ index: this.state.index === 0 ? 0 : this.state.index - 1, kids: this.state.kids, children: ds.cloneWithRows(this.state.kids) });
                this.makeRequest('removeChild', id, {}, true);
              }
            }
          ],
          { cancelable: false }
        );
      }
      if (!isFromOld && this.state.kids.length > 1) {
        this.state.kids.splice(index, 1);
        this.setState({ index: this.state.index === 0 ? 0 : this.state.index - 1, children: ds.cloneWithRows(this.state.kids) });
      }
    }
  }

  saveDatas() {
    if (this.state.name === '' || this.state.cogname === '') {
      Alert.alert('', strings.fillMessage[this.props.langID], [{ text: 'Ok' }], {
        cancelable: false
      });
      return;
    }

    if (!this.saveNewChildren()) {
      this.setState({ loading: true });
      //données utilisateurs de base
      const datas = {
        name: this.state.name,
        surname: this.state.cogname
      };
      if (this.state.imageSourceUpload !== '') {
        datas.picture = this.state.imageSourceUpload;
      }
      this.makeRequest('updateProfile', this.props.data.userID, datas, false);


      if (this.state.interactivity.wasLangOpen) {
        this.makeRequest(
          'updateUserLang',
          this.props.data.userID,
          { languages: this.state.interactivity.languages },
          false
        );
      }


      if (this.state.interactivity.wasHobbOpen) {
        this.makeRequest(
          'updateUserHobby',
          this.props.data.userID,
          { hobbies: this.state.interactivity.hobbies },
          false
        );
      }

      for (let i = 0; i < this.state.interactivity.children.length; i++) {

        if (this.state.interactivity.children[i].languages !== undefined) {
          this.makeRequest(
            'updateChildLang',
            this.state.interactivity.children[i].childID,
            { languages: this.state.interactivity.children[i].languages },
            true
          );
        }

        if (this.state.interactivity.children[i].hobbies !== undefined) {
          this.makeRequest(
            'updateChildHobby',
            this.state.interactivity.children[i].childID,
            { hobbies: this.state.interactivity.children[i].hobbies },
            true
          );
        }

        if (this.state.interactivity.children[i].birthDate !== undefined) {
          this.makeRequest(
            'updateChildBirthday',
            this.state.interactivity.children[i].childID,
            { bdate: this.state.interactivity.children[i].birthDate },
            true
          );
        }
      }
    }
  }

  saveFromModal() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const isLanguage =
      this.state.modalTitle === 'Child Languages' || this.state.modalTitle === 'Languages';
    let show = '';
    const newNames = [];
    const languagesIds = [];

    for (let i = 0; i < this.state.dynDataModal.check.length; i++) {
      if (this.state.dynDataModal.check[i]) {
        if (isLanguage) {
          languagesIds.push(i + 1);
        }
        newNames.push(this.state.dynDataModal.name[i]);
        if (show !== '') {
          show += ', ';
        }
        show += this.state.dynDataModal.name[i];
      }
    }
    if (show.length > 35) {
      show = show.substring(0, 33).concat('...');
    }

    switch (this.state.modalTitle) {
      case 'Languages':
        this.state.interactivity.languages = languagesIds;
        this.state.user.languages = newNames;
        this.state.interactivity.wasLangOpen = true;

        this.setState({
          langsPlaceholder: show
        });
        break;
      case 'User Hobbies':
        this.state.interactivity.hobbies = newNames;
        this.state.user.hobbies = newNames;
        this.state.interactivity.wasHobbOpen = true;

        this.setState({
          hobbiesPlaceholder: show
        });
        break;
      case 'Child Languages':
        try {
          this.state.interactivity.children[this.state.childrenIndex].languages = languagesIds;
          this.state.interactivity.wasKidLangOpen = true;
        } catch (e) {
          console.log(e);
        }
        this.state.kids[this.state.childrenIndex].languages = newNames;

        this.setState({
          children: ds.cloneWithRows(this.state.kids)
        });
        break;
      case 'Child Hobbies':
        try {
          this.state.interactivity.children[this.state.childrenIndex].hobbies = newNames;
          this.state.interactivity.wasKidHobbOpen = true;
        } catch (e) {
          console.log(e);
        }
        this.state.kids[this.state.childrenIndex].hobbies = newNames;

        this.setState({
          children: ds.cloneWithRows(this.state.kids)
        });
        break;
      default:
    }

    this.setState({
      dataSource: ds2.cloneWithRows(this.state.dynDataModal.name),
      isOpenModal: false
    });
  }

  saveNewChildren() {
    const kids = [];
    for (let i = 0; i < this.state.kids.length; i++) {
      if (this.state.kids[i].childID === undefined) {
        kids.push(this.state.kids[i]);
      }
    }
    //Create new children
    const newChildren = [];
    for (let i = 0; i < kids.length; i++) {
      const newChild = kids[i];
      const langs = [];
      //get the ids of languages
      for (let m = 0; m < newChild.languages.length; m++) {
        langs.push(ModalSource.languages.indexOf(newChild.languages[m]) + 1);
      }
      //Create a child
      const child = {
        bdate: newChild.birthDate,
        languages: langs,
        hobbies: newChild.hobbies
      };
      newChildren.push(child);
    }

    let hasProblems = false;
    for (let i = 0; i < newChildren.length; i++) {
      if (
        newChildren[i].languages.length === 0 ||
        newChildren[i].hobbies.length === 0 ||
        newChildren[i].bdate === ''
      ) {
        hasProblems = true;
        break;
      }
    }

    if (!hasProblems) {
      this.setState({ loading: true });
      this.makeRequest('addChild', this.props.data.userID, { children: newChildren }, false);
    } else {
      Alert.alert('', strings.fillMessage[this.props.langID], [{ text: 'Ok' }], {
        cancelable: false
      });
    }
    return hasProblems;
  }

  takePhoto() {
    const options = {
      title: '',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      takePhotoButtonTitle: strings.takePhoto[this.props.langID],
      chooseFromLibraryButtonTitle: strings.chooseFromLibrary[this.props.langID],
      cancelButtonTitle: strings.cancel[this.props.langID],
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300
    };

    ImagePicker.showImagePicker(options, response => {
      const source = 'data:image/jpeg;base64,'.concat(response.data);
      if (response.data !== undefined) {
        this.setState({
          imageSource: source,
          cameraOption: 'Change Photo',
          imageSourceUpload: response.data
        });
        this.state.interactivity.wasPhotoChange = true;
      }
    });
  }


  scrollBy(diff, animated) {
    const newIndex = this.state.index + diff;

    if (newIndex < 0 || newIndex >= this.state.kids.length) {
      return;
    }

    LayoutAnimation.easeInEaseOut();
    this.setState({ index: newIndex + diff });
    this.listView.scrollTo({ x: newIndex * (width - 20), y: 0, animated });
  }

  renderCard(rowData) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const dataSource = this.state.dynDataModal;

    const index = dataSource.name.indexOf(rowData);
    const isLanguage =
      this.state.modalTitle === 'Child Languages' || this.state.modalTitle === 'Languages';

    let backgroundColor = dataSource.check[index] ? '#bc0e91' : '#fff';
    let textColor = dataSource.check[index] ? '#fff' : '#000';
    const iconSource = dataSource.icons[index][dataSource.check[index] ? 0 : 1];

    if (isLanguage && dataSource.check[index]) {
      backgroundColor = '#E7E7E7';
      textColor = '#000';
    }

    return (
      <TouchableOpacity
        style={[styles.cardHobbieContainer, { backgroundColor }]}
        onPress={() => {
          const countTrue = dataSource.check.reduce((n, val) => n + (val === true), 0);
          dataSource.check[index] = countTrue === 1 ? true : !dataSource.check[index];
          this.setState({ dataSource: ds.cloneWithRows(dataSource.name) });
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image style={{ width: 25, height: 25, marginRight: 10 }} source={iconSource} />
          <Text style={{ color: textColor, fontSize: 16 }}>{rowData}</Text>
        </View>
        <View>
          <Icon name="check" size={23} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  }

  renderChildren(rowData) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const index = this.state.kids.indexOf(rowData);

    const dynWidth = width - 30;
    const dynMargin = this.props.data.children.length > 1 ? 5 : 0;
    const dynStyle = { width: dynWidth, marginRight: dynMargin };
    return (
      <View style={[styles.firstKidBox, dynStyle]}>
        <View style={styles.premierEfantContainer}>
          <Text style={styles.premierEfantText}>
            {ModalSource.ordinal[this.props.data.children.indexOf(rowData)][this.props.langID] ||
              ''}{' '}
            {strings.child[this.props.langID]}
          </Text>
        </View>
        <View style={styles.enfantDetails}>
          <TouchableOpacity
            style={styles.kidField}
            onPress={() => {
              this.setState({
                childID: rowData.childID,
                childrenIndex: index
              });
              this.openModal('Child Languages', this.state.kids[index].languages);
            }}
          >
            <Text style={styles.nameField}>{strings.languages[this.props.langID]}*</Text>
            <View style={styles.cardHobbiesNumber}>
              <Text style={{ color: '#fff' }}>{rowData.languages.length}</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.kidField, styles.middleDetail]}>
            <DatePicker
              style={styles.dateConainer}
              date={this.state.kids[index].birthDate}
              mode="date"
              placeholder="Date de naissance*"
              format="YYYY-MM-DD"
              minDate="1930-05-01"
              maxDate={this.state.maxDate}
              confirmBtnText={strings.confirm[this.props.langID]}
              cancelBtnText={strings.cancel[this.props.langID]}
              showIcon={false}
              timeZoneOffsetInMinutes={-1 * new Date().getTimezoneOffset()}
              customStyles={{
                dateIcon: styles.dateIcon,
                dateInput: styles.dateInput,
                placeholderText: styles.datePlaceholderText,
                dateText: styles.dateText
                // ... You can check the source to find the other keys.
              }}
              onDateChange={childBirthday => {
                this.state.kids[index].birthDate = childBirthday;
                try {
                  this.state.interactivity.children[index].birthDate = childBirthday;
                } catch (e) {
                  console.log(e);
                }
                this.setState({
                  childrenIndex: index
                });
                this.setState({ children: ds.cloneWithRows(this.state.kids) });
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.kidField}
            onPress={() => {
              this.setState({
                childID: rowData.childID,
                childrenIndex: index
              });
              this.openModal('Child Hobbies', this.state.kids[index].hobbies);
            }}
          >
            <Text style={styles.nameField}>{strings.hobbies[this.props.langID]}*</Text>
            <View style={styles.cardHobbiesNumber}>
              <Text style={{ color: '#fff' }}>{rowData.hobbies.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeChildContainer}
          onPress={this.removeChild.bind(this, rowData.childID, index)}
        >
          <Icon name="close" size={12} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  renderModal() {
    const isLanguage =
      this.state.modalTitle === 'Child Languages' || this.state.modalTitle === 'Languages';
    const modalType = isLanguage
      ? strings.chooseLangs[this.props.langID]
      : strings.chooseHobbies[this.props.langID];
    return (
      <Modal
        backdropPressToClose={false}
        isOpen={this.state.isOpenModal}
        onClosed={() => this.setState({ isOpenModal: false })}
        style={styles.modalContainer}
        position={'center'}
        backdropOpacity={0}
        position={'top'}
      >
        <View style={{ flex: 1 }}>
          <Header
            logoName={modalType}
            option="Cancel"
            iconName="Apply"
            modalClose={() => {
              this.setState({ isOpenModal: false });
            }}
            applyChanges={() => {
              this.saveFromModal();
              this.setState({ isOpenModal: false });
            }}
            langID={this.props.langID}
          />
          <View style={{ width: '100%', height: '1%' }} />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={rowData => this.renderCard(rowData)}
            removeClippedSubviews={false}
          />
        </View>
      </Modal>
    );
  }

  render() {
    if (this.state.loading) {
      if (this.state.axiosCount === 0) {
        Alert.alert('', strings.profilUpdated[this.props.langID], [{ text: 'Ok' }], {
          cancelable: false
        });
        const actionParams = this.state.interactivity.wasPhotoChange
          ? {
            type: 'reset',
            changed: true,
            imageSource: this.state.imageSource
          }
          : { type: 'reset', changed: true };
        Actions.loginOrSignUp(actionParams);
      }
      return (
        <View style={styles.container}>
          <Header option="" iconName="" />
          <ActivityIndicator style={{ marginTop: '50%' }} size="small" color="#bc0e91" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Header
          option="Go back"
          iconName="Sauver"
          refresh={this.state.isSaved}
          save={this.saveDatas.bind(this)}
          langID={this.props.langID}
        />
        <View style={styles.profileTabView}>
          <TouchableOpacity style={styles.logoButton} onPress={this.takePhoto.bind(this)}>
            <Image
              style={styles.logoButton}
              source={
                this.state.imageSource !== 'none' ? { uri: this.state.imageSource } : images.avatar
              }
            />
          </TouchableOpacity>

          <View style={styles.credentialRow}>
            <Text style={styles.nameField}>{strings.name[this.props.langID]}*</Text>
            <TextInput
              style={[styles.textInputStyle, styles.valueField]}
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
            />
          </View>

          <View style={styles.credentialRow}>
            <Text style={styles.nameField}>{strings.surname[this.props.langID]}*</Text>
            <TextInput
              style={[styles.textInputStyle, styles.valueField]}
              onChangeText={cogname => this.setState({ cogname })}
              value={this.state.cogname}
            />
          </View>

          <TouchableOpacity
            style={[styles.credentialRow]}
            onPress={this.openModal.bind(this, 'Languages', this.state.user.languages)}
          >
            <Text style={styles.nameField}>{strings.languages[this.props.langID]}*</Text>
            <Text style={styles.valueField}>{this.state.langsPlaceholder}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.credentialRow]}
            onPress={this.openModal.bind(this, 'User Hobbies', this.state.user.hobbies)}
          >
            <Text style={styles.nameField}>{strings.hobbies[this.props.langID]}*</Text>
            <Text style={styles.valueField}>{this.state.hobbiesPlaceholder}</Text>
          </TouchableOpacity>

          <View style={styles.childrenContainer}>
            <ListView
              ref={ref => {
                this.listView = ref;
              }}
              horizontal
              dataSource={this.state.children}
              renderRow={rowData => this.renderChildren(rowData)}
              onScroll={this.handleScroll.bind(this)}
              pagingEnabled
              onMomentumScrollEnd={e => {
                LayoutAnimation.easeInEaseOut();
                this.setState({ index: Math.round(e.nativeEvent.contentOffset.x / (width - 20)) });
              }}
            />

            {this.state.index !== 0 && (
              <TouchableOpacity
                style={[styles.sideArrow, { left: 0 }]}
                onPress={() => this.scrollBy(-1, true)}
              >
                <Icon name="chevron-left" size={20} color="#822A6C" />
              </TouchableOpacity>
            )}

            {this.state.index < this.state.kids.length - 1 && (
              <TouchableOpacity
                style={[styles.sideArrow, { right: 0 }]}
                onPress={() => this.scrollBy(1, true)}
              >
                <Icon name="chevron-right" size={20} color="#822A6C" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.addChildConainer}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this.addChild.bind(this)}>
              <Icon name="plus" size={24} color="#dfdfdf" />
              <Text style={styles.addChildText}>{strings.addChild[this.props.langID]}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {this.renderModal()}
      </View>
    );
  }
}

export { ModifyProfile };
