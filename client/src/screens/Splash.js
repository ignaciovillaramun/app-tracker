import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();

  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fadeIn();

    setTimeout(() => {
      fadeOut().then(() => {
        navigation.navigate('SignIn');
      });
    }, 2000);
  }, []);

  // Define fadeOut function with a promise
  function fadeOut() {
    return new Promise((resolve) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        resolve();
      });
    });
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../assets/bus.png')}
          resizeMode="cover"
          style={styles.image}
        >
          <Image source={require('./../assets/logo.png')} style={styles.logo} />
          <Text style={styles.DriverMessage}>Welcome Driver</Text>
        </ImageBackground>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  fadingText: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  DriverMessage: {
    alignSelf: 'center',
    marginTop: 30,
    fontSize: 35,
  },
});

export default Splash;
