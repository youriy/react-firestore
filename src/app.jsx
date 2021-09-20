import ReactDOM from "react-dom";
import React from "react";
import ClippedDrawer from "./components/ClippedDrawer.jsx";
import { SnackbarProvider } from "notistack";
import "./sass/main.scss";

ReactDOM.render(
    <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
    >
        <ClippedDrawer />
    </SnackbarProvider>,
    document.getElementById("app")
);
