import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-elements';
import tw from 'twrnc';

const Tab = ({ name, icon, handlePress, screenName, routeName }) => {
  const activeScreenColor = screenName === routeName && 'orange';

  return (
    <TouchableOpacity style={tw`flex items-center`} onPress={handlePress}>
      <FontAwesome5 name={icon} size={25} color={activeScreenColor} />
      <Text style={tw`text-sm text-gray-600`}>{name}</Text>
    </TouchableOpacity>
  );
};

export default function FooterTabs() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <>
      <Divider width={1} />
      <View style={tw`flex-row justify-between pt-5 px-9`}>
        <Tab
          name="Bus"
          icon="bus"
          handlePress={() => navigation.navigate('BusSelector')}
          screenName="Bus Selector"
          routeName={route.name}
        />
        <Tab
          name="Home"
          icon="clipboard-list"
          handlePress={() => navigation.navigate('Home')}
          screenName="Home"
          routeName={route.name}
        />
        <Tab
          name="Notification"
          icon="bell"
          handlePress={() => navigation.navigate('Notification')}
          screenName="Notification"
          routeName={route.name}
        />
        <Tab
          name="Profile"
          icon="user-circle"
          handlePress={() => navigation.navigate('Profile')}
          screenName="Profile"
          routeName={route.name}
        />
      </View>
    </>
  );
}
