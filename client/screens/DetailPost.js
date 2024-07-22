import React, { useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { Avatar, IconButton } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

import { GET_POST } from "../queries/post";
import { ADD_COMMENT } from "../mutations/post";
import { ADD_LIKE } from "../mutations/post";

export default function DetailScreen({ route, navigation }) {
  const { postId } = route.params;
  console.log(postId, "id");
  const [newComment, setNewComment] = useState("");

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id: postId },
  });
  const [createComment, { loading: loadingComment, error: errorComment, data: dataComment }] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST],
    onCompleted: () => {
      setNewComment("");
      navigation.navigate("DetailPost", { postId });
    },
  });

  const [createLike, { loading: loadingLike, error: errorLike, data: dataLike }] = useMutation(ADD_LIKE, {
    refetchQueries: [GET_POST],
    onCompleted: () => {
      navigation.navigate("DetailPost", { postId });
    },
  });

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (error)
    return (
      <View style={styles.errorContainer}>
        <Text>Something went wrong!</Text>
      </View>
    );

  const { findPostById } = data;

  const handleAddComment = async () => {
    const data = await createComment({
      variables: {
        newComment: {
          content: newComment,
          postId: postId,
        },
      },
    });
    console.log(data);
    // Clear comment input
    // setNewComment("");
  };

  const handleAddLike = async () => {
    const data = await createLike({
      variables: {
        newLike: {
          postId,
        },
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 64 : 0} // Adjust offset if necessary
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.postHeader}>
          <Avatar.Image size={40} source={{ uri: findPostById.author.avatarUrl }} />
          <Text style={styles.username}>{findPostById.author.username}</Text>
        </View>
        <Image style={styles.postImage} source={{ uri: findPostById.imgUrl }} />
        <Text style={styles.postContent}>{findPostById.content}</Text>
        <Text style={styles.postTags}>
          {findPostById.tags.map((tag, index) => (
            <Text style={styles.tag} key={index}>
              #{tag}{" "}
            </Text>
          ))}
        </Text>
        <View style={styles.likeSection}>
          <Pressable onPress={handleAddLike}>
            <AntDesign style={{ marginRight: 5 }} name="hearto" size={20} color="red" />
          </Pressable>
          <Text style={{ color: "white", marginRight: 10 }}>{findPostById.likes.length}</Text>
        </View>
        <View style={styles.commentsHeader}>
          <Text style={{ color: "white", fontWeight: "bold", marginBottom: 5 }}>Comments:</Text>
          {findPostById.comments.length === 0 ? (
            <Text style={styles.likes}>No comments yet</Text>
          ) : (
            <FlatList
              data={findPostById.comments}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Text style={styles.commentAuthor}>{item.username}</Text>
                  <Text style={styles.commentContent}>{item.content}</Text>
                </View>
              )}
            />
          )}
        </View>
        <View style={styles.addCommentContainer}>
          <TextInput style={styles.commentInput} placeholder="Add a comment..." placeholderTextColor="#888" value={newComment} onChangeText={setNewComment} onSubmitEditing={handleAddComment} />
          <IconButton
            icon="send"
            color="#1e90ff"
            size={25}
            onPress={handleAddComment}
            disabled={!newComment} // Disable button if comment is empty
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  username: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "white",
  },
  postImage: {
    width: "100%",
    height: 400,
    marginBottom: 10,
  },
  postContent: {
    color: "white",
    marginBottom: 10,
  },
  postTags: {
    color: "white",
    marginBottom: 10,
  },
  tag: {
    color: "#1e90ff",
  },
  likeSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  commentsHeader: {
    marginBottom: 10,
  },
  comment: {
    backgroundColor: "#1f1f1f",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentAuthor: {
    color: "#1e90ff",
    fontWeight: "bold",
  },
  commentContent: {
    color: "white",
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    color: "white",
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
