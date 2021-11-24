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

const SignUp = ({ navigation }) => {
    const { signup } = useContext(AuthContext);

    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ passwordVisible, setPasswordVisible ] = useState(false);
    const [ error, setError ] = useState(false);

    const onPasswordIconPress = () => {
        setPasswordVisible(!passwordVisible);
    };

    const renderIcon = props => (
        <TouchableWithoutFeedback onPress={onPasswordIconPress}>
            <Icon {...props} name={passwordVisible ? "eye-off" : "eye"} />
        </TouchableWithoutFeedback>
    );

    const onSignUp = async () => {
        try {
            await signup(username, email, password);
        } catch (e) {
            setError(true);
        }
    };

    const onSignInButtonPress = () => {
        navigation.navigate("Signin");
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={behaviour}>
            <ScrollView scrollEnabled={false}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text category="h1" status="control">
                            Welcome
                        </Text>
                        <Text style={styles.signInLabel} category="h5" status="control">
                            Sign up to Teabuds
                        </Text>
                    </View>

                    <Layout style={styles.formContainer} level="1">
                        <View>
                            <Input
                                style={{ marginBottom: 10 }}
                                label="Username *"
                                accessoryRight={props => <Icon {...props} name="person" />}
                                value={username}
                                onChangeText={setUsername}
                            />
                            <Input
                                label="Email *"
                                accessoryRight={props => <Icon {...props} name="email-outline" />}
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Input
                                label="Password *"
                                style={styles.passwordInput}
                                accessoryRight={renderIcon}
                                value={password}
                                secureTextEntry={!passwordVisible}
                                onChangeText={setPassword}
                            />
                            {error ? (
                                <Text style={styles.errorMessage} category="h5" status="danger">
                                    Something went wrong!
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.signInButton} size="giant" onPress={onSignUp}>
                                SIGN Up
                            </Button>
                            <Button
                                style={styles.signUpButton}
                                appearance="ghost"
                                status="basic"
                                onPress={onSignInButtonPress}
                            >
                                Already have an account?
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
        paddingTop: 45,
        paddingHorizontal: 16,
        justifyContent: "space-around",
    },
    buttonContainer: {
        marginTop: 20,
    },
    signInLabel: {
        marginTop: 16,
    },
    errorMessage: {
        marginTop: 16,
        alignSelf: "center",
    },
    signInButton: {
        marginHorizontal: 16,
    },
    signUpButton: {
        marginVertical: 12,
        marginHorizontal: 16,
    },
    passwordInput: {
        marginTop: 16,
    },
});

export default SignUp;
