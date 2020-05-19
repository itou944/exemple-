import React, { Component } from 'react';
import { View, Text, ListView, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Modal from 'react-native-modalbox';
import ls from 'react-native-local-storage';
import axios from 'axios';

import config from '../../config/config.js';
import styles from "./styles";

import { Header } from '../../components';

class Reductions extends Component {
  constructor() {
    super();

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      loading: false,
      data: [],
      dataSource: ds.cloneWithRows([]),
      nextPageUrl: '',
      isOpen: false,
      selectedPost: {}
    };
    this.session_token = '';

  }
  componentWillMount() {
    ls.get('session_token').then(sessionToken => {
      this.session_token = sessionToken;
      this.getData();
    });
  }

  getData(url = config.baseUrl.concat('promo')) {
    axios({
      method: 'get',
      url,
      headers: config.headers,
      params: {
        id: this.props.userID,
        session_token: this.session_token,
        mobile: 1
      }
    },)
      .then(response => {
        console.log(response);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        // const data = this.state.data.concat(response.data.blog.data);
        const data = this.state.data
          .reverse()
          .concat(response.data.blog.data)
          .reverse();
        this.setState({
          data,
          dataSource: ds.cloneWithRows(data),
          nextPageUrl: response.data.blog.next_page_url
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  openModal(selectedPost) {
    this.setState({ isOpen: true, selectedPost });
  }

  renderCard(rowData) {
    return (
      <TouchableOpacity style={styles.cardContainer} onPress={() => this.openModal(rowData)}>
        <Image source={{ uri: rowData.picture }} style={styles.cardImage} />


        <View style={styles.spaceCards}>
          <Text style={{ color: '#bc0e91', fontSize: 10 }}>●   ●   ●</Text>
        </View>

      </TouchableOpacity>
    );
  }

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
            };
          }}
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
    const { selectedPost } = this.state;
    const url = "https://" + (selectedPost.content);
    return (
      <View style={styles.container}>
        <Header option="" iconName="" logoName="Bons plans" />

        {this.renderList()}

        <Modal
          backdropPressToClose={false}
          isOpen={this.state.isOpen}
          onClosed={this.closeModal}
          swipeToClose={false}
          position={'center'}
          backdropOpacity={0}
        >
          <Header
            option="PreviousBox"
            logoName=""
            iconName=""
            iconName=""
            modalClose={() => this.setState({ isOpen: false })}
          />
          <ScrollView>
            <Image source={{ uri: selectedPost.picture || '' }} style={styles.modalImage} />

            <View style={{ paddingHorizontal: 5 }}>
              <Text
                style={styles.modalContent}
                onPress={() => Linking.openURL(url)}
              >
                {selectedPost.content || ''}
              </Text>
            </View>

          </ScrollView>
        </Modal>
      </View>
    );
  }
}


export default Reductions;