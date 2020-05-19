import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import styles from './styles';
import images from '../../config/images';
import config from '../../config/config.js';
import { Header, ModalSource } from '../../components';

class ForgetPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			errorMessage: '',
			location: {
				latitude: '',
				longitude: ''
			},
			loading: false,
			deviceId: ''
		};
		this.session_token = '';
	}

	forgetPassword() {
		const emailPattern = ModalSource.emailPattern;
		if (this.state.email === '') {
			this.setState({ errorMessage: '*Veuillez remplir tous les champs requis' });
			return;
		} else if (!emailPattern.test(this.state.email)) {
			this.setState({ errorMessage: "*L'adresse E-Mail n'est pas valide" });
			return;
		}
		this.setState({ errorMessage: '', loading: true });
		axios({
			method: 'post',
			url: config.baseUrl.concat('forgotPassword'),
			headers: config.headers,
			data: {
				email: this.state.email
			}
		})
			.then(response => {
				if (response.data.success === 0) {
					this.setState({ errorMessage: "*Cet e-mail n'existe pas", loading: false });
					return;
				}
				Alert.alert(
					'',
					'Veuillez vérifier votre e-mail pour réinitialiser votre mot de passe',
					[{ text: 'Ok' }],
					{ cancelable: false }
				);
				this.setState({ loading: false });
			})
			.catch(error => {
				Alert.alert('', 'Une erreur est survenue', [{ text: 'Ok' }], { cancelable: false });
			});
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={styles.container}>
					<Header option="" iconName="" />
					<ActivityIndicator style={{ marginTop: '50%' }} size="small" color="#bc0e91" />
				</View>
			);
		}
		return (
			<KeyboardAwareScrollView contentContainerStyle={styles.container}>
				<View style={styles.logoContainer}>
					<Image source={images.logo} style={styles.logo} />
					<Text style={styles.moto}>Veuillez vérifier votre e-mail</Text>
					<Text style={styles.moto}>pour réinitialiser votre mot de passe</Text>
				</View>

				<View style={styles.form}>
					<TextInput
						style={styles.inputStyle}
						placeholderTextColor="#830a65"
						placeholder="E-mail"
						underlineColorAndroid="transparent"
						onChangeText={email => this.setState({ email })}
						value={this.state.email}
						keyboardType="email-address"
						ref="username"
						onSubmitEditing={() => {
							this.refs.password.focus();
						}}
						returnKeyType="next"
						blurOnSubmit={false}
						autoCapitalize="none"
						autoCorrect={false}
					/>

					<TouchableOpacity style={styles.loginButton} onPress={this.forgetPassword.bind(this)}>
						<Text style={styles.loginButtonText}>Confirmer</Text>
						<Text style={styles.loginArrow}>
							<Icon name="angle-right" size={22} color="#fff" />
						</Text>
					</TouchableOpacity>
					<View style={{ alignItems: 'center' }}>
						<Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
					</View>
				</View>
				<TouchableOpacity style={styles.backButton} onPress={() => Actions.pop()}>
					<Icon name="angle-left" size={30} color="#bc0e91" />
					<Text style={styles.backText}>Précédent</Text>
				</TouchableOpacity>
			</KeyboardAwareScrollView>
		);
	}
}

export { ForgetPassword };
