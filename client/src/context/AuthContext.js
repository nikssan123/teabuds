import React, { createContext, useReducer, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt from "jwt-decode";
import axios from "axios";
import { setTokenHeader } from "../common/api";

const AuthContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "SIGNIN":
            return { ...state, isLoggedIn: true, user: action.payload };
        case "LOGOUT":
            return { ...state, isLoggedIn: false, user: null };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(reducer, {
        user: null,
        isLoggedIn: false,
    });

    const tryLocalSignin = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const { email, id } = jwt(token);
                dispatch({ type: "SIGNIN", payload: { email, id } });
            }
            // set token to axios
            setTokenHeader(token);
        } catch (e) {
            console.log(e);
        }
    };

    const signup = async (username, email, password) => {
        return new Promise(async (res, rej) => {
            try {
                // send axios call
                const response = await axios.post("http://10.0.2.2:8081/api/register", {
                    username,
                    email,
                    password,
                });

                if (response.data) {
                    const { token, email, id } = response.data;

                    // set item in Local Storage
                    await AsyncStorage.setItem("token", token);

                    //  set email to store
                    dispatch({ type: "SIGNIN", payload: { email, id } });

                    //  set token to axios defaults
                    setTokenHeader(token);
                    return res();
                } else {
                    return rej({ error: "Something Went Wrong!" });
                }
            } catch (e) {
                console.log(e);
                return rej({ error: "Something Went Wrong!" });
            }
        });
    };

    const signin = (email, password) => {
        return new Promise(async (res, rej) => {
            try {
                // send axios call
                const response = await axios.post("http://10.0.2.2:8081/api/login", {
                    email,
                    password,
                });

                if (response.data) {
                    const { token, email, id } = response.data;

                    // set item in Local Storage
                    await AsyncStorage.setItem("token", token);

                    //  set email to store
                    dispatch({ type: "SIGNIN", payload: { email, id } });

                    //  set token to axios defaults
                    setTokenHeader(token);
                    return res();
                } else {
                    return rej({ error: "Something Went Wrong!" });
                }
            } catch (e) {
                console.log(e);
                return rej({ error: "Something Went Wrong!" });
            }
        });
    };

    const logout = async () => {
        dispatch({ type: "LOGOUT" });
        await AsyncStorage.removeItem("token");
        setTokenHeader(false);
    };

    const forgot = async email => {
        return new Promise(async (res, rej) => {
            try {
                // send axios call
                const response = await axios.post("http://10.0.2.2:8081/api/user/forgot", {
                    email,
                });

                return res({ message: response.data.message });
            } catch (e) {
                console.log(e);
                return rej({ error: "Something Went Wrong!" });
            }
        });
    };

    const contextValue = useMemo(
        () => ({ state, tryLocalSignin, signin, signup, logout, forgot }),
        [ state, tryLocalSignin, signin, signup, logout, forgot ]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
