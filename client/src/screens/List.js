import React from 'react';
import { View, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import FooterTabs from '../components/nav/FooterTabs';
import tw from 'twrnc';

export default function List() {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <Text>List</Text>
      <View style={tw`flex-1 justify-end`}>
        <FooterTabs />
      </View>
    </SafeAreaView>
  );
}
