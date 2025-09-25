

export default {
  expo: {
    name: "glaucoma-mate-frontend",
    slug: "glaucoma-mate-frontend",
    version: "1.0.6",
    orientation: "portrait",
    icon: "./assets/glaucomabuddylogo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/glaucomabuddysplash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      newArchEnabled: true,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.humesandrew.glaucomamatefrontend",
      infoPlist: {
        UIBackgroundModes: ["remote-notification"],
        NSUserTrackingUsageDescription:
          "This identifier will be used to send you notifications about your glaucoma medications.",
          ITSAppUsesNonExemptEncryption: false
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/glaucomabuddylogo.png",
        backgroundColor: "#ffffff",
      },
      package: "com.humesandrew.glaucomamatefrontend",
    },
    web: {
      favicon: "./assets/glaucomabuddylogo.png",
    },
    extra: {
      firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      },
      eas: {
        projectId: "6522e1ff-cbea-45da-862b-bb6788b2168e",
      },
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-notifications",
        {
          icon: "./assets/glaucomabuddylogo.png",
          color: "#ffffff",
        },
      ],
    ],
  },
};
