import React from "react";

import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import { AuthProvider } from "./src//context/AuthContext";

import Navigation from "./src/components/Navigation";
import AuthResolver from "./src/components/AuthResolver";

export default function App() {
    return (
        <React.Fragment>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.dark}>
                <AuthProvider>
                    <AuthResolver>
                        <Navigation />
                    </AuthResolver>
                </AuthProvider>
            </ApplicationProvider>
        </React.Fragment>
    );
}
