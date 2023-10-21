import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Text, StyleSheet } from 'react-native';
import FooterTabs from '../components/nav/FooterTabs';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function List() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.heading}>Choose a Vehicle</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.busSm, selectedOption === 'van' && styles.selectedOption]}
          onPress={() => handleOptionSelect('van')}
        >
          <Icon name="bus" color="#FEC007" size={60} style={styles.icon}></Icon>
          <Text>Van</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.busLg, selectedOption === 'bus' && styles.selectedOption]}
          onPress={() => handleOptionSelect('bus')}
        >
          <Icon name="bus-alt" color="#FEC007" size={60} style={styles.icon}></Icon>
          <Text>Bus</Text>
        </TouchableOpacity>
      </View>
      {selectedOption ? (
        <View style={styles.selectedButtonContainer}>
          <TouchableOpacity style={styles.selectedButton}>
            <Text>Select {selectedOption}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.holaContainer}>
          <TouchableOpacity style={styles.holaButton}>
            <Text style={styles.holaText}>Hola</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={tw`flex-1 justify-end`}>
        <FooterTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30,
  },
  heading: {
    marginTop: 60,
    fontSize: 30,
    alignSelf: 'center',
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  busSm: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  busLg: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  selectedOption: {
    backgroundColor: '#FEC007',
  },
  icon: {
    alignSelf: 'center',
  },
  selectedButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#FEC007',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  holaContainer: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  holaButton: {
    backgroundColor: '#FEC007',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  holaText: {
    alignSelf: 'center',
  },
});