import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import images from '../../config/images';
import styles from './styles';
import strings from '../../config/strings';

const ForumCard = ({ rowData, index, isOwner, onEdit, onLike, onComment, lang }) => (

  <View style={styles.cardContainer}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
      <View style={styles.cardUserContainer}>

        <Image
          style={styles.cardUserImage}
          source={rowData.user.picture !== 'none' ? { uri: rowData.user.picture } : images.avatar}
        />

        <Text style={styles.cardUserName}>
          {rowData.user.name} {rowData.user.surname}
          <Text style={styles.cardUserDate}>
            {"\n"}{moment.utc(rowData.created_at).local().format("DD/MM/YYYY à HH:mm")}
          </Text>
        </Text>

      </View>

      {isOwner && (
        <TouchableOpacity
          style={styles.modalMoreButton}
          onPress={() => onEdit(rowData.content, rowData.picture, rowData.id)}
        >
          <Text>{strings.edit[lang]}</Text>
        </TouchableOpacity>
      )}
    </View>

    <Text style={styles.cardText}>{rowData.content}</Text>

    <Image source={{ uri: rowData.picture }} style={styles.cardImage} />

    <View style={styles.cardMiniFooter}>
      <Text style={{ fontSize: 12 }}>
        <Icon name="heart" size={12} style={{ color: '#822A6C' }} /> {rowData.likes}
      </Text>

      <Text style={{ fontSize: 12 }}>
        {rowData.comments.length} {strings.comment[lang].toLowerCase()}
        {rowData.comments.length > 1 ? 's' : ''}
      </Text>
    </View>

    <View style={styles.cardFooter}>

      <TouchableOpacity
        style={styles.cardFooterButton}
        onPress={() => onLike(rowData.id, index)}
      >
        <Text>
          <Icon name="heart" size={20} style={{ color: rowData.is_liked ? '#822A6C' : 'gray' }} /> {' '}
          Like
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardFooterButton}
        onPress={() => onComment(rowData.id, index)}
      >
        <Text>
          <Icon name="comment-o" size={20} style={{ color: 'gray' }} /> {strings.comment[lang]}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default ForumCard;
