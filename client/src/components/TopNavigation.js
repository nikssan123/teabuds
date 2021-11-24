import React, { useEffect, useState } from "react";
import {
    Icon,
    Layout,
    MenuItem,
    OverflowMenu,
    TopNavigation,
    TopNavigationAction,
} from "@ui-kitten/components";
import { StyleSheet, StatusBar } from "react-native";

const BackIcon = props => <Icon {...props} name="arrow-back" />;

const PlusIcon = props => <Icon {...props} name="plus-square-outline" />;

const MenuIcon = props => <Icon {...props} name="more-vertical" />;

const LogoutIcon = props => <Icon {...props} name="log-out" />;

const SettingsIcon = props => <Icon {...props} name="settings-2-outline" />;

export const TopNavigationNavBar = ({ navigation, logout }) => {
    const [ menuVisible, setMenuVisible ] = useState(false);
    const [ backVisible, setBackVisible ] = useState(false);

    useEffect(() => {
        if (navigation.canGoBack()) {
            setBackVisible(true);
        }
    }, []);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const goToSettings = () => {
        navigation.navigate("Settings");
    };

    const renderMenuAction = () => <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />;

    const renderRightActions = () => (
        <React.Fragment>
            <StatusBar hidden={true} />
            <TopNavigationAction
                icon={PlusIcon}
                onPress={() => navigation.navigate("CreatePost")}
            />
            <OverflowMenu
                anchor={renderMenuAction}
                visible={menuVisible}
                onBackdropPress={toggleMenu}
            >
                <MenuItem onPress={goToSettings} accessoryLeft={SettingsIcon} title="Settings" />
                <MenuItem onPress={logout} accessoryLeft={LogoutIcon} title="Logout" />
            </OverflowMenu>
        </React.Fragment>
    );

    const renderBackAction = () =>
        backVisible ? (
            <TopNavigationAction onPress={() => navigation.goBack()} icon={BackIcon} />
        ) : null;

    return (
        <Layout style={styles.container} level="1">
            <TopNavigation
                alignment="center"
                title="Teabuds"
                subtitle="Home"
                accessoryLeft={renderBackAction}
                accessoryRight={renderRightActions}
            />
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 70,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#0292f9",
    },
});

export default TopNavigationNavBar;
