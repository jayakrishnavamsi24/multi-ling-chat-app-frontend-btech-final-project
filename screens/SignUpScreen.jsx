import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { BGImage, Logo } from "../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { avatars } from "../utils/supports";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Initial language
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const navigation = useNavigation();

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
  
  const handleAvatar = (item) => {
    setAvatar(item?.image.asset.url);
    setIsAvatarMenu(false);
  };

  const handleSignUp = async () => {
    console.log("Name:", name);
  console.log("Email:", email);
  console.log("Password:", password); 
    if (getEmailValidationStatus && email !== "") {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred?.user.uid,
            fullName: name,
            profilePic: avatar,
            providerData: userCred.user.providerData[0],
            languageCode: selectedLanguage
          };

          setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(
            () => {
              navigation.navigate("LoginScreen");
            }
          );
        }
      );
    }
    // try {
    //   await AsyncStorage.setItem('userLanguage', selectedLanguage); 
    // } catch (error) {
    //   console.error("Error saving language:", error);
    // }
  };

  // useEffect(() => {
  //   const loadLanguagePreference = async () => {
  //     try {
  //       const storedLanguage = await AsyncStorage.getItem('userLanguage');
  //       if (storedLanguage) {
  //         setSelectedLanguage(storedLanguage);
  //       }
  //     } catch (error) {
  //       console.error("Error loading language:", error);
  //     }
  //   };
  
  //   loadLanguagePreference();
  // }, []);

  return (
    <View className="flex-1 items-center justify-start">
      <Image
        source={BGImage}
        resizeMode="cover"
        className="h-96"
        style={{ width: screenWidth }}
      />

      {isAvatarMenu && (
        <>
          {/* list of avatars sections */}
          <View
            className="absolute  inset-0 z-10 "
            style={{ width: screenWidth, height: screenHeight }}
          >
            <ScrollView>
              <BlurView
                className="w-full h-full px-4 py-16 flex-row flex-wrap items-center justify-evenly"
                tint="light"
                intensity={100}
                style={{ width: screenWidth, height: screenHeight }}
              >
                {avatars?.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleAvatar(item)}
                    key={item._id}
                    className="w-20 m-3 h-20 p-1 rounded-full border-2 border-primary relative"
                  >
                    <Image
                      source={{ uri: item?.image.asset.url }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </BlurView>
            </ScrollView>
          </View>
        </>
      )}

      {/* Main View */}
      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-80 flex items-center justify-start py-6 px-6 space-y-6">
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />

        <Text className="py-2 text-primaryText text-xl font-semibold">
          Join with us!
        </Text>

        {/* avatar section */}
        <View className="w-full flex items-center justify-center relative -my-4">
          <TouchableOpacity
            onPress={() => setIsAvatarMenu(true)}
            className="w-20 h-20 p-1 rounded-full border-2 border-primary relative"
          >
            <Image
              source={{ uri: avatar }}
              className="w-full h-full"
              resizeMode="contain"
            />
            <View className="w-6 h-6 bg-primary rounded-full absolute top-0 right-0 flex items-center justify-center">
              <MaterialIcons name="edit" size={18} color={"#fff"} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="w-full flex items-center justify-center">

          {/* full name */}
          <UserTextInput
            placeholder="Full Name"
            isPass={false}
            setStatValue={setName}
          />

          {/* email */}
          <UserTextInput
            placeholder="Email"
            isPass={false}
            setStatValue={setEmail}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />

          {/* password */}

          <UserTextInput
            placeholder="Password"
            isPass={true}
            setStatValue={setPassword}
          />

          <View className="w-full flex justify-center">
              <Text className="ml-3 text-base text-primaryText">
                Select your Translation Language
              </Text>
              <Picker
                  selectedValue={selectedLanguage}
                  style={{ width: 330 }} // Adjust width as needed
                  onValueChange={(value) => setSelectedLanguage(value)}
              >
                  {languages.map((language) => (
                      <Picker.Item key={language.value} label={language.label} value={language.value} />
                  ))}
              </Picker>
          </View>

          {/* Signup button */}

          <TouchableOpacity
            onPress={handleSignUp}
            className="w-full px-4 py-2 rounded-xl bg-primary my-3 flex items-center justify-center"
          >
            <Text className="py-2 text-white text-xl font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>

          <View className="w-full py-2 flex-row items-center justify-center space-x-2">
            <Text className="text-base text-primaryText">
              Have an account !
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text className="text-base font-semibold text-primaryBold">
                Login Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;