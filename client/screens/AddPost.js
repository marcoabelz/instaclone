import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native";

import { useMutation } from "@apollo/client";
import { POST } from "../mutations/post";
import { GET_POSTS } from "../queries/post";

export default function AddPost({ navigation }) {
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tags, setTags] = useState("");

  const [createPost, { data, loading, error }] = useMutation(POST, {
    refetchQueries: [GET_POSTS],
    onError(error) {
      console.log("Error creating post!", error);
    },
  });

  const handleSubmit = async () => {
    try {
      const arrTags = tags.split(",");
      const { data } = await createPost({
        variables: {
          newPost: {
            content,
            imgUrl,
            tags: arrTags,
          },
        },
      });
      if (data) console.log("New post has been posted", data);
      navigation.navigate("Homepage");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Post</Text>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Content" placeholderTextColor="#999" value={content} onChangeText={setContent} />
        <TextInput style={styles.input} placeholder="Image URL" placeholderTextColor="#999" value={imgUrl} onChangeText={setImgUrl} />
        <TextInput style={styles.input} placeholder="Tags (comma separated)" placeholderTextColor="#999" value={tags} onChangeText={setTags} />
        <View style={styles.buttonContainer}>
          <Button title="Post" onPress={handleSubmit} color="#1e90ff" />
        </View>
      </View>
      <View style={styles.footer}>
        <Pressable onPress={() => navigation.navigate("Homepage")}>
          <Text style={styles.footerText}>Back to Home</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    backgroundColor: "#1e90ff",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#1f1f1f",
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  footer: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    alignItems: "center",
  },
  footerText: {
    color: "white",
    fontSize: 16,
  },
});
