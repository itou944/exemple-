 import React, { Component } from 'react';
import {
    View,
    Animated,
    PanResponder,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import axios from 'axios';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import OneSignal from 'react-native-onesignal';
import ls from 'react-native-local-storage';
import { connect } from 'react-redux';

import config from '../../config/config.js';
import * as actions from '../../actions';
import strings from '../../config/strings.js';

const { height, width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const TRANSITION_DURATION = 200;

class DeckSwiper extends Component {
  constructor(props) {
        super(props);

        const loading = false;
        this.state = {
            pan: new Animated.ValueXY(),
            selectedItem: this.props.dataSource[0],
            selectedItem2: this.props.dataSource[1],
            selectedItem3: this.props.dataSource[2],
            card1Top: true,
            card2Top: false,
            card3Top: false,
            currentIndex: 0,
            swipable: true,
            Ids: this.props.Ids,
            indexId: -1,
            message: props.message,
            loading
        };

        this.session_token = '';
        ls.get('session_token').then((sessionToken) => {
            this.session_token = sessionToken;
        });
        this.reset = this.reset.bind(this);
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 5 && this.state.swipable;
            },

            onPanResponderGrant: (e, gestureState) => {
                this.state.pan.setOffset({
                    x: this.state.pan.x._value,
                    y: this.state.pan.y._value
                });

                this.state.pan.setValue({ x: 0, y: 0 });
            },


            onPanResponderMove: (e, gestureState) => {
                    Animated.event([
                        null, { dx: this.state.pan.x },
                    ])(e, gestureState);
            },

            onPanResponderRelease: (e, { vx, dx }) => {
                this.setState({ swipable: false });

                if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
                  if (dx >= 0) {
                    Animated.timing(this.state.pan, {
                          duration: TRANSITION_DURATION,
                          toValue: { x: 600, y: 0 }
                    }).start(this._resetState.bind(this, true));
                } else if (dx < 0) {
                    Animated.timing(this.state.pan, {
                          duration: TRANSITION_DURATION,
                          toValue: { x: -600, y: 0 }
                    }).start(this._resetState.bind(this, false));
                  }
                } else {
                    Animated.spring(this.state.pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 4
                    }).start(this.setState({ swipable: true }));
                }
            }
        });
        this.itemsRef = firebase.database().ref('chats');
    }

    getInitialStyle() {
        return {
            topCard: {
                position: 'absolute',
                top: 18,
                right: 0,
                left: 0,
                zIndex: 3,
            },
            lowerCard: {
                position: 'absolute',
                top: 9,
                right: 0,
                left: 0,
                zIndex: 2,
            },
            lowestCard: {
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                zIndex: 1,
            }
        };
    }

    getCardStyles() {
        const { pan } = this.state;

        const [translateX, translateY] = [pan.x, pan.y];

        const rotate = pan.x.interpolate({
            inputRange: [-700, 0, 700],
            outputRange: ['-10deg', '0deg', '10deg']
        });

        const opacity = pan.x.interpolate({
            inputRange: [-320, 0, 320],
            outputRange: [0.9, 1, 0.9]
        });

        const lowerCardY = pan.x.interpolate({
            inputRange: [-700, 0, 700],
            outputRange: [9, 0, 9]
        });

        const lowerCardScale = pan.x.interpolate({
            inputRange: [-700, 0, 700],
            outputRange: [1, 0.94, 1]
        });

        const lowestCardScale = pan.x.interpolate({
            inputRange: [-700, 0, 700],
            outputRange: [0.94, 0.88, 0.94]
        });

        const animatedCardStyles = {
            transform: [
                { translateX },
              //  { translateY },
                { rotate }
            ],
            opacity
        };

        const animatedCardStyles2 = {
            transform: [
                { translateY: lowerCardY },
                { scaleX: lowerCardScale }
            ] };

        const animatedCardStyles3 = {
            transform: [
                { translateY: lowerCardY },
                { scaleX: lowestCardScale }
            ] };

        return [animatedCardStyles, animatedCardStyles2, animatedCardStyles3];
    }

    reset() {
      this.setState({
        selectedItem: this.props.dataSource[0],
        selectedItem2: this.props.dataSource[1],
        selectedItem3: this.props.dataSource[2],
        currentIndex: 0
      });
    }

    findNextIndexes() {
        const currentIndex = this.state.currentIndex;
        const newIdx = currentIndex + 1;
        const newIdx2 = currentIndex + 2;
        const newIdx3 = currentIndex + 3;

        return [newIdx, newIdx2, newIdx3];
    }

    selectNext() {
        const nextIndexes = this.findNextIndexes();
        const currentIndex = this.state.currentIndex;

        if (currentIndex % 3 === 0) {
            this.setState({
                selectedItem3: this.props.dataSource[nextIndexes[1]],
                selectedItem: this.props.dataSource[nextIndexes[2]],
            });
        } else if (currentIndex % 3 === 1) {
            this.setState({
                selectedItem: this.props.dataSource[nextIndexes[1]],
                selectedItem2: this.props.dataSource[nextIndexes[2]]
            });
        } else {
            this.setState({
                selectedItem2: this.props.dataSource[nextIndexes[1]],
                selectedItem3: this.props.dataSource[nextIndexes[2]]
            });
        }
    }

    swipeRight() {
      if (this.state.swipable) {
        Animated.timing(this.state.pan, {
              duration: TRANSITION_DURATION,
              toValue: { x: 700, y: 0 }
        }).start(this._resetState.bind(this, true));
      }
    }

    swipeLeft() {
      if (this.state.swipable) {
        Animated.timing(this.state.pan, {
              duration: TRANSITION_DURATION,
              toValue: { x: -700, y: 0 }
        }).start(this._resetState.bind(this, false));
      }
    }

    _resetState(isRight) {
        let selectedItem = {};
        if (this.state.card1Top) {
            selectedItem = this.state.selectedItem;
        } else if (this.state.card2Top) {
            selectedItem = this.state.selectedItem2;
        } else if (this.state.card3Top) {
            selectedItem = this.state.selectedItem3;
        }
        this.state.pan.setValue({ x: 0, y: 0 });
        this.selectNext();

        this.setState({ swipable: true });

        const index = this.state.currentIndex + 1;

        this.setState({
            card1Top: index % 3 === 0,
            card2Top: index % 3 === 1,
            card3Top: index % 3 === 2,
            currentIndex: index,
        });

        if (this.props.suggestedFriend !== undefined) {
            this.setState({ indexId: 0 });
        }

        if (isRight && this.props.friend === undefined) {
            axios({
                method: 'post',
                url: config.baseUrl.concat('friendRequest'),
                headers: config.headers,
                data: {
                    id: this.props.userID,
                    friend: selectedItem.id,
                    session_token: this.session_token
                }
            })
            .then((resp) => {
                console.log(resp);
                axios({
                    method: 'post',
                    url: config.baseUrl.concat('get-device-id'),
                    headers: config.headers,
                    data: {
                        id: this.props.userID,
                        user_id: selectedItem.id,
                        session_token: this.session_token
                    }
                })
                .then((response) => {
                    console.log(response);
                    console.log(response.data.device_id);
                    if (response.data.device_id !== null) {
                        OneSignal.postNotification(
                            {
                                en: strings.friendRequest[this.props.langID]
                            }, // No content
                            {
                                type: 'request',
                                id: this.props.userID
                            }, // data
                            response.data.device_id, // recipient
                            // other params, as introduced in this PR
                            {
                                priority: 1
                            }
                        );
                    }
                }).catch(() => {});
            })
            .catch(() => {});
        }
        if (!isRight && this.props.friend === undefined) {
            axios({
                method: 'post',
                url: config.baseUrl.concat('ignoreUser'),
                headers: config.headers,
                data: {
                    id: this.props.userID,
                    friend: selectedItem.id,
                    session_token: this.session_token
                }
            })
            .then((resp) => {
                console.log(resp);
            })
            .catch(() => {});
        }
        if (isRight && this.props.friend !== undefined) {
                this.itemsRef.push({ title: 'hello test end' });

                this.itemsRef.once('value', (snap) => {
                  // get children as an array
                  const key = Object.keys(snap.val())[Object.keys(snap.val()).length - 1];
                  axios({
                          method: 'post',
                          url: config.baseUrl.concat('acceptRequest'),
                          headers: config.headers,
                          data: {
                              id: this.props.userID,
                              friend: selectedItem.id,
                              key,
                              session_token: this.session_token
                          }
                  },)
                  .then((response) => {
                          this.props.getRequests()
                          ls.get('userFriends').then((userFriends) => {
                              const user = {
                                  name: selectedItem.name,
                                  imageSource: selectedItem.imageSource,
                                  id: selectedItem.id,
                                  friendCount: selectedItem.friendCount,
                                  chatCount: 0
                              };
                              userFriends.push(user);
                              ls.save('userFriends', userFriends);
                              this.props.startFriends();
                          });
                          axios({
                              method: 'post',
                              url: config.baseUrl.concat('get-device-id'),
                              headers: config.headers,
                              data: {
                                  id: this.props.userID,
                                  user_id: this.props.id,
                                  session_token: this.session_token
                              }
                          })
                          .then((resp) => {
                              if (resp.data.device_id !== null) {
                                  OneSignal.postNotification(
                                      {
                                          en: strings.acceptRequest[this.props.langID].concat(
                                              this.props.fullName
                                          )
                                      }, // No content
                                      {
                                          type: 'accept',
                                          id: this.props.userID
                                      }, // data
                                      resp.data.device_id, // recipient
                                      // other params, as introduced in this PR
                                      {
                                          priority: 1
                                      }
                                  );
                              }
                          }).catch(() => {});
                          this.props.getRequests();
                  })
                  .catch(() => {});
              });
        }

        if (!isRight && this.props.friend !== undefined) {
                axios({
                    method: 'post',
                    url: config.baseUrl.concat('rejectRequest'),
                    headers: config.headers,
                    data: {
                        id: this.props.userID,
                        friend: selectedItem.id,
                        session_token: this.session_token
                    }
                })
                .then((response) => {
                    console.log(response);
                    this.props.getRequests();
                })
                .catch((error) => { console.log(error); });
        }

        if (this.state.selectedItem2 === undefined && this.state.selectedItem3 === undefined && this.state.selectedItem === undefined) {
            this.props.finish();
        }

        this.setState({ indexId: this.state.indexId + 1 });

        if (this.props.suggestedFriend !== undefined) {
            Actions.pop();
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator
                      style={{ marginTop: '50%' }}
                      size="small"
                      color="#bc0e91"
                    />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View>
                        <Animated.View
                          key={3}
                          renderToHardwareTextureAndroid={this.state.card3Top}
                          style={[
                              this.getCardStyles()[this.state.card3Top ?
                                  0
                                  :
                                  this.state.card2Top ?
                                    1
                                    :
                                    2
                              ],
                              this.state.card3Top ?
                                  this.getInitialStyle().topCard
                                  :
                                  this.state.card2Top ?
                                  this.getInitialStyle().lowerCard
                                  :
                                  this.getInitialStyle().lowestCard
                          ]}
                          {...this._panResponder.panHandlers}
                        >
                            {this.state.selectedItem3 && this.props.renderItem(this.state.selectedItem3)}
                      </Animated.View>


                      <Animated.View
                        key={2}
                        renderToHardwareTextureAndroid={this.state.card2Top}
                        style={[
                            this.getCardStyles()[this.state.card2Top ?
                                0
                                :
                                this.state.card1Top ?
                                1
                                :
                                2
                            ],
                            this.state.card2Top ?
                                this.getInitialStyle().topCard
                                :
                                this.state.card1Top ?
                                this.getInitialStyle().lowerCard
                                :
                                this.getInitialStyle().lowestCard
                        ]}
                        {...this._panResponder.panHandlers}
                      >
                          {this.state.selectedItem2 && this.props.renderItem(this.state.selectedItem2)}
                    </Animated.View>

                    <Animated.View
                        key={1}
                        renderToHardwareTextureAndroid={this.state.card1Top}
                        style={[
                            this.getCardStyles()[this.state.card1Top ?
                                0
                                :
                                this.state.card3Top ?
                                1
                                :
                                2
                            ],
                            this.state.card1Top ?
                                this.getInitialStyle().topCard
                                :
                                this.state.card3Top ?
                                this.getInitialStyle().lowerCard
                                :
                                this.getInitialStyle().lowestCard
                        ]}
                        {...this._panResponder.panHandlers}
                    >
                         {this.state.selectedItem && this.props.renderItem(this.state.selectedItem)}
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: height * 0.6,
        width: width * 0.9,
        position: 'relative',
        flexDirection: 'column'
    },

    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
});

DeckSwiper.propTypes = {
  ...View.propTypes,
  style: React.PropTypes.object,
  dataSource: React.PropTypes.array,
};

const mapStateToProps = ({ main }) => {
    const { langID } = main;
    return { langID };
};

export default connect(mapStateToProps, actions, null, { withRef: true })(DeckSwiper);
