import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import Register from "../screens/Register";
import Login from "../screens/Login";
import Homepage from "../screens/Homepage";
import AddPost from "../screens/AddPost";
import DetailPost from "../screens/DetailPost";
import UserProfile from "../screens/UserProfile";
import Search from "../screens/Search";

//stack
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/Auth";
import * as SecureStore from "expo-secure-store";

import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";

import FlashMessage from "react-native-flash-message";

//tab
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function MainStack() {
  const authContext = useContext(AuthContext);
  useEffect(() => {
    async function check(params) {
      const result = await SecureStore.getItemAsync("access_token");
      console.log(result, "token");
      if (result) {
        authContext.setIsSignedIn(true);
      }
    }
    check();
  }, []);
  console.log(authContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authContext.isSignedIn ? (
          <>
            <Stack.Screen
              name="Homepage"
              component={Homepage}
              options={{
                headerStyle: {
                  backgroundColor: "black",
                },
                headerLeft: () => {
                  return <HeaderLeft />;
                },
                headerRight: () => {
                  return <HeaderRight />;
                },
                title: "",
              }}
            />
            <Stack.Screen
              name="AddPost"
              component={AddPost}
              options={{
                headerStyle: {
                  backgroundColor: "black",
                },
                headerLeft: () => {
                  return <HeaderLeft />;
                },
                headerRight: () => {
                  return <HeaderRight />;
                },
                title: "",
              }}
            />
            <Stack.Screen
              name="DetailPost"
              component={DetailPost}
              options={{
                title: "Posts",
                headerStyle: {
                  backgroundColor: "black",
                },
                headerTintColor: "white", // Mengubah warna font header menjadi putih
              }}
            />
            <Stack.Screen
              name="Search"
              component={Search}
              options={{
                title: "Search",
                headerStyle: {
                  backgroundColor: "black",
                },
                headerTintColor: "white", // Mengubah warna font header menjadi putih
              }}
            />
            <Stack.Screen
              name="UserProfile"
              component={UserProfile}
              options={{
                title: "User Profile",
                headerStyle: {
                  backgroundColor: "black",
                },
                headerTintColor: "white", // Mengubah warna font header menjadi putih
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                title: "",
                headerStyle: {
                  backgroundColor: "black",
                },
                headerLeft: () => {
                  return <HeaderLeft />;
                },
              }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                headerStyle: {
                  backgroundColor: "black",
                },
                title: "",
                headerLeft: () => {
                  return <HeaderLeft />;
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
      <FlashMessage position="center" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
