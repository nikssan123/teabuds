import React from "react";
import { View, StyleSheet } from "react-native";
import { Layout, Text, Button, Icon } from "@ui-kitten/components";

const PlusIcon = props => <Icon {...props} name="plus-outline" />;
const SearchIcon = props => <Icon {...props} name="search-outline" />;

const Explore = ({ navigation }) => {
    const onSearchClick = () => {
        navigation.navigate("Search");
    };

    const onCreateClick = () => {
        navigation.navigate("Create");
    };

    return (
        <Layout style={styles.container}>
            <Layout style={styles.innerContainer}>
                <Text style={styles.title} category="h1">
                    Teabuds
                </Text>
                <Text style={styles.title} category="h2">
                    Explore
                </Text>
                <Text style={styles.title} category="h5" appearance="hint">
                    Search for people nearby
                </Text>
                <Text style={styles.title} category="h5" appearance="hint">
                    Or you can create your own post
                </Text>
                <View style={styles.buttonContainer}>
                    <Button
                        style={{ marginBottom: 20 }}
                        accessoryRight={SearchIcon}
                        appearance="outline"
                        size="giant"
                        status="info"
                        onPress={onSearchClick}
                    >
                        Search
                    </Button>
                    <Button
                        accessoryRight={PlusIcon}
                        appearance="outline"
                        size="giant"
                        status="success"
                        onPress={onCreateClick}
                    >
                        Create
                    </Button>
                </View>
            </Layout>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#334166",
    },
    innerContainer: {
        flex: 0.7,
        padding: 16,
        justifyContent: "center",
        borderRadius: 18,
    },
    title: {
        alignSelf: "center",
        // marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 25,
    },
});

export default Explore;
