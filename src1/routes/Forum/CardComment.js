import React from 'react';
import { View, Text, Image } from 'react-native';
import moment from 'moment';

import images from '../../config/images';
import styles from './styles';

const CardComment = ({ comment }) => (
  
  <View style={styles.commentRow}>
 
    <Image
      style={styles.commentAvatar}
      source={ comment.picture !=='none' ? {uri: comment.picture} :images.avatar }
      />
    

    <View style={{ flex: 1 }}>
      <Text style={styles.commentName}>{comment.name} {comment.surname}</Text>
      <Text style={styles.commentTime}>{moment.utc(comment.created_at).local().format("DD/MM/YYYY, HH[h]mm")}</Text>     
      <Text style={styles.commentContent}>{comment.content}</Text>

    </View>
  </View>
    );

export default CardComment;