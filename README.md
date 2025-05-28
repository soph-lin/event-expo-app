# Event Expo App 📅

A modern, cross-platform mobile application built with React Native and Expo for managing and exploring events. This demo app showcases a beautiful UI with smooth animations, theme customization, and interactive features.

## Features

- 🎨 Customizable themes with smooth transitions
- 📱 Cross-platform support (iOS, Android, Web)
- 🗺️ Interactive map exploration
- 📅 Event schedule management
- 👥 Speaker profiles
- ⭐ Favorite events functionality
- 🎭 Beautiful animations and gestures
- 🌓 Custom theme picker

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context
- **Storage**: AsyncStorage
- **UI Components**:
  - Expo Vector Icons
  - React Native Reanimated
  - React Native Gesture Handler
  - Expo Blur
  - Expo Linear Gradient
- **Development Tools**:
  - TypeScript
  - ESLint
  - Prettier
  - Babel

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## Additional Notes

User info like favorited events is stored in AsyncStorage to demo storage without the need of a database. If this application were to be used in a real setting, this would be replaced with an online database and API layer.
