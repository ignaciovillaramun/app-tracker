import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const SubmitButton = ({ title, handleSubmit, loading }) => {
  return (
    <TouchableOpacity
      style={tw`bg-blue-500 p-3 rounded-full mt-10`}
      onPress={handleSubmit}
    >
      <Text style={tw`text-white text-center text-base`}>
        {loading ? 'Please wait...' : title}
      </Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;
