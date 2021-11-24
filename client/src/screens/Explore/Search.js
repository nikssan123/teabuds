import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableWithoutFeedback } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Layout, Text, Spinner, Button, Icon, Input } from "@ui-kitten/components";
import ExplorePostCard from "../../components/ExplorePostCard";
import axios from "axios";

const PlusIcon = props => <Icon {...props} name="plus-outline" />;

const Search = ({ navigation, route }) => {
    const isFocused = useIsFocused();

    const [ search, setSearch ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const [ posts, setPosts ] = useState([]);

    const onCreatePress = () => {
        navigation.navigate("Create");
    };

    const fetchAllPosts = async () => {
        try {
            const { data } = await axios.get("http://10.0.2.2:8081/api/explore");

            setPosts(data);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(
        () => {
            fetchAllPosts();
        },
        [ isFocused ]
    );

    useEffect(
        () => {
            (async () => {
                if (search) {
                    const { data } = await axios.get(
                        `http://10.0.2.2:8081/api/explore/search/${search}`
                    );

                    setPosts(data);
                } else {
                    fetchAllPosts();
                }
            })();
        },
        [ search ]
    );

    const renderIcon = props => {
        return (
            <React.Fragment>
                {search ? (
                    <TouchableWithoutFeedback onPress={() => setSearch("")}>
                        <Icon {...props} name="close-outline" />
                    </TouchableWithoutFeedback>
                ) : (
                    <Icon {...props} name="search-outline" />
                )}
            </React.Fragment>
        );
    };

    const renderPost = ({ item }) => {
        return <ExplorePostCard post={item} userId={route.params.state.user.id || -1} />;
    };

    const onSearch = async e => {
        setSearch(e);
    };

    return (
        <Layout style={styles.container}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Spinner size="giant" />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.headerContainer}>
                        <Text style={{ alignSelf: "center" }} category="h1">
                            Welcome to Explore
                        </Text>
                        <Input
                            style={{ marginBottom: 5 }}
                            placeholder="Search"
                            value={search}
                            // accessoryRight={SearchIcon}
                            accessoryRight={renderIcon}
                            onChangeText={onSearch}
                        />
                        <Button
                            appearance="outline"
                            onPress={onCreatePress}
                            status="success"
                            accessoryRight={PlusIcon}
                        >
                            Create Post
                        </Button>
                    </View>
                    <FlatList
                        style={{ padding: 16 }}
                        data={posts}
                        renderItem={renderPost}
                        keyExtractor={(_, index) => String(index)}
                    />
                </View>
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingTop: 16,
        justifyContent: "center",
        marginBottom: 15,
    },
});

export default Search;
