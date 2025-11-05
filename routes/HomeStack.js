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
    await fetch(`${API_BASE}/`, {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
  } catch (_) {
    // Intentionally ignore — this is just a warm-up.
  }
}

// Small helper with a per-request timeout so a hung network doesn't block UI.
async function fetchWithTimeout(url, options = {}, ms = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
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
          // Wake backend (Render cold start)
          await warmBackend();

          // 1) Try with the current (cached) token
          let token = await getIdToken(firebaseUser, false);
          console.log("HomeStack: Firebase token fetched (cached).");

          let response = await fetchWithTimeout(`${API_BASE}/api/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          // 2) If token is expired/invalid, refresh once and retry
          if (response.status === 401) {
            console.warn("HomeStack: 401 from backend — refreshing token once.");
            token = await getIdToken(firebaseUser, true); // force refresh
            response = await fetchWithTimeout(`${API_BASE}/api/user/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          }

          console.log("HomeStack: Backend response status:", response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log("HomeStack: Fetched userData from backend:", userData);

            dispatch({
              type: "LOGIN",
              payload: { ...userData, authToken: token },
            });
          } else {
            // Bubble up detailed backend text for your logs
            const body = await response.text();
            console.error("HomeStack: Backend auth failed:", body);
            throw new Error("Unauthorized - Token validation failed");
          }
        } catch (error) {
          console.error("HomeStack: Error during token sync:", error?.message || String(error));
          // Keep your existing behavior
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
    return null; // unchanged
  }

  console.log("HomeStack: Rendering appropriate Navigator. Current user:", user);
  return user ? <AppNavigator key="app" /> : <AuthNavigator key="auth" />;
};

export default HomeStack;
