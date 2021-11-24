import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Dimensions,
} from "react-native";
import {
    Layout,
    Text,
    Input,
    Button,
    Icon,
    IndexPath,
    Select,
    SelectItem,
    Modal,
    Card,
} from "@ui-kitten/components";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";
import { API_KEY_GOOGLE } from "@env";
import axios from "axios";

const behaviour = Platform.OS === "ios" ? "paddding" : null;

const data = [ "Tea", "Coffee", "Alcoholic Beverage" ];

const { height, width } = Dimensions.get("window");

const LATITUDE_DELTA = 0.25;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

const Create = ({ navigation, route }) => {
    const { state } = route.params;

    const [ mapVisible, setMapVisible ] = useState(false);
    const [ success, setSuccess ] = useState(true);
    const [ error, setError ] = useState("");
    const [ location, setLocation ] = useState(null);
    const [ city, setCity ] = useState("");
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ selectedIndex, setSelectedIndex ] = useState(new IndexPath(0));

    const geocode = async (latitude, longitude) => {
        try {
            const response = await Geocoder.from(latitude, longitude);
            // adress components[2] - city name
            setCity(response.results[0].address_components[2].long_name);
        } catch (e) {
            console.log(e);
            setError("Something went wrong!");
        }
    };

    useEffect(() => {
        setSuccess(false);
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setError("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            Geocoder.init(API_KEY_GOOGLE);

            geocode(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    const onHandlePublish = async () => {
        setError(null);

        try {
            const response = await axios.post(`http://10.0.2.2:8081/api/explore/${state.user.id}`, {
                title,
                description,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                city,
                drink: data[selectedIndex - 1],
                phone,
                email,
            });

            setSuccess(true);
        } catch (e) {
            console.log(e);
            setError("Something Went Wrong!");
        }
    };

    const displayValue = data[selectedIndex.row];

    const onMapPress = e => {
        setLocation({
            coords: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
            },
        });

        geocode(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
    };

    return (
        <React.Fragment>
            {success ? (
                <Layout
                    style={[ styles.container, { justifyContent: "center", alignItems: "center" } ]}
                >
                    <Text category="h1">Congratulations!</Text>
                    <Text style={{ textAlign: "center", marginTop: 5 }} category="h5">
                        You successfully created an explore post
                    </Text>
                    <Button
                        style={{ marginTop: 20 }}
                        status="success"
                        appearance="outline"
                        onPress={() => setSuccess(false)}
                    >
                        Create Another?
                    </Button>
                    <Button
                        style={{ marginTop: 20 }}
                        status="info"
                        appearance="outline"
                        onPress={() => navigation.navigate("Search")}
                    >
                        Go To Search Page
                    </Button>
                </Layout>
            ) : (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={behaviour}>
                    <ScrollView contentContainerStyle={{ flex: 1 }}>
                        <Layout style={styles.container}>
                            {location ? (
                                <Modal
                                    visible={mapVisible}
                                    backdropStyle={styles.backdrop}
                                    onBackdropPress={() => setMapVisible(false)}
                                >
                                    <Card
                                        disabled={true}
                                        style={{ borderRadius: 16, backgroundColor: "#334166" }}
                                    >
                                        <Text
                                            style={{ marginBottom: 5, textAlign: "center" }}
                                            category="h3"
                                        >
                                            Select Location
                                        </Text>
                                        <Text
                                            style={{ marginBottom: 5, textAlign: "center" }}
                                            category="h6"
                                            appearance="hint"
                                        >
                                            Set to your current location by default!
                                        </Text>
                                        <MapView
                                            onPress={onMapPress}
                                            style={{ width: width * 0.8, height: height * 0.6 }}
                                            initialRegion={{
                                                latitude: location.coords.latitude,
                                                longitude: location.coords.longitude,
                                                latitudeDelta: LATITUDE_DELTA,
                                                longitudeDelta: LONGITUDE_DELTA,
                                            }}
                                        >
                                            <Marker
                                                title={"Your current location"}
                                                coordinate={{
                                                    latitude: location.coords.latitude,
                                                    longitude: location.coords.longitude,
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
                            ) : null}
                            <View style={styles.headerContainer}>
                                <Text category="h1" status="control">
                                    Create an Explore Post
                                </Text>
                            </View>
                            <Layout style={styles.formContainer} level="1">
                                <View>
                                    <Input
                                        style={styles.input}
                                        label="Title"
                                        accessoryRight={props => (
                                            <Icon {...props} name="bulb-outline" />
                                        )}
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                    <Input
                                        style={styles.input}
                                        label="Description"
                                        accessoryRight={props => (
                                            <Icon {...props} name="bulb-outline" />
                                        )}
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        textStyle={{ minHeight: 64 }}
                                    />
                                    <Select
                                        style={styles.input}
                                        selectedIndex={selectedIndex}
                                        onSelect={index => setSelectedIndex(index)}
                                        value={displayValue}
                                        label="Select Drink Type"
                                    >
                                        <SelectItem title="Tea" />
                                        <SelectItem title="Coffee" />
                                        <SelectItem title="Alcohol" />
                                    </Select>
                                    <Text style={styles.input} category="h6">
                                        Contact Info:
                                    </Text>
                                    <Input
                                        style={styles.input}
                                        label="Email"
                                        accessoryRight={props => (
                                            <Icon {...props} name="email-outline" />
                                        )}
                                        value={email}
                                        onChangeText={setEmail}
                                    />

                                    <Input
                                        style={styles.input}
                                        label="Phone"
                                        accessoryRight={props => (
                                            <Icon {...props} name="phone-call-outline" />
                                        )}
                                        value={phone}
                                        onChangeText={setPhone}
                                    />
                                    <Button
                                        onPress={() => setMapVisible(true)}
                                        style={{ marginBottom: 10 }}
                                        category="h6"
                                        status="info"
                                    >
                                        Select Location
                                    </Button>
                                    {error ? (
                                        <Text
                                            style={styles.errorMessage}
                                            category="h5"
                                            status="danger"
                                        >
                                            {error}
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
            )}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: 100,
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

export default Create;
