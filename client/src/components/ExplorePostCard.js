import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Button, Card, Icon, Layout, Text, Modal, Divider } from "@ui-kitten/components";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import fromnow from "fromnow";

const { height, width } = Dimensions.get("window");

const LATITUDE_DELTA = 0.25;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

const TrashIcon = props => <Icon {...props} name="trash-2-outline" />;

const CloseIcon = props => <Icon {...props} name="close-outline" />;

const MapIcon = props => <Icon {...props} name="map-outline" />;

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
    const { postUserId, userId, setVisible, setMapVisible } = props;

    return (
        <View {...props} style={[ props.style, styles.footerContainer ]}>
            <View
                style={{
                    flex: 1,
                    justifyContent: "space-between",
                    flexDirection: "row",
                }}
            >
                <Button
                    onPress={() => setMapVisible(true)}
                    status="info"
                    appearance="ghost"
                    accessoryLeft={MapIcon}
                >
                    View On Map
                </Button>
                {postUserId === userId ? (
                    <Button
                        onPress={() => setVisible(true)}
                        size="medium"
                        appearance="ghost"
                        status="danger"
                        accessoryRight={TrashIcon}
                    />
                ) : null}
            </View>
        </View>
    );
};

const PostCard = ({ navigation, post, userId }) => {
    const { id, title, description, created, user, drink, city } = post;

    const [ visible, setVisible ] = useState(false);
    const [ mapVisible, setMapVisible ] = useState(false);

    const date = fromnow(created, { max: 1 });

    const deletePost = async () => {
        try {
            // "/:id/:userId"
            const { data } = await axios.delete(`http://10.0.2.2:8081/api/explore/${id}/${userId}`);
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
                        onPress={deletePost}
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
            <Modal
                visible={mapVisible}
                backdropStyle={styles.backdrop}
                onBackdropPress={() => setMapVisible(false)}
            >
                <Card disabled={true} style={{ borderRadius: 16 }}>
                    <Text style={{ marginBottom: 5 }} category="h3">
                        View Location on Map
                    </Text>
                    <MapView
                        style={{ width: width * 0.8, height: height * 0.6 }}
                        initialRegion={{
                            latitude: Number(post.latitude),
                            longitude: Number(post.longitude),
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: Number(post.latitude),
                                longitude: Number(post.longitude),
                            }}
                        />
                    </MapView>
                    <Button
                        onPress={() => setMapVisible(false)}
                        appearance="outline"
                        status="danger"
                        style={{ marginTop: 15 }}
                    >
                        Close
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
                        setVisible={setVisible}
                        setMapVisible={setMapVisible}
                    />
                )}
            >
                <View style={styles.bodyContainer}>
                    <Text style={styles.textStyle} category="p1">
                        <Text style={styles.textStyle} category="p1" status="info">
                            {user.username}{" "}
                        </Text>
                        is looking for:{" "}
                        <Text style={styles.textStyle} category="p1" status="info">
                            {drink}
                        </Text>
                    </Text>
                    <Text style={styles.textStyle} category="p1">
                        Located In: {" "}
                        <Text style={styles.textStyle} category="p1" status="info">
                            {city}
                        </Text>
                    </Text>
                    <Divider style={styles.divider} />
                    <Text style={styles.textStyle} category="p1">
                        Description: {description}
                    </Text>
                    <Divider style={styles.divider} />
                    <Text style={styles.textStyle} category="p1">
                        Contact Info:
                    </Text>
                    {post.phone ? (
                        <Text style={styles.textStyle} category="p1">
                            Phone:{" "}
                            <Text status="info" style={styles.textStyle} category="p1">
                                {post.phone}
                            </Text>
                        </Text>
                    ) : null}
                    {post.email ? (
                        <Text style={styles.textStyle} category="p1">
                            Email:{" "}
                            <Text status="info" style={styles.textStyle} category="p1">
                                {post.email}
                            </Text>
                        </Text>
                    ) : null}
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalControl: {
        marginTop: 8,
    },
    textStyle: {
        fontSize: 18,
    },
    divider: {
        marginVertical: 5,
    },
});

export default PostCard;
