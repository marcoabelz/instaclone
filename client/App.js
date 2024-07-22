import { StyleSheet } from "react-native";
import MainStack from "./navigators/MainStack";
import { ApolloProvider, gql } from "@apollo/client";
import { useState } from "react";
import client from "./config/ApolloConnection";
import { AuthContext } from "./contexts/Auth";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          isSignedIn: isSignedIn,
          setIsSignedIn: setIsSignedIn,
        }}
      >
        <MainStack />
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
