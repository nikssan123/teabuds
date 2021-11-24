import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

import ExploreScreen from "../screens/Explore/Explore";
import SearchScreen from "../screens/Explore/Search";
import CreateScreen from "../screens/Explore/Create";

const Stack = createNativeStackNavigator();

const ExploreNavigation = () => {
    const { state } = useContext(AuthContext);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Explore" component={ExploreScreen} />
            <Stack.Screen name="Search" component={SearchScreen} initialParams={{ state }} />
            <Stack.Screen name="Create" component={CreateScreen} initialParams={{ state }} />
        </Stack.Navigator>
    );
};

export default ExploreNavigation;
