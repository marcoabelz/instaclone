import * as React from "react";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../mutations/user";

export default function Register({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [createUser, { data, loading, error }] = useMutation(REGISTER);

  const handleRegister = async () => {
    try {
      const { data } = await createUser({
        variables: {
          newUser: {
            email,
            name,
            password,
            username,
          },
        },
      });
      // console.log(data);
      if (data) console.log("New user has been registered", data);
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // console.log(email);

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Register</Text>
      </View>
      <View style={styles.container}>
        <TextInput label="Email" style={styles.input} mode="outlined" placeholder="Email" theme={{ colors: { primary: "gray", placeholder: "gray", background: "#fafafa" } }} value={email} onChangeText={setEmail} />
        <TextInput label="Username" style={styles.input} mode="outlined" placeholder="Username" theme={{ colors: { primary: "gray", placeholder: "gray", background: "#fafafa" } }} value={username} onChangeText={setUsername} />
        <TextInput label="Name" style={styles.input} mode="outlined" placeholder="Name" theme={{ colors: { primary: "gray", placeholder: "gray", background: "#fafafa" } }} value={name} onChangeText={setName} />
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
        <Button onPress={handleRegister} mode="contained" style={styles.button}>
          Sign Up
        </Button>
      </View>
    </View>
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
    // fontFamily: "billabong",
  },
  container: {
    flex: 1,
    paddingBottom: 70,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0095f6",
    paddingVertical: 10,
  },
});

// import * as React from "react";
// import { useState } from "react";
// import { View, StyleSheet } from "react-native";
// import { Text, TextInput, Button } from "react-native-paper";

// export default function Register() {
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };
//   return (
//     <>
//       <View>
//         <Text style={styles.header}>Instagram</Text>
//       </View>
//       <View style={styles.container}>
//         {/* <View style={{ backgroundColor: "#171612", padding: 20 }}> */}
//         <Text style={styles.title}>Register</Text>
//         <TextInput label="Email" style={styles.input} textColor="white" mode="outlined" placeholder="Email" theme={{ colors: { primary: "white", placeholder: "white", background: "#171612" } }} />
//         <TextInput label="Username" style={styles.input} textColor="white" mode="outlined" placeholder="Username" theme={{ colors: { primary: "white", placeholder: "white", background: "#171612" } }} />
//         <TextInput label="Name" style={styles.input} textColor="white" mode="outlined" placeholder="Name" theme={{ colors: { primary: "white", placeholder: "white", background: "#171612" } }} />
//         <TextInput
//           label="Password"
//           style={styles.input}
//           textColor="white"
//           secureTextEntry={!showPassword}
//           right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={togglePasswordVisibility} />}
//           mode="outlined"
//           placeholder="Password"
//           theme={{
//             colors: {
//               text: "white",
//               primary: "white",
//               placeholder: "white",
//               background: "#171612",
//             },
//           }}
//         />
//         <Button mode="contained" style={styles.button}>
//           Sign Up
//         </Button>
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     textAlign: "center",
//     fontSize: 30,
//     backgroundColor: "#171612",
//     color: "white",
//     padding: 10,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#171612",
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     textAlign: "center",
//     fontSize: 20,
//     color: "white",
//     marginBottom: 40,
//   },
//   input: {
//     marginBottom: 20,
//   },
//   button: {
//     marginTop: 20,
//     marginBottom: 50,
//     backgroundColor: "#0095f6",
//   },
// });
