import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Card, Icon, Layout, Text, Modal } from "@ui-kitten/components";
import axios from "axios";
import fromnow from "fromnow";

const HeartIcon = props => <Icon {...props} fill="red" name="heart-outline" />;

const TrashIcon = props => <Icon {...props} name="trash-2-outline" />;

const CloseIcon = props => <Icon {...props} name="close-outline" />;

const Header = props => {
    const { title, user, date } = props;
    const { username } = user;

    return (
        <View {...props} style={[ props.style, styles.headerContainer ]}>
            <View>
                <Text category="h6">{title}</Text>
            </View>
            <View>
                <Text category="s1">By {username}</Text>
                <Text category="s2" appearance="hint">
                    {date} ago
                </Text>
            </View>
        </View>
    );
};

const Footer = props => {
    const { viewMore, likes, likePost, postUserId, userId, setVisible } = props;

    return (
        <View {...props} style={[ props.style, styles.footerContainer ]}>
            <View style={styles.likesContainer}>
                <Text category="p1">{likes}</Text>
                {/* <Icon onPre fill="red" name="heart-outline" style={styles.heartIcon} /> */}

                <Button
                    onPress={likePost}
                    size="medium"
                    appearance="ghost"
                    accessoryRight={HeartIcon}
                />
            </View>
            <View style={{ flexDirection: "row" }}>
                {postUserId === userId ? (
                    <Button
                        onPress={() => setVisible(true)}
                        size="medium"
                        appearance="ghost"
                        status="danger"
                        accessoryRight={TrashIcon}
                    />
                ) : null}
                <Button
                    onPress={viewMore}
                    style={styles.footerControl}
                    size="medium"
                    appearance="ghost"
                >
                    View More
                </Button>
            </View>
        </View>
    );
};

const PostCard = ({ navigation, post, userId, updatePosts }) => {
    const { id, title, image, description, created, likes, user } = post;

    const [ numberOfLikes, setNumberOfLikes ] = useState(likes);
    const [ visible, setVisible ] = useState(false);

    const date = fromnow(created, { max: 1 });

    const likePost = async () => {
        try {
            const { data } = await axios.put(`http://10.0.2.2:8081/api/post/likes/like/${id}`);

            setNumberOfLikes(data.likes);
        } catch (e) {
            console.log(e);
        }
    };

    const deletePost = async () => {
        try {
            // "/:id/:userId"
            const { data } = await axios.delete(`http://10.0.2.2:8081/api/post/${id}/${userId}`);

            updatePosts(id);

            setVisible(false);
        } catch (e) {
            console.log(e);
        }
    };

    const viewPost = () => {
        navigation.navigate("Post", { id });
    };

    return (
        <React.Fragment>
            <Modal
                visible={visible}
                backdropStyle={styles.backdrop}
                onBackdropPress={() => setVisible(false)}
            >
                <Card disabled={true} style={styles.modalContainer}>
                    <Text category="s1" style={{ marginBottom: 15 }}>
                        Are you sure you want to delete this post?
                    </Text>
                    <Button
                        style={styles.modalControl}
                        appearance="ghost"
                        accessoryRight={TrashIcon}
                        status="danger"
                        onPress={() => deletePost(id, userId)}
                    >
                        Delete
                    </Button>
                    <Button
                        style={styles.modalControl}
                        appearance="ghost"
                        accessoryRight={CloseIcon}
                        onPress={() => setVisible(false)}
                    >
                        Cancel
                    </Button>
                </Card>
            </Modal>
            <Card
                style={styles.card}
                header={props => <Header {...props} title={title} user={user} date={date} />}
                footer={props => (
                    <Footer
                        {...props}
                        viewMore={viewPost}
                        userId={userId}
                        postUserId={user.id}
                        likes={numberOfLikes}
                        likePost={likePost}
                        visible={visible}
                        setVisible={setVisible}
                    />
                )}
            >
                <View style={[ styles.bodyContainer, { height: image ? 150 : 50 } ]}>
                    {image ? (
                        <Image
                            style={{
                                flex: 1,
                                height: undefined,
                                width: undefined,
                            }}
                            source={{ uri: image }}
                        />
                    ) : null}
                    <Text numberOfLines={2} ellipsizeMode="tail">
                        {description}
                    </Text>
                </View>
            </Card>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    card: {
        flex: 1,
        margin: 2,
        marginBottom: 16,
        backgroundColor: "#334166",
        borderRadius: 15,
        borderWidth: 0,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bodyContainer: {
        width: "100%",
        justifyContent: "center",
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // height: 65,
    },
    likesContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    footerControl: {
        marginHorizontal: 2,
    },
    heartIcon: {
        width: 32,
        height: 32,
        marginLeft: 5,
    },
    modalContainer: {
        borderRadius: 18,
        paddingTop: 10,
    },
    backdrop: {
        // backgroundColor: "rgba(255, 255, 255, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    modalControl: {
        marginTop: 8,
    },
});

export default PostCard;
