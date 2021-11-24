import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text } from "@ui-kitten/components";

const Settings = props => {
    return (
        <Layout style={styles.container}>
            <Text>Settings</Text>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Settings;
