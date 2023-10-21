import tw from 'twrnc';
import React from 'react';
import { View, Image, Text } from 'react-native';

const Logo = ({ children }) => {
  return (
    <View style={tw`flex justify-center items-center`}>
      {children ? (
        children
      ) : (
        <Image
          source={require('../../assets/shuttle.png')}
          style={tw`w-55 h-55 rounded-full my-10  bg-yellow-500`}
        />
      )}
    </View>
  );
};

export default Logo;
