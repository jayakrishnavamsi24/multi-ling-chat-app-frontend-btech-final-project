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
import { useDispatch, useSelector } from "react-redux";
import { updateDoc, doc } from 'firebase/firestore'; 
import { firebaseAuth , firestoreDB } from "../config/firebase.config";
import { SET_USER_NULL, updateUserLanguageCode } from "../context/actions/userActions";
import { Picker } from '@react-native-picker/picker';
import { Alert } from "react-native";


const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const languageCode = useSelector((state) => state.user.user.languageCode);  // Retrieve from Redux
  const [selectedLanguage, setSelectedLanguage] = useState(languageCode); // Initial language
  const user = useSelector((state) => state.user.user);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: 'हिन्दी', value: 'hi' }, // Hindi
    { label: 'বাংলা', value: 'bn' }, // Bengali
    { label: 'தமிழ்', value: 'ta' }, // Tamil
    { label: 'తెలుగు', value: 'te' }, // Telugu
    { label: 'ગુજરાતી', value: 'gu' }, // Gujarati
    { label: 'ಕನ್ನಡ', value: 'kn' }, // Kannada
    { label: 'മലയാളം', value: 'ml' }, // Malayalam
    { label: 'ਪੰਜਾਬੀ', value: 'pa' }, // Punjabi
    { label: 'اردو', value: 'ur' }, // Urdu
    { label: '日本語', value: 'ja' }, // Japanese
    { label: '中文', value: 'zh' }, // Chinese
    { label: '한국어', value: 'ko' }, // Korean
    { label: 'Deutsch', value: 'de' }, // German
    { label: 'Italiano', value: 'it' }, // Italian
    { label: 'Português', value: 'pt' }, // Portuguese
    { label: 'Русский', value: 'ru' }, // Russian
  ];

  const handleUpdateLanguage = async () => {
    try {
        const userDocRef = doc(firestoreDB, "users", user._id); 
        // console.log(userDocRef);
        await updateDoc(userDocRef, { languageCode: selectedLanguage }); 

        dispatch(updateUserLanguageCode(selectedLanguage)); 
        Alert.alert("Update Successful", "Language has been updated successfully!");

    } catch (error) {
        console.error("Language update error:", error);

        Alert.alert("Update Failed", "An error occurred while updating the language. Please try again later.");
    }
  };

  const handleLogout = async () => {
    await firebaseAuth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace("LoginScreen");
    });
  };

  return (
    <View className="flex-1">
      <SafeAreaView style={{paddingTop: 40}} className="flex-1 items-center justify-start">
        {/* icons */}
        <View className="w-full flex-row items-center justify-between px-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#555"} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Entypo name="dots-three-vertical" size={24} color="#555" />
          </TouchableOpacity>
        </View>
        {/* profile */}
        <View className="items-center justify-center">
          <View className="relative border-2 border-primary p-1 rounded-full">
            <Image
              source={{ uri: user?.profilePic }}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>

          <Text className="text-xl font-semibold text-primaryBold pt-3">
            {user?.fullName}
          </Text>
          <Text className="text-base font-semibold text-primaryText">
            {user?.providerData.email}
          </Text>
        </View>


        <View className="w-full pl-4 mt-5 mb-5 flex justify-center">
          <Text className="ml-3 text-base text-primaryText">
            Translation Language
          </Text>
          <Picker
              selectedValue={selectedLanguage}
              style={{ borderWidth: 1, borderColor: 'black', width: 350 }}
              onValueChange={(value) => setSelectedLanguage(value)}
          >
              {languages.map((language) => (
                  <Picker.Item key={language.value} label={language.label} value={language.value} />
              ))}
          </Picker>
          <TouchableOpacity
              onPress={handleUpdateLanguage}
              className="px-4 py-2 rounded-xl bg-primary my-3 mx-5 flex items-center justify-center"
            >
              <Text className="py-1 text-white text-sm font-semibold">
                Update
              </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("AboutScreen")} className="w-full px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="info" size={24} color={"#555"} />
            <Text className="text-base font-semibold text-primaryText px-3">
              About
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={32} color={"#555"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ContactUsScreen")} className="w-full px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="contact-page" size={24} color={"#555"} />
            <Text className="text-base font-semibold text-primaryText px-3">
              Contact Us
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={32} color={"#555"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="w-full px-6 py-4 flex-row items-center justify-center"
        >
          <Text className="text-lg font-semibold text-primaryBold px-3">
            Logout
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View>
        <Text style={{textAlign: 'center', paddingVertical: 3, backgroundColor: '#42fcb2' }}>©️2024 by Multi Lingual Chat 😉</Text>
      </View>
  </View>
  );
};

export default ProfileScreen
