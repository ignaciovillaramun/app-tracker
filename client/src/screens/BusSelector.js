import React from 'react';
import { View, TouchableOpacity, SafeAreaView, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FooterTabs from '../components/nav/FooterTabs';
import tw from 'twrnc';

export default function List() {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <Text style={styles.heading}>Choose a Vehicle</Text>
      <View style={styles.busSm}>
          <FontAwesome5 name="bus" size={25} color="black" />
      </View>
      <View style={styles.busLg}>
        
      </View>
      <View style={tw`flex-1 justify-end`}>
        <FooterTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop:60,
    fontSize:30,
    alignSelf: 'center'
  },
  busSm:{
    backgroundColor:"yellow",
    borderColor:'black',
    borderWidth: 1,
  },
  busLg:{
    backgroundColor:"yellow",
    borderColor:'black',
    borderWidth: 1,
  }
})
