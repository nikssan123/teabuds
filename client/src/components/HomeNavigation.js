import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

import PostList from "../screens/Home/PostList";
import CreatePost from "../screens/Home/CreatePost";
import TopNavigation from "./TopNavigation";
import Post from "../screens/Home/Post";
import Settings from "../screens/Home/Settings";

const Stack = createNativeStackNavigator();

const Home = () => {
    const { state, logout } = useContext(AuthContext);

    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => {
                return {
                    header: () => <TopNavigation navigation={navigation} logout={logout} />,
                };
            }}
        >
            <Stack.Screen name="PostList" component={PostList} initialParams={{ state }} />
            <Stack.Screen name="CreatePost" component={CreatePost} initialParams={{ state }} />
            <Stack.Screen name="Post" component={Post} initialParams={{ state }} />
            <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
    );
};

export default Home;
