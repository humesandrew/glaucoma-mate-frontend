import React, { useEffect, useState } from "react";
import { auth } from "../firebase.js";
import { getIdToken } from "firebase/auth";
import { useAuthContext } from "../hooks/useAuthContext.js";
import AuthNavigator from "./AuthNavigator.js";
import AppNavigator from "./AppNavigator.js";

const API_BASE = "https://glaucoma-mate-backend.onrender.com";

// Minimal wake-up fetch: HEAD / (short timeout); ignore errors.
async function warmBackend() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 600); // ~0.6s cap
    await fetch(`${API_BASE}/`, { method: "HEAD", signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
  } catch (_) {
    // Intentionally ignore — this is just a warm-up.
  }
}

const HomeStack = () => {
  const { user, dispatch } = useAuthContext();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("HomeStack: Starting auth state check");

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log("HomeStack: Firebase auth state changed. User:", firebaseUser);

      if (firebaseUser) {
        try {
          // 🔸 Wake backend (handles Render cold start) — no auth, quick timeout.
          await warmBackend();

          // Keep your existing non-forced token fetch.
          const token = await getIdToken(firebaseUser, false);
          console.log("HomeStack: Firebase token fetched:", token);

          const response = await fetch(`${API_BASE}/api/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("HomeStack: Backend response status:", response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log("HomeStack: Fetched userData from backend:", userData);

            dispatch({
              type: "LOGIN",
              payload: { ...userData, authToken: token },
            });
          } else {
            console.error(
              "HomeStack: Backend failed to validate token. Response:",
              await response.text()
            );
            throw new Error("Unauthorized - Token validation failed");
          }
        } catch (error) {
          console.error(
            "HomeStack: Error during token synchronization:",
            error.message
          );
          dispatch({ type: "LOGOUT" });
        }
      } else {
        console.log("HomeStack: No Firebase user found, dispatching LOGOUT");
        dispatch({ type: "LOGOUT" });
      }

      setIsCheckingAuth(false);
    });

    return () => {
      console.log("HomeStack: Cleaning up auth state listener");
      unsubscribe();
    };
  }, [dispatch]);

  if (isCheckingAuth) {
    console.log("HomeStack: Checking authentication, returning loading state");
    return null; // keeping as-is
  }

  console.log("HomeStack: Rendering appropriate Navigator. Current user:", user);

  return user ? <AppNavigator key="app" /> : <AuthNavigator key="auth" />;
};

export default HomeStack;
