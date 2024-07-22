import { StyleSheet, Text, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { AuthContext } from "../contexts/Auth";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";

export default function HeaderRight() {
  const authContext = useContext(AuthContext);
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    authContext.setIsSignedIn(false);
  };
  return (
    <>
      <AntDesign style={styles.icon} name="hearto" size={20} color="white" />
      <Ionicons style={styles.icon} name="chatbubble-outline" size={20} color="white" />
      <MaterialIcons onPress={() => handleLogout()} style={styles.iconLogout} name="logout" size={20} color="red" />
    </>
  );
}
const styles = StyleSheet.create({
  icon: {
    marginRight: 15,
  },
  iconLogout: {
    marginRight: 0,
  },
});
