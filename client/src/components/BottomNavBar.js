import React from "react";
import { BottomNavigation, BottomNavigationTab, Icon } from "@ui-kitten/components";

const PersonIcon = props => <Icon {...props} name="person-outline" />;

const HomeIcon = props => <Icon {...props} name="home-outline" />;

const MapIcon = props => <Icon {...props} name="map-outline" />;

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}
    >
        <BottomNavigationTab title="Home" icon={HomeIcon} />
        <BottomNavigationTab title="Explore" icon={MapIcon} />
        {/* <BottomNavigationTab title="User" icon={PersonIcon} /> */}
    </BottomNavigation>
);

export default BottomTabBar;
