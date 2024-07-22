import React, { useState } from "react";
import { View, Text, TextInput, FlatList, Image, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { showMessage } from "react-native-flash-message";

import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_BY_USERNAME, GET_USERS } from "../queries/user"; // Pastikan path ini sesuai dengan lokasi file queries
import { FOLLOW } from "../mutations/follow";

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const { loading, error, data } = useQuery(GET_USER_BY_USERNAME, {
    variables: { username: search },
    skip: search.length < 1,
  });

  const [followUser, { loading: followLoading, error: followError, data: followData }] = useMutation(FOLLOW, {
    refetchQueries: [GET_USERS],
  });

  async function handleFollow(userId) {
    try {
      await followUser({
        variables: {
          newFollow: {
            followingId: userId,
          },
        },
      });
      showMessage({
        message: "Success",
        description: "You have successfully followed the user.",
        type: "success",
        icon: "success",
        duration: 3000,
      });
      navigation.navigate("Homepage");
    } catch (error) {
      showMessage({
        message: "Error",
        description: "Failed to follow the user. Please try again.",
        type: "danger",
        icon: "danger",
        duration: 3000,
      });
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Pressable onPress={() => navigation.navigate("UserProfile", { userId: item._id })} style={styles.userInfo}>
        <Image
          style={styles.avatar}
          source={{
            uri: item.avatarUrl || "https://ih1.redbubble.net/image.5278993626.5169/fposter,small,wall_texture,product,750x1000.u1.jpg",
          }}
        />
        <View>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.fullName}>{item.name}</Text>
        </View>
      </Pressable>
      <Pressable style={styles.followButton} onPress={() => handleFollow(item._id)}>
        <Text style={styles.followButtonText}>Follow</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Search by username" placeholderTextColor="#888" value={search} onChangeText={setSearch} />
      {loading && <ActivityIndicator size="large" color="#1e90ff" style={styles.loadingIndicator} />}
      {error && <Text style={styles.errorText}>Something went wrong!</Text>}
      {!loading && data && data.searchUserByUsername.length === 0 && <Text style={styles.noResultsText}>User not found</Text>}
      {data && data.searchUserByUsername.length > 0 && <FlatList data={data.searchUserByUsername} renderItem={renderItem} keyExtractor={(item) => item._id} style={styles.resultsList} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "white",
    marginBottom: 10,
    backgroundColor: "#1f1f1f",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  noResultsText: {
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  resultsList: {
    marginTop: 10,
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  fullName: {
    color: "#888",
    fontSize: 14,
  },
  followButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
