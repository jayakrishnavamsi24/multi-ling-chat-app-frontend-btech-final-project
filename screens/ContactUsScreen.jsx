import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";

const ContactUsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{paddingTop: 40}} className="flex-1 items-center justify-start">
      {/* icons */}
      <View className="w-full flex-row items-center justify-between px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color={"#555"} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={{fontWeight: 'bold', fontSize: 30, textAlign: 'center'}}>Contact Us </Text>
        <Text className="mt-5 px-5 text-[18px] text-center">
          Phone(IN): +919849022338
        </Text>
        <Text className="mt-5 px-5 text-[18px] text-center">
          Email: support@multilingualchat.com
        </Text>
        <Text className="mt-5 text-center text-[30px]">***</Text>
      </View>
    </SafeAreaView>
  );
};

export default ContactUsScreen;
