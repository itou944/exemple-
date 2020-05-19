import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import fonts from './../../config/fonts';

export default class Send extends Component {
	// shouldComponentUpdate(nextProps, nextState) {
	//   if (this.props.text.trim().length === 0 && nextProps.text.trim().length > 0 || this.props.text.trim().length > 0 && nextProps.text.trim().length === 0) {
	//     return true;
	//   }
	//   return false;
	// }
	render() {
		if (this.props.withinDist === 0) {
			return <View />;
		}
		if (this.props.text.trim().length > 0) {
			return (
				<TouchableOpacity
					style={styles.container}
					onPress={() => {
						this.props.onSend({ text: this.props.text.trim() }, true);
					}}
					accessibilityTraits="button"
				>
					<Text style={[styles.text, this.props.textStyle]}>{this.props.label}</Text>
				</TouchableOpacity>
			);
		}
		return (
			<TouchableOpacity style={styles.container} accessibilityTraits="button">
				<Text style={[styles.text, this.props.textStyle]}>{this.props.label}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = EStyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 5,
		right: 0,
		width: '25%',
		height: '5%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',

		borderLeftWidth: 1,
		borderColor: '#BA8FAA'
	},
	text: {
		color: '#BA8FAA',
		fontSize: 16,
		backgroundColor: 'transparent',
		fontWeight: '700',
		fontFamily: fonts.regularSF
	}
});

Send.defaultProps = {
	text: '',
	onSend: () => {},
	label: 'Envoyer',
	containerStyle: {},
	textStyle: {}
};

Send.propTypes = {
	text: React.PropTypes.string,
	onSend: React.PropTypes.func,
	label: React.PropTypes.string,
	containerStyle: View.propTypes.style,
	textStyle: Text.propTypes.style
};
