import React, { useState, useContext } from "react";
import { Button, Input, Layout, Text, Icon } from "@ui-kitten/components";
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    ScrollView,
    Dimensions,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";

const behaviour = Platform.OS === "ios" ? "paddding" : null;
const { height } = Dimensions.get("window");

const Forgot = ({ navigation }) => {
    const { forgot } = useContext(AuthContext);

    const [ error, setError ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ msg, setMsg ] = useState("");

    const onResetPress = async () => {
        setError("");
        try {
            const res = await forgot(email);
            setMsg(res.message);
        } catch (e) {
            setError(true);
        }
    };

    const renderCaption = () => {
        return <Text style={styles.captionText}>{msg}</Text>;
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={behaviour}>
            <ScrollView scrollEnabled={false}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text category="h1" status="control">
                            Teabuds
                        </Text>
                        <Text style={styles.signInLabel} category="h5" status="control">
                            Forgot Password
                        </Text>
                    </View>

                    <Layout style={styles.formContainer} level="1">
                        <View>
                            <Text category="s1" style={{ marginBottom: 15 }}>
                                Enter the Email address associated with your account
                            </Text>
                            <Input
                                placeholder="Email"
                                accessoryRight={props => <Icon {...props} name="email-outline" />}
                                value={email}
                                onChangeText={setEmail}
                                caption={msg ? renderCaption : null}
                            />
                            {error ? (
                                <Text style={styles.errorMessage} category="h5" status="danger">
                                    Couldn't find an account with this email
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.forgotButton} size="giant" onPress={onResetPress}>
                                RESET
                            </Button>
                            <Button
                                style={styles.goBackButton}
                                appearance="ghost"
                                status="basic"
                                onPress={() => navigation.goBack()}
                            >
                                Go Back?
                            </Button>
                        </View>
                    </Layout>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#445488",
        height,
    },
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: 270,
    },
    formContainer: {
        flex: 2,
        paddingTop: 50,
        paddingHorizontal: 16,
        justifyContent: "space-around",
        // alignItems: "center",
        // justifyContent: "center",
    },
    buttonContainer: {
        marginTop: 20,
    },
    signInLabel: {
        marginTop: 16,
    },
    errorMessage: {
        marginTop: 10,
        fontSize: 18,
        alignSelf: "center",
    },
    forgotButton: {
        marginHorizontal: 16,
    },
    goBackButton: {
        marginVertical: 12,
        marginHorizontal: 16,
    },
    forgotPasswordContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    passwordInput: {
        marginTop: 16,
    },
    forgotPasswordButton: {
        paddingHorizontal: 0,
    },
    captionText: {
        padding: 8,
        fontWeight: "300",
    },
});

export default Forgot;
