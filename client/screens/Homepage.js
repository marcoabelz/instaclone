import * as React from "react";
import { StyleSheet, Text, View, Image, FlatList, Pressable, ActivityIndicator } from "react-native";
import { Avatar } from "react-native-paper";
import { AuthContext } from "../contexts/Auth";
import { useContext } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { GET_POSTS } from "../queries/post";
import { ADD_LIKE } from "../mutations/post";

import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

import { showMessage } from "react-native-flash-message";

export default function HomeScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  console.log(authContext);
  const { loading, error, data } = useQuery(GET_POSTS);

  const [createLike, { loading: loadingLike, error: errorLike, data: dataLike }] = useMutation(ADD_LIKE, {
    refetchQueries: [GET_POSTS],
    onCompleted: () => {
      navigation.navigate("Homepage");
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

  async function handleLike(id) {
    const data = await createLike({
      variables: {
        newLike: {
          postId: id,
        },
      },
    });
  }

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Avatar.Image size={40} source={{ uri: "https://ih1.redbubble.net/image.5278993626.5169/fposter,small,wall_texture,product,750x1000.u1.jpg" }} />
        <Text style={styles.username}>{item.author.username}</Text>
      </View>
      <Pressable onPress={() => navigation.navigate("DetailPost", { postId: item._id })}>
        <Image style={styles.postImage} source={{ uri: item.imgUrl }} />
      </Pressable>
      <View style={styles.postActions}>
        <Pressable
          onPress={() => {
            handleLike(item._id);
          }}
        >
          <AntDesign style={{ marginRight: 5 }} name="hearto" size={20} color="red" />
        </Pressable>
        <Text style={{ color: "white", marginRight: 10 }}>{item.likes.length}</Text>
        <Pressable onPress={() => navigation.navigate("DetailPost", { postId: item._id })}>
          <Ionicons style={{ marginRight: 5 }} name="chatbubble-outline" size={20} color="white" />
        </Pressable>
        <Text style={{ color: "white", marginRight: 10 }}>{item.comments.length}</Text>

        <Pressable
          onPress={() => {
            console.log("share");
          }}
        >
          <Feather name="send" size={20} color="white" />
        </Pressable>
      </View>
      <Text style={styles.postCaption}>
        <Text style={styles.username}>{item.author.username}</Text> {item.content}
      </Text>
      <Text style={styles.postCaption}>
        {item.tags.map((tag, index) => (
          <Text style={styles.username}>#{tag} </Text>
        ))}
      </Text>
    </View>
  );

  return (
    <>
      {/* <View style={styles.addPost}>
        <Text>Story</Text>
      </View> */}
      <View style={styles.container}>
        {/* Feed */}
        <FlatList data={data.posts} renderItem={renderItem} keyExtractor={(item) => item.id} style={styles.feed} />

        {/* Bottom Tab Navigation */}
        <View style={styles.bottomTab}>
          <Pressable
            onPress={() => {
              navigation.navigate("Homepage");
            }}
          >
            <MaterialCommunityIcons name="home-outline" size={24} color="white" />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("Search");
            }}
          >
            <Octicons name="search" size={24} color="white" />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("AddPost");
            }}
          >
            <MaterialCommunityIcons name="plus-box-outline" size={24} color="white" />
          </Pressable>
          <Pressable
            onPress={() => {
              showMessage({
                message: "Coming Soon!",
                description: "We'll update soon!",
                type: "warning",

                duration: 3000,
              });
              navigation.navigate("Homepage");
            }}
          >
            <Octicons name="video" size={24} color="white" />
          </Pressable>
          <Pressable
            onPress={() => {
              showMessage({
                message: "Coming Soon!",
                description: "For this time, you can see user profile from search feature, thank you!",
                type: "warning",

                duration: 3000,
              });
              navigation.navigate("Search");
            }}
          >
            <FontAwesome6 name="circle-user" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  addPost: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  container: {
    flex: 20,
    backgroundColor: "#121212",
  },
  appbar: {
    backgroundColor: "blue",
  },
  logoContainer: {
    backgroundColor: "red",
    width: 30,
    flex: 1,
  },
  logoText: {
    fontSize: 20,
    justifyContent: "center",
    color: "white",
  },
  feed: {
    flex: 1,
  },
  post: {
    marginVertical: 10,
    backgroundColor: "#1f1f1f",
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  username: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "white",
  },
  postImage: {
    width: "100%",
    height: 400,
  },
  postActions: {
    marginTop: 10,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  postCaption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "white",
  },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#333333",
    backgroundColor: "#1f1f1f",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "red",
    padding: 10,
  },
});
