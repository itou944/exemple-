import React, { Component } from 'react';
import { View, Text, ListView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import ls from 'react-native-local-storage';
import axios from 'axios';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as actions from '../../actions';
import config from '../../config/config.js';
import styles from './styles';
import strings from './../../config/strings';
import { Header } from '../../components';

import ForumCard from './ForumCard';
import CardComment from './CardComment';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class Forum extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      dataSource: ds.cloneWithRows([]),
      nextPageUrl: '',
      isOpen: false,
      postText: '',
      postImage: '',
      selectedPost: -1,
      openType: 0,
      showCommentModal: false,
      commentText: '',
      selectedRow: null
    };

    this.session_token = '';
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
    ls.get('session_token').then(sessionToken => {
      this.session_token = sessionToken;
      this.getData();
    });
  }

  getData(url = config.baseUrl.concat('posts')) {
    axios({
      method: 'get',
      url,
      headers: config.headers,
      params: {
        id: this.props.userID,
        session_token: this.session_token,
        mobile: 1
      }
    })
      .then(response => {

        const data = this.state.data
          .reverse()
          .concat(response.data.posts.data)
          .reverse();

        this.setState({
          data,
          dataSource: ds.cloneWithRows(data),
          nextPageUrl: response.data.posts.next_page_url
        });
      })
      .catch(error => {
      });
  }

  openModal = (postText = '', postImage = '', selectedPost = -1) => {
    this.setState({
      isOpen: true,
      postText,
      postImage,
      selectedPost,
      openType: postText === '' ? 0 : 1
    });
  };

  closeModal() {
    this.setState({ isOpen: false });
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
      maxWidth: 400,
      maxHeight: 400
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.data !== undefined) {
        this.setState({ postImage: response.data });
      }
    });
  }

  savePost() {
    const { selectedPost, postText, postImage } = this.state;
    const methodName = this.state.openType === 0 ? 'create/post' : `update/post/${selectedPost}`;
    if (postText.trim() === '' || postImage === '') {
      Alert.alert(strings.fillMessage[this.props.langID], '', [{ text: 'Ok' }], {
        cancelable: false
      });
      return;
    }

    this.setState({ loading: true });

    axios({
      method: 'post',
      url: config.baseUrl.concat(methodName),
      headers: config.headers,
      data: {
        id: this.props.userID,
        session_token: this.session_token,
        content: postText,
        picture: postImage,
        mobile: 1
      }
    })
      .then(response => {
        const data = this.state.data;
        if (this.state.openType === 0) {
          data.unshift(response.data.post);
        } else {
          const index = data.findIndex(item => item.id === selectedPost);
          data[index] = response.data.post;
        }
        
        Alert.alert('Votre commentaire a été publié', '', [{ text: 'Ok' }], {
          cancelable: false
        });
        this.setState({
          data,
          dataSource: ds.cloneWithRows(data),
          loading: false
        });
        this.closeModal();
      })
      .catch(error => {
        this.setState({ loading: false });
      });
    }
    
    handleLike = (id, index) => {
      axios
      .post(`${config.baseUrl}like/${id}`, {
        id: this.props.userID,
        session_token: this.session_token
      })
      .then(res => {
        if (res.data.success) {
          this.setState(({ data }) => {
            const newData = [...data];
            
            newData[index].is_liked = res.data.blog.is_liked;
            newData[index].likes = res.data.blog.likes;
            
            return {
              data: newData,
              dataSource: ds.cloneWithRows(newData)
            };
          });
        }
      })
      .catch(err => '');
    };

  toggleCommentModal(shouldShow, params) {
    this.setState({ showCommentModal: shouldShow, ...params });
  }

  handleComment = () => {
    const { selectedRow, data, commentText } = this.state;
    const row = data[selectedRow];

    this.setState({ commentText: '' });

    axios
      .post(`${config.baseUrl}comment/${row.id}`, {
        id: this.props.userID,
        session_token: this.session_token,
        content: commentText,
      })
      .then(res => {
        if (res.data.success) {
          const newData = [...data];
          newData[selectedRow].comments = res.data.blog.comments;

          this.setState({
            data: newData,
            dataSource: ds.cloneWithRows(newData)
          });
        }
      })
  };

  renderCard(row, s, index) {
    return (
      <ForumCard
        lang={this.props.langID}
        rowData={row}
        index={Number(index)}
        isOwner={this.props.userID === row.user.id}
        onEdit={this.openModal}
        onLike={this.handleLike}
        onComment={() => this.toggleCommentModal(true, { selectedRow: index })}
      />
    );
  };

  renderComment(comment) {
    return <CardComment comment={comment} />;
  };

  renderList() {
    if (this.state.data.length !== 0) {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderCard.bind(this)}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (this.state.nextPageUrl) {
              this.getData(this.state.nextPageUrl);
            }
          }}
          keyboardShouldPersistTaps="always"
        />
      );
    }
    return (
      <View style={styles.noFriendsContainer}>
        <Text style={{ fontSize: 18 }}>{this.state.noDataMessage}</Text>
      </View>
    );
  }

  render() {
    const base64 = this.state.postImage.includes('http') ? '' : 'data:image/jpeg;base64,';

    return (
      <View style={styles.container}>
        <Header
          option=""
          iconName=""
          logoName="Forum"
          iconName={'plus'}
          iconColor={'#bc0e91'}
          openModal={() => this.openModal()}
        />

        {this.renderList()}

        <Modal
          backdropPressToClose={false}
          isOpen={this.state.isOpen}
          onClosed={this.closeModal}
          position={'center'}
          backdropOpacity={0}
        >
          {this.state.loading ? (
            <Header option="" iconName="" loading />
          ) : (
            <Header
              option="Cancel"
              iconName="Publish"
              modalClose={this.closeModal}
              applyChanges={() => this.savePost()}
            />
          )}

          <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {this.state.openType === 0 ? 'Nouveau message' : 'Modifier votre message'}
              </Text>

              {this.state.postImage === '' ? (
                <TouchableOpacity
                  style={styles.modalImageSelector}
                  onPress={() => this.takePhoto()}
                >
                  <Text style={styles.photoText}>Photo</Text>
                  <Icon name={'plus'} size={23} color={'#bc0e91'} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.takePhoto()}>
                  <Image
                    source={{ uri: `${base64}${this.state.postImage}` }}
                    style={styles.modalImage}
                  />
                </TouchableOpacity>
              )}

              <TextInput
                style={styles.modalInput}
                onChangeText={postText => this.setState({ postText })}
                value={this.state.postText}
                placeholder={strings.writePost[this.props.langID]}
                multiline
              />
            </View>
          </KeyboardAwareScrollView>
        </Modal>

        <Modal
          backdropPressToClose={false}
          isOpen={this.state.showCommentModal}
          onClosed={() => this.toggleCommentModal(false, { commentText: '' })}
          position={'center'}
          backdropOpacity={0.5}
          style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          swipeToClose={false}
        >


          <Header
            logoName=""
            iconName=""
            option="PreviousBox"
            modalClose={() => this.toggleCommentModal(false, { commentText: '' })}
            applyChanges={() => this.toggleCommentModal(false, { commentText: '' })}
          />

          <KeyboardAwareScrollView
            style={{ width: '100%', height: '100%' }}
            contentContainerStyle={{ flex: 1 }}
            bounces={false}
            keyboardShouldPersistTaps="always"
            scrollEnabled={false}
          >
            <View style={styles.commentComposerContainer}>
              <TextInput
                style={styles.commentComposer}
                value={this.state.commentText}
                onChangeText={val => this.setState({ commentText: val })}
                placeholder={`${strings.writeComment[this.props.langID]}...`}
                onSubmitEditing={this.handleComment}
                multiline
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: this.state.commentText.trim() === '' ? 'lightgray' : '#822A6C'
                  }
                ]}
                onPress={this.handleComment}
                disabled={this.state.commentText.trim() === ''}
              >
                <Icon name="chevron-right" color="#fff" />
              </TouchableOpacity>
            </View>

            {this.state.selectedRow && (
              <ListView
              style={{ flex: 1 }}
              dataSource={ds.cloneWithRows(
                [...this.state.data[this.state.selectedRow].comments].reverse()
                )}
                renderRow={this.renderComment.bind(this)}
                removeClippedSubviews={false}
                keyboardShouldPersistTaps="always"
                />
                )}
          </KeyboardAwareScrollView>
        </Modal>
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
)(Forum);
