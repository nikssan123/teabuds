import React, { useContext, useState, useEffect } from "react";
import AppLoading from "expo-app-loading";

import { AuthContext } from "../context/AuthContext";

const AuthResolver = ({ children }) => {
    const { tryLocalSignin } = useContext(AuthContext);

    const [ ready, setReady ] = useState(false);

    useEffect(() => {
        tryLocalSignin();
        setReady(true);
    }, []);

    if (!ready) {
        return <AppLoading />;
    }

    return <React.Fragment>{children}</React.Fragment>;
};

export default AuthResolver;
