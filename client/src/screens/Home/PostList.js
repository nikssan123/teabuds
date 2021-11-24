import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Layout, Spinner } from "@ui-kitten/components";
import axios from "axios";

import PostCard from "../../components/PostCard";

const Posts = ({ navigation, route }) => {
    const isFocused = useIsFocused();

    const [ loading, setLoading ] = useState(true);
    const [ posts, setPosts ] = useState([]);

    useEffect(
        () => {
            fetchPosts();
        },
        [ isFocused ]
    );

    const fetchPosts = async () => {
        try {
            const { data } = await axios.get("http://10.0.2.2:8081/api/post/");
            setPosts(data);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const renderItem = ({ item }) => {
        // const { id, title, description, image, likes, created, user } = item;
        return (
            <PostCard
                navigation={navigation}
                post={item}
                userId={route.params.state.user.id || -1}
                updatePosts={updatePosts}
            />
        );
    };

    const updatePosts = id => {
        const newPosts = posts.filter(post => post.id !== id);
        setPosts(newPosts);
    };

    return (
        <Layout style={styles.container}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Spinner size="giant" />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
});

export default Posts;
