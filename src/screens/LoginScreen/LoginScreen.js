import React, { useState, useContext } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './styles';
import { firebase } from '../../firebase/config';
import UserContext from '../../Contexts/UserContext';

export default function LoginScreen({navigation}) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userContext = useContext(UserContext);

  const onFooterLinkPress = () => {
    navigation.navigate('Registration');
  };

  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        const uid = res.user.uid;
        const usersRef = firebase.firestore().collection('users');
        usersRef
          .doc(uid)
          .get()
          .then(doc => {
            if (!doc.exists) return alert('User does not exist.');
            userContext.setUid(uid);
            navigation.navigate('Home');
          })
          .catch(error => alert(error));
      })
      .catch(error => alert(error));
  };

  return ( 
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='always'>
          {/* <Image
            style={styles.logo}
            source={require('../../../assets/icon.png')}
          /> */}
        <TextInput
          style={styles.input}
          placeholder='E-mail'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholderTextColor='#aaaaaa'
          secureTextEntry
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          value={password}
          autoCapitalize='none'
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onLoginPress()}
          >
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Don't have an account?
            <Text onPress={onFooterLinkPress} style={styles.footerLink}> Sign up</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}