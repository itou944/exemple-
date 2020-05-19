import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ListView,
  Dimensions,
  LayoutAnimation
} from 'react-native';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import axios from 'axios';
import ls from 'react-native-local-storage';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import styles from './styles';
import images from '../../config/images';
import config from '../../config/config.js';
import strings from '../../config/strings.js';
import { Header, ModalSource } from '../../components';
import MyMoms from './../MyMoms/MyMoms';

const { width } = Dimensions.get('window');

const CancelToken = axios.CancelToken;

class Profile extends Component {
  constructor(props) {
    super(props);

    let langsPlaceholder = props.data.userLangsPlaceholder;
    if (langsPlaceholder.length > 30) {
      langsPlaceholder = langsPlaceholder.substring(0, 30).concat('...');
    }

    let hobbiesPlaceholder = props.data.userHobbiesPlaceholder;
    if (hobbiesPlaceholder.length > 30) {
      hobbiesPlaceholder = hobbiesPlaceholder.substring(0, 30).concat('...');
    }

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      name: props.data.name,
      cogname: props.data.cogname,
      imageSource: props.data.imageSource,
      languages: props.data.languages,
      langsPlaceholder,
      hobbiesPlaceholder,
      sliderValue: props.data.radius,
      sliderText: props.data.radius.toString().substring(0, 3),
      isModalOpen: props.openMymoms,
      modalTitle: '',
      child: {
        languages: props.data.child.languages,
        age: props.data.child.age,
        hobbies: props.data.child.hobbies
      },

      dataSource: ds.cloneWithRows(props.data.dataSource),
      children: ds2.cloneWithRows(props.data.children),
      index: 0
    };

    this.session_token = '';
    ls.get('session_token').then(sessionToken => {
      this.session_token = sessionToken;
    });
    if (props.openMymoms) {
      setTimeout(() => {
        this.setState({ isOpenModal: true });
      }, 1000);
    }

    this.cancelToken = CancelToken.source();
  }

  componentWillReceiveProps() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.setState({ children: ds.cloneWithRows(this.props.data.children) });
  }

  updateRadius() {
    if (this.state.sliderValue.toString().substring(0, 3) !== this.state.sliderText) {
      this.cancelToken.cancel();
      this.cancelToken = CancelToken.source();
      axios({
        method: 'post',
        url: config.baseUrl.concat('updateRadius'),
        headers: config.headers,
        data: {
          id: this.props.data.userID,
          radius: this.state.sliderValue,
          session_token: this.session_token
        },
        cancelToken: this.cancelToken.token
      })
        .then(resp => {
          console.log(resp);
          const data = { ...this.props.propsData };
          data.radius = this.state.sliderValue;
          ls.save('data', data);
        })
        .catch(err => console.log(err));

      this.setState({
        sliderText: this.state.sliderValue.toString().substring(0, 3)
      });
    }
  }

  scrollBy(diff, animated) {
    const newIndex = this.state.index + diff;

    if (newIndex < 0 || newIndex >= this.props.data.children.length) {
      return;
    }

    LayoutAnimation.easeInEaseOut();
    this.setState({ index: newIndex + diff });
    this.listView.scrollTo({ x: newIndex * (width - 20), y: 0, animated });
  }

  renderChildren(rowData) {
    const dynWidth = width - 20;
    const dynMargin = this.props.data.children.length > 1 ? 5 : 0;
    const dynStyle = { width: dynWidth, marginRight: dynMargin };
    let age = '';
    console.log("Vars: ", rowData);


		if (rowData.days > 729) {
			age = ''.concat(rowData.age, ' ans');
		} else if (rowData.days > 30) {
			age = ''.concat(rowData.months, ' mois');
		} else {
			age = rowData.days > 1 ? ''.concat(rowData.days, ' jours') : ''.concat(rowData.days, ' jour');
    }
    
    console.log("Days: ", rowData.days);

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
          <View style={styles.kidField}>
            <Text style={styles.nameField}>{strings.languages[this.props.langID]}</Text>
            <View style={styles.cardHobbiesNumber}>
              <Text style={{ color: '#fff' }}>{rowData.languages.length}</Text>
            </View>
          </View>
          <View style={[styles.kidField, styles.middleDetail]}>
            <Text style={styles.nameField}>{strings.ageOfChild[this.props.langID]}</Text>
            <Text style={styles.valueField}>{age}</Text>
          </View>
          <View style={styles.kidField}>
            <Text style={styles.nameField}>{strings.hobbies[this.props.langID]}</Text>
            <View style={styles.cardHobbiesNumber}>
              <Text style={{ color: '#fff' }}>{rowData.hobbies.length}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderModal() {
    return (
      <Modal
        backdropPressToClose={false}
        isOpen={this.state.isOpenModal}
        onClosed={() => this.setState({ isOpenModal: false })}
        style={styles.modalContainer}
        position={'center'}
        backdropOpacity={0}
      >
        <View style={{ flex: 1, zIndex: 100 }}>
          <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
            <Header
              logoName=""
              option="PreviousBox"
              iconName=""
              modalClose={() => this.setState({ isOpenModal: false })}
              langID={this.props.langID}
            />
            <MyMoms
              data={this.props.userFriends}
              langs={this.props.langs}
              userID={this.props.userID}
              user={this.props.user}
              getFriends={() => {
                this.props.getFriends();
              }}
              deleteFriend={() => {
                this.props.deleteFriend();
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          option="Edit"
          iconName="cog"
          data={this.props.data}
          userID={this.props.userID}
          langID={this.props.langID}
        />
        <View style={styles.profileTabView}>
          <Image
            style={styles.logoButton}
            source={
              this.state.imageSource !== 'none' ? { uri: this.state.imageSource } : images.avatar
            }
          />

          <View
            style={styles.credentialRow}
            onPress={() => {
              this.props.setLanguage(Math.abs(this.props.langID - 1));
            }}
          >
            <Text style={styles.nameField}>{strings.name[this.props.langID]}</Text>
            <Text style={styles.valueField}>{this.state.name}</Text>
          </View>

          <View style={styles.credentialRow}>
            <Text style={styles.nameField}>{strings.surname[this.props.langID]}</Text>
            <Text style={styles.valueField}>{this.state.cogname}</Text>
          </View>

          <View style={styles.credentialRow}>
            <Text style={styles.nameField}>{strings.languages[this.props.langID]}</Text>
            <Text style={styles.valueField}>{this.state.langsPlaceholder}</Text>
          </View>

          <View style={[styles.credentialRow]}>
            <Text style={styles.nameField}>{strings.hobbies[this.props.langID]}</Text>
            <Text style={styles.valueField}>{this.state.hobbiesPlaceholder}</Text>
          </View>

          <View style={[styles.credentialRow]}>
            <Text style={styles.nameField}>{strings.friends[this.props.langID]}</Text>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => this.setState({ isOpenModal: true })}
            >
              <Text style={[styles.valueField, { color: '#bc0e91', marginRight: '1%' }]}>
                {strings.contacts[this.props.langID]}
              </Text>
              <Icon name="angle-right" size={16} color="#bc0e91" />
            </TouchableOpacity>
          </View>

          <View style={styles.childrenContainer}>
            <ListView
              ref={ref => {
                this.listView = ref;
              }}
              horizontal
              dataSource={this.state.children}
              renderRow={rowData => this.renderChildren(rowData)}
              extraData={this.props.langID}
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

            {this.state.index < this.props.data.children.length - 1 && (
              <TouchableOpacity
                style={[styles.sideArrow, { right: 0 }]}
                onPress={() => this.scrollBy(1, true)}
              >
                <Icon name="chevron-right" size={20} color="#822A6C" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.nameField}>Votre {strings.radiusSearch[this.props.langID]} est à : </Text>
            <Slider 
              value={this.state.sliderValue}
              onValueChange={value => {
                this.setState({ sliderValue: value });
                this.updateRadius();
              }}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              minimumTrackTintColor="#bc0e91"
              minimumValue={1}
              maximumValue={3}
              step={1}
            />

            <View style={styles.sliderLabel}>
              <Text style={styles.kmText}>1 KM</Text>
              <Text style={styles.kmText}>2 KM</Text>
              <Text style={styles.kmText}>3 KM</Text>
            </View>

          </View>

        </View>
        {this.renderModal()}
      </View>
    );
  }
}

const mapStateToProps = ({ main }) => {
  const { langID } = main;
  return { langID };
};

export default connect(
  mapStateToProps,
  actions
)(Profile);
