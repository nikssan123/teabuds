import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

const Home = props => {
    const { state } = useContext(AuthContext);

    console.log(state);
    return (
        <View>
            <Text>{state.user.email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({});

export default Home;
