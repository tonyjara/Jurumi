import Head from "next/head";
import React from "react";
import DrawerWithTopBar from "../components/Nav/DrawerWithTopBar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DrawerWithTopBar>
            <Head>
                <title>
                    JURUMI {process.env.NODE_ENV === "development" ? "DEV" : ""}
                </title>
            </Head>
            {children}
        </DrawerWithTopBar>
    );
};

export default RootLayout;
