import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./styles.css";
import sessionStore from "./store/sessionStore";
import App from "./views/app/App";

ReactDOM.render(
    <Provider store={sessionStore}>
        <App />
    </Provider>
    , document.getElementById("root"));
