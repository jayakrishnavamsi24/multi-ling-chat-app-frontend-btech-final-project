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

const AboutScreen = () => {
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
        <Text style={{fontWeight: 'bold', fontSize: 30, textAlign: 'center'}}>About</Text>
        <Text className="mt-5 px-5 text-[18px] text-center">
        Embark on a revolutionary communication journey with Multi Lingual Chat, where our mission is to transform conversations into a global experience. Our app is designed to seamlessly connect individuals across languages, fostering an inclusive environment where diverse conversations thrive. Break language barriers effortlessly and engage in meaningful dialogues with friends and family from around the world.
        </Text>
        <Text className="mt-5 text-center text-[30px]">***</Text>
      </View>
    </SafeAreaView>
  );
};

export default AboutScreen;
