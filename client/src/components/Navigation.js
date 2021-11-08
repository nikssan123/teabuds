import React, { useContext } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AuthContext } from "../context/AuthContext";

import BottomNavBar from "./BottomNavBar";

// import Onboarding from '../screens/Auth/Onboarding/Onboarding';
import SigninScreen from "../screens/Auth/SignIn";
import SignupScreen from "../screens/Auth/SignUp";

import HomeScreen from "../screens/Home";
import ExploreScreen from "../screens/Explore";
import UserScreen from "../screens/User";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default () => {
    const { state } = useContext(AuthContext);

    return (
        <NavigationContainer>
            {state.isLoggedIn ? (
                <Tab.Navigator
                    tabBar={props => <BottomTabBar {...props} />}
                    tabBarOptions={{ keyboardHidesTabBar: true }}
                >
                    <Tab.Screen name="HomeScreen" component={HomeScreen} />
                    <Tab.Screen name="ExploreScreen" component={ExploreScreen} />
                    <Tab.Screen name="UserScreen" component={UserScreen} />
                </Tab.Navigator>
            ) : (
                <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
                    <Stack.Screen
                        name="Signup"
                        component={SignupScreen}
                        // options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Signin"
                        component={SigninScreen}
                        // options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};
