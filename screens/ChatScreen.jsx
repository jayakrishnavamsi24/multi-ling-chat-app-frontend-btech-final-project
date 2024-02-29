import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  Keyboard
} from "react-native";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";

import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { useSelector } from "react-redux";
import axios from 'axios';

const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const scrollViewRef = useRef(null);
  // const [translatedText, setTranslatedText] = useState(null);
  // const [isTranslationVisible, setIsTranslationVisible] = useState(false); 

  const updateMessages = (newMessages, indexToTranslate) => { // Add indexToTranslate
    setMessages(newMessages.map((msg, i) => {
        if (i === indexToTranslate) {
            return {
                ...msg,
                isTranslated: !msg.isTranslated, // Mark the translated message
                translatedText: newMessages[i].translatedText // Set the translation
            };
        } else {
            return msg; // Keep other messages as they are
        }
    }));
  };


  const user = useSelector((state) => state.user.user);
  const languageCode = useSelector((state) => state.user.user.languageCode);  // Retrieve from Redux

  const textInputRef = useRef(null);

  const handleTranslate = async (index) => {
    try {
        const targetLanguage = languageCode; // Your target language

        let updatedMessages = [...messages]; // Create a copy
        console.log(targetLanguage);
        console.log(updatedMessages[index].message);

        const response = await axios.post('https://multi-ling-chat-app-btech-final-project.onrender.com/translate', {
          text: updatedMessages[index].message,
          targetLanguage,
        });
        // console.log(response);
        if (!response.data || !response.data.translation) {
          throw new Error('Translation request failed');
        }
        // console.log(response.data.translation);
        // console.log(!updatedMessages[index].isTranslated);
        updatedMessages[index].translatedText = response.data.translation;
        // updatedMessages[index].isTranslated = !updatedMessages[index].isTranslated;
        // console.log(updatedMessages[index].translatedText);
        // console.log(updatedMessages[index].isTranslated);
        // console.log(updatedMessages[index]);
        // console.log(updatedMessages);
        updateMessages(updatedMessages, index);
    } catch (error) {
        console.error("Translation Error:", error); 
        // Handle error gracefully (display an error message, etc.)
        console.error("Error details:", error.response);
    }
  };



  const handleKeyboardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim(); 
    if (trimmedMessage.length === 0) return;

    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: trimmedMessage,
      user: user,
    };
    setMessage("");
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {
        setTimeout(() => {
          if (scrollViewRef.current) { 
            scrollViewRef.current.scrollToEnd({ animated: true }); 
          }
        }, 1000);
      })
      .catch((err) => alert(err));
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);

      // console.log("Snapshot update received"); // Check if onSnapshot triggers
  
      // if (scrollViewRef.current) {
      //   console.log("Scrolling within onSnapshot...");
      //   scrollViewRef.current.scrollToEnd({ animated: true });
      // } 
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        // Scroll to the end when the keyboard is dismissed
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      keyboardDidHideListener.remove();
    };
  }, [scrollViewRef]);

  useEffect(() => {
    const scrollAfterLoad = () => { 
      if (scrollViewRef.current) {
         scrollViewRef.current.scrollToEnd({ animated: true }); 
      }
    };
  
    if (!isLoading) {
      setTimeout(scrollAfterLoad, 1000); // Delay for a second
    }
  }, [isLoading]); 
  
  return (
    <View className="flex-1">
      <View className="w-full bg-primary px-4 py-6 flex-[0.25]">
        <View className="flex-row items-center justify-between w-full px-4 py-1">
          {/* go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>
          {/* middle */}

          <View className="flex-row items-center justify-center space-x-3">
            <View className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>
            <View>
              <Text className="text-gray-50 text-base font-semibold capitalize ">
                {room.chatName.length > 16
                  ? `${room.chatName.slice(0, 16)}..`
                  : room.chatName}{" "}
              </Text>
              <Text className="text-gray-100 text-sm font-semibold capitalize">
                online
              </Text>
            </View>
          </View>

          {/* last section */}
          <View className="flex-row items-center justify-center space-x-3">
            <TouchableOpacity>
              <FontAwesome5 name="video" size={24} color="#fbfbfb" />
            </TouchableOpacity>

            <TouchableOpacity>
              <FontAwesome name="phone" size={24} color="#fbfbfb" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={24} color="#fbfbfb" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* bottom section */}
      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
              {isLoading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#43C651"} />
                  </View>
                </>
              ) : (
                <>
                  {messages?.map((msg, i) =>
                    msg.user.providerData.email === user.providerData.email ? (
                      <View key={i} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={{width: 200}} className="m-1">
                          <View
                            style={{alignSelf: "flex-end" }}
                            className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-primary w-auto  relative"
                          >
                            <Text className="text-base font-semibold text-white">
                              {msg.message}
                            </Text>
                          </View>
                          <View style={{ alignSelf: "flex-end" }}>
                            {msg?.timeStamp?.seconds && (
                              <Text className="text-[12px] text-black font-semibold">
                                {new Date(
                                  parseInt(msg?.timeStamp?.seconds) * 1000
                                ).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View
                        key={i}
                        style={{ alignSelf: "flex-start" }}
                        className="flex items-center justify-start space-x-2"
                      >
                        <View className="flex-row items-center justify-center space-x-2">
                          {/* image */}
                          <Image
                            className="w-12 h-12 rounded-full"
                            resizeMode="cover"
                            source={{ uri: msg?.user?.profilePic }}
                          />
                          {/* text */}
                          <View className="m-1">
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black', textDecorationLine: 'underline', marginBottom: 5, fontStyle: 'italic' }}>
                              {msg?.user?.fullName}
                            </Text>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center',width: 200}}>
                              <View className="px-4 py-2 mr-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-gray-200 w-auto  relative">
                                <Text className="text-base font-semibold text-black">
                                  {msg.isTranslated ? msg.translatedText : msg.message}
                                </Text>
                              </View>
                              <TouchableOpacity onPress={() => handleTranslate(i)} style={{backgroundColor: '#c3edf7', borderRadius: 20, padding: 6}}>
                                <MaterialIcons name="translate" size={22} color={"#000000"} />
                              </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: "flex-start" }}>
                              {msg?.timeStamp?.seconds && (
                                <Text className="text-[12px] text-black font-semibold">
                                  {new Date(
                                    parseInt(msg?.timeStamp?.seconds) * 1000
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </>
              )}
            </ScrollView>

            <View className="w-full flex-row items-center justify-center px-8">
              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-center">
                <TouchableOpacity onPress={handleKeyboardOpen}>
                  <Entypo name="emoji-happy" size={24} color="#555" />
                </TouchableOpacity>

                <TextInput
                  className="flex-1 h-8 text-base text-primaryText font-semibold"
                  placeholder="Type here..."
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />

                <TouchableOpacity>
                  <Entypo name="mic" size={24} color="#43C651" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="pl-4" onPress={sendMessage}>
                <FontAwesome name="send" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
