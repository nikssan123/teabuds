import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Layout, Text, Input, Button, Icon } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import mime from "mime";

const createFormData = (photo, body = {}) => {
    const data = new FormData();

    let newImageUri;

    if (photo) {
        const newImageUri = "file:///" + photo.uri.split("file:/").join("");

        data.append("photo", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
        });
    }
    Object.keys(body).forEach(key => {
        data.append(key, body[key]);
    });

    return data;
};

const behaviour = Platform.OS === "ios" ? "paddding" : null;

const CreatePost = ({ navigation, route }) => {
    const { id } = route.params.state.user;

    const [ image, setImage ] = useState(null);
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ error, setError ] = useState("");

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("Sorry, we need camera roll permissions to make this work!");
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [ 4, 3 ],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result);
        }
    };

    const onHandlePublish = async () => {
        try {
            const result = await axios.post(
                `http://10.0.2.2:8081/api/post/${id}`,
                createFormData(image, { title, description })
            );

            navigation.navigate("PostList");
        } catch (e) {
            setError(true);
            console.log(e);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={behaviour}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <Layout style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text category="h1" status="control">
                            Create Your Own Post
                        </Text>
                    </View>
                    <Layout style={styles.formContainer} level="1">
                        <View>
                            <Input
                                style={styles.input}
                                label="Title"
                                accessoryRight={props => <Icon {...props} name="bulb-outline" />}
                                value={title}
                                onChangeText={setTitle}
                            />
                            <Input
                                label="Description"
                                accessoryRight={props => <Icon {...props} name="bulb-outline" />}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                textStyle={{ minHeight: 64 }}
                            />
                            <Button
                                style={styles.imageButton}
                                appearance="outline"
                                onPress={pickImage}
                            >
                                Select an image
                            </Button>
                            {image && (
                                <View style={styles.imagePreview}>
                                    <Text category="p1">Preview:</Text>
                                    <Image
                                        source={{ uri: image.uri }}
                                        style={{ height: 125, width: 125 }}
                                    />
                                </View>
                            )}
                            {error ? (
                                <Text style={styles.errorMessage} category="h5" status="danger">
                                    Something went wrong!
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button size="giant" onPress={onHandlePublish}>
                                Publish
                            </Button>
                        </View>
                    </Layout>
                </Layout>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: 120,
    },
    formContainer: {
        flex: 2,
        paddingHorizontal: 16,
        paddingBottom: 50,
        justifyContent: "space-between",
    },
    input: {
        marginBottom: 15,
    },
    imageButton: {
        marginTop: 15,
    },
    imagePreview: {
        padding: 10,
    },
});

export default CreatePost;
