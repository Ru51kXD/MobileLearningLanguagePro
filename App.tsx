import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { initDatabase } from './database/database';

import HomeScreen from './screens/HomeScreen';
import LessonsScreen from './screens/LessonsScreen';
import LessonDetailScreen from './screens/LessonDetailScreen';
import QuizScreen from './screens/QuizScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Стек навигация для уроков
function LessonsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LessonsList" component={LessonsScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {  useEffect(() => {
    const init = async () => {
      await initDatabase();
    };
    init();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Lessons') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Quiz') {
              iconName = focused ? 'help-circle' : 'help-circle-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'home-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopColor: '#e5e7eb',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Lessons" component={LessonsStack} />
        <Tab.Screen name="Quiz" component={QuizScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 