import React from "react";
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from "react-native";

import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../queries/user";
import { GET_POST_PER_USER } from "../queries/post";

export default function UserProfile({ route, navigation }) {
  const { userId } = route.params;
  console.log(userId, "userid");

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  const {
    loading: perPostLoading,
    error: perPostError,
    data: perPostData,
  } = useQuery(GET_POST_PER_USER, {
    variables: { userId: userId },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong!</Text>
      </View>
    );
  }

  //handle when data is loading
  if (!data || !data.findUserById) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }
  if (!perPostData || !perPostData.postPerUser) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Loading ...</Text>
      </View>
    );
  }

  console.log(perPostData, "post dat");
  const user = data.findUserById;
  // console.log(user);

  const renderItem = ({ item }) => (
    <Image
      style={styles.postImage}
      source={{
        uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.washingtonpost.com%2Fhome%2F2024%2F03%2F12%2Fcats-behavior-misunderstood%2F&psig=AOvVaw38colKZ6ibPTJZh5RMQCBa&ust=1719819787505000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOiwrZLqgocDFQAAAAAdAAAAABAE",
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.avatar} source={{ uri: user.avatarUrl || "https://ih1.redbubble.net/image.5278993626.5169/fposter,small,wall_texture,product,750x1000.u1.jpg" }} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.fullName}>{user.name}</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statCount}>{perPostData.postPerUser.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statCount}>{user.follower.length}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statCount}>{user.following.length}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
      </View>
      <FlatList data={user.posts} renderItem={renderItem} keyExtractor={(item) => item._id} numColumns={3} style={styles.postsGrid} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  header: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  fullName: {
    color: "#888",
    marginBottom: 10,
  },
  stats: {
    flexDirection: "row",
  },
  stat: {
    alignItems: "center",
    marginRight: 50,
  },
  statCount: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#888",
  },
  postsGrid: {
    marginTop: 10,
  },
  postImage: {
    width: "33.33%",
    height: 120,
    margin: 1,
  },
});
