import React from 'react';
import { Platform, StyleSheet, TextInput, View, Text } from 'react-native';
import fonts from './../../config/fonts';

export default class Composer extends React.Component {
	render() {
		if (this.props.withinDist === 0) {
			// You are too far from this user
			return (
				<View style={styles.messageContainer}>
					<Text style={styles.textMessage}>
						Cette utilisatrice n’est pas dans le périmètre de 3km
					</Text>
				</View>
			);
		}
		return (
			<TextInput
				autoCapitalize="sentences"
				autoCorrect
				placeholder={this.props.placeholder}
				placeholderTextColor={this.props.placeholderTextColor}
				multiline={this.props.multiline}
				onChange={e => {
					this.props.onChange(e);
				}}
				style={[
					styles.textInput,
					this.props.textInputStyle,
					{
						height: this.props.composerHeight
					}
				]}
				value={this.props.text}
				accessibilityLabel={this.props.text || this.props.placeholder}
				enablesReturnKeyAutomatically
				underlineColorAndroid="transparent"
				{...this.props.textInputProps}
			/>
		);
	}
}

const styles = StyleSheet.create({
	textInput: {
		width: '70%',
		height: '100%',
		marginLeft: 10,
		fontSize: 16,
		lineHeight: 16,
		color: '#fff',
		fontFamily: fonts.regularSF,
		marginTop: Platform.select({
			ios: 6,
			android: 0
		}),
		marginBottom: Platform.select({
			ios: 5,
			android: 3
		})
	},

	messageContainer: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		paddingTop: 10
	},
	textMessage: {
		fontFamily: fonts.regularSF,
		color: '#D5BBCC',
		fontSize: 16
	}
});

Composer.defaultProps = {
	onChange: () => { },
	composerHeight: Platform.select({
		ios: 33,
		android: 41
	}), // TODO SHARE with GiftedChat.js and tests
	composerWidth: '80%',
	text: '',
	placeholder: 'Ecrire votre message',
	placeholderTextColor: '#D5BBCC',
	textInputProps: null,
	multiline: true,

	textInputStyle: {}
};

Composer.propTypes = {
	onChange: React.PropTypes.func,
	composerHeight: React.PropTypes.number,
	text: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	placeholderTextColor: React.PropTypes.string,
	textInputProps: React.PropTypes.object,
	multiline: React.PropTypes.bool,
	textInputStyle: TextInput.propTypes.style
};
