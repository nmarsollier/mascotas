import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import React from 'react'
import ReactDOM from 'react-dom'
import sessionStore from "./store/sessionStore"
import App from './App'
import { Provider } from "react-redux";

ReactDOM.render(
    <Provider store={sessionStore}>
        <App />
    </Provider>
    , document.getElementById('root'))
