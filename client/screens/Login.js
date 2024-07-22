import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { AuthContext } from "../contexts/Auth";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../mutations/user";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, { data, loading, error }] = useMutation(LOGIN);
  const authContext = useContext(AuthContext);
  console.log(authContext);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const image = {
    uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcolorkit.co%2Fgradient%2Ff9ce34-ee2a7b-6228d7%2F&psig=AOvVaw3DLWjAArnIUREiKazET4tU&ust=1719593423486000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNCQs-ye_IYDFQAAAAAdAAAAABAK",
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <ImageBackground source={image} resizeMode="cover"> */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Login</Text>
      </View>
      <View style={styles.container}>
        <TextInput label="Username" style={styles.input} mode="outlined" placeholder="Username" theme={{ colors: { primary: "gray", placeholder: "gray", background: "#fafafa" } }} value={username} onChangeText={setUsername} />
        <TextInput
          label="Password"
          style={styles.input}
          secureTextEntry={!showPassword}
          right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={togglePasswordVisibility} />}
          mode="outlined"
          placeholder="Password"
          theme={{
            colors: {
              primary: "gray",
              placeholder: "gray",
              background: "#fafafa",
            },
          }}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={async () => {
            const result = await login({
              variables: {
                userLogin: {
                  username,
                  password,
                },
              },
            });
            console.log(result.data.login.id, "user id login");
            await SecureStore.setItemAsync("access_token", result.data.login.access_token);
            await SecureStore.setItemAsync("id", result.data.login.id);
            authContext.setIsSignedIn(true);
            authContext.setUserId(result.data.login.id);
            console.log(authContext);
          }}
        >
          Log in
        </Button>
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <Button mode="text" labelStyle={styles.signupButton} onPress={() => navigation.navigate("Register")}>
          Sign up
        </Button>
      </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  header: {
    fontSize: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  button: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: "#0095f6",
    paddingVertical: 10,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  signupText: {
    color: "gray",
  },
  signupButton: {
    color: "#0095f6",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});
