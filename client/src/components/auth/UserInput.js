import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const UserInput = ({
  name,
  value,
  setValue,
  autoCapitalize = 'none',
  keyboardType = 'default',
  secureTextEntry = false,
}) => {
  const valueText = value ? String(value) : '';
  return (
    <View style={tw`mb-4`}>
      <Text style={{ fontSize: 17 }}>{name}</Text>
      <TextInput
        autoCorrect={false}
        // style={tw`w-64 p-2 border rounded mt-2 `}
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          height: 45,
          marginTop: 10,
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
        placeholder={name}
        onChangeText={(text) => setValue(text)}
        value={valueText}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

export default UserInput;
