import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform
} from 'react-native';
//import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';


const TabBar = React.createClass({

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  tabIcons: [],

  render() {
    return (
        <View style={[styles.tabs, this.props.style]}>
            {this.props.tabs.map((tab, i) => {
                return (
                    <TouchableOpacity
                        key={tab} style={styles.tab}
                    >
                      <Icon
                        name={'circle'}
                        size={10}
                        color={this.props.activeTab === i ? '#CA008C' : '#EAEAEA'}
                        ref={(icon) => { this.tabIcons[i] = icon; }}
                      />
                  </TouchableOpacity>
              );
      })}
    </View>
    );
  },
});

const widthValue = Platform.OS === 'ios' ? '20%' : '100%';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 35,
    width: widthValue,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: 0,
    borderWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});

export default TabBar;
