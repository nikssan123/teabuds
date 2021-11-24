import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import {
    Layout,
    Text,
    Button,
    Icon,
    Spinner,
    Divider,
    Modal,
    Card,
    Input,
} from "@ui-kitten/components";
import axios from "axios";
import fromnow from "fromnow";

const { width } = Dimensions.get("window");

const HeartIcon = props => <Icon {...props} fill="red" name="heart-outline" />;
const PlusIcon = props => <Icon {...props} name="plus-outline" />;
const TrashIcon = props => <Icon {...props} name="trash-2-outline" />;

const Post = ({ route }) => {
    const { id, state } = route.params;

    const [ loading, setLoading ] = useState(true);
    const [ visible, setVisible ] = useState(false);
    const [ comment, setComment ] = useState("");
    const [ error, setError ] = useState(false);

    const [ post, setPost ] = useState({});

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        const { data } = await axios.get(`http://10.0.2.2:8081/api/post/${id}`);

        setPost(data);
        setLoading(false);
    };

    const likePost = async () => {
        try {
            const { data } = await axios.put(`http://10.0.2.2:8081/api/post/likes/like/${id}`);

            setPost({ ...post, likes: data.likes });
        } catch (e) {
            console.log(e);
        }
    };

    const renderComment = item => {
        return (
            <React.Fragment key={item.id}>
                <Divider />
                <View style={styles.comment}>
                    <Text category="p1">{item.message}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ marginRight: 5 }}>
                            <Text>By {item.user.username}</Text>
                            <Text category="s2" appearance="hint">
                                {fromnow(item.created, { max: 1 })} ago
                            </Text>
                        </View>
                        {item.user.id === state.user.id ? (
                            <Button
                                onPress={() => deleteComment(item.id, state.user.id)}
                                status="danger"
                                appearance="ghost"
                                accessoryRight={TrashIcon}
                            />
                        ) : null}
                    </View>
                </View>
            </React.Fragment>
        );
    };

    // const comments = post.comments.forEach(comment => renderComment(comment));

    const closeModal = () => {
        setComment("");
        setVisible(false);
    };

    const createComment = async () => {
        setError(false);
        try {
            const { data } = await axios.post(
                `http://10.0.2.2:8081/api/comments/${id}/${state.user.id}`,
                {
                    message: comment,
                }
            );

            setPost({ ...post, comments: [ ...post.comments, data ] });
            closeModal();
        } catch (e) {
            setError(true);
            console.log(e);
        }
    };

    const deleteComment = async (commentId, userId) => {
        try {
            const {
                data,
            } = await axios.delete(`http://10.0.2.2:8081/api/comments/${commentId}/${userId}`, {
                message: comment,
            });

            setPost({
                ...post,
                comments: post.comments.filter(comment => comment.id !== commentId),
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Layout style={styles.container}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Spinner size="giant" />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                    <Modal
                        visible={visible}
                        backdropStyle={styles.backdrop}
                        onBackdropPress={closeModal}
                    >
                        <Card style={styles.modal} disabled={true}>
                            <Text style={styles.modalControl} category="h1">
                                Create Comment
                            </Text>
                            <Input
                                style={styles.modalControl}
                                placeholder="Message..."
                                value={comment}
                                onChangeText={value => setComment(value)}
                                multiline
                                numberOfLines={2}
                            />
                            {error ? (
                                <Text style={styles.modalControl} status="danger" category="s1">
                                    Something went wrong!
                                </Text>
                            ) : null}
                            <Button
                                style={styles.modalControl}
                                appearance="outline"
                                status="success"
                                onPress={createComment}
                            >
                                Add Comment
                            </Button>
                            <Button
                                style={styles.modalControl}
                                appearance="outline"
                                status="control"
                                onPress={closeModal}
                            >
                                Cancel
                            </Button>
                        </Card>
                    </Modal>
                    <View style={styles.headerContainer}>
                        <Text category="h1" status="control" style={styles.postTitle}>
                            {post.title}
                        </Text>
                        {post.image ? (
                            <Image style={styles.postImage} source={{ uri: post.image }} />
                        ) : null}

                        <View style={styles.postInfoContainer}>
                            <View style={styles.postLikesContainer}>
                                <Text category="p1">{post.likes}</Text>
                                <Button
                                    onPress={likePost}
                                    size="medium"
                                    appearance="ghost"
                                    accessoryRight={HeartIcon}
                                />
                            </View>
                            <View>
                                <Text category="p1">By {post.user.username}</Text>
                                <Text category="s2" appearance="hint">
                                    {fromnow(post.created, { max: 1 })} ago
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.postDescription} category="p1">
                            {post.description}
                        </Text>
                    </View>
                    <Divider />
                    <View style={styles.commentsContainer}>
                        <Text style={{ marginBottom: 15 }} category="h2">
                            Comments:
                        </Text>
                        <Button
                            onPress={() => setVisible(true)}
                            style={{ marginBottom: 15 }}
                            appearance="outline"
                            status="success"
                            accessoryRight={PlusIcon}
                        >
                            Add Comment
                        </Button>
                    </View>
                    {post.comments.map(comment => renderComment(comment))}
                    {/* <FlatList
                        data={post.comments}
                        renderItem={renderComment}
                        keyExtractor={(_, index) => String(index)}
                    /> */}
                </ScrollView>
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderRadius: 16,
        borderWidth: 0,
    },
    modalControl: {
        marginBottom: 10,
    },
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: 100,
        paddingTop: 16,
    },
    postTitle: {
        marginBottom: 10,
    },
    postImage: {
        width: width * 0.85,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    postInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "85%",
    },
    postLikesContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    postDescription: {
        marginLeft: 16,
        marginBottom: 16,
        fontSize: 18,
        alignSelf: "flex-start",
    },
    commentsContainer: {
        marginTop: 8,
    },
    comment: {
        padding: 15,
        marginBottom: 10,
        // borderRadius: 10,
        // borderWidth: 1,
        borderColor: "black",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

export default Post;
