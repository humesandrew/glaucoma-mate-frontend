import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { auth } from "../firebase.js";
import { getIdToken } from "firebase/auth";
import { useAuthContext } from "../hooks/useAuthContext.js";
import AuthNavigator from "./AuthNavigator.js";
import AppNavigator from "./AppNavigator.js";

const HomeStack = () => {
  const { user, dispatch } = useAuthContext();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    console.warn("[HomeStack] mount: starting auth check");
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.warn("[HomeStack] onAuthStateChanged:", firebaseUser);
      (async () => {
        if (firebaseUser) {
          try {
            const token = await getIdToken(firebaseUser, true);
            console.warn("[HomeStack] token:", token);

            const res = await fetch(
              "https://glaucoma-mate-backend.onrender.com/api/user/login",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.warn("[HomeStack] backend status:", res.status);
            if (!res.ok) {
              const text = await res.text();
              throw new Error(`Backend error: ${text}`);
            }
            const userData = await res.json();
            console.warn("[HomeStack] backend userData:", userData);
            dispatch({ type: "LOGIN", payload: { ...userData, authToken: token } });
          } catch (err) {
            console.error("[HomeStack] sync error:", err);
            dispatch({ type: "LOGOUT" });
          }
        } else {
          console.warn("[HomeStack] no firebase user, logging out");
          dispatch({ type: "LOGOUT" });
        }
        setIsCheckingAuth(false);
      })();
    });
    return () => {
      console.warn("[HomeStack] unmount: unsubscribing");
      unsubscribe();
    };
  }, [dispatch]);

  if (isCheckingAuth) {
    console.warn("[HomeStack] rendering loading spinner");
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  console.warn("[HomeStack] rendering navigator, user=", user);
  return user ? <AppNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
});

export default HomeStack;
