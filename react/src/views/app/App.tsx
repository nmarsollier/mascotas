import React from "react";
import { HashRouter, Route } from "react-router-dom";
import LoggedInRoute from "../../common/components/LoggedInRoute";
import Info from "../../info/Info";
import NewPet from "../../pets/NewPet";
import Pets from "../../pets/Pets";
import Profile from "../../profile/Profile";
import Login from "../../user/Login";
import Password from "../../user/Password";
import Register from "../../user/Register";
import Welcome from "../../welcome/Welcome";
import Toolbar from "../../app/Toolbar"
import Menu from "../../app/Menu"
import "./App.css";

export default class App extends React.Component<{}, {}> {
  public render() {
    return (
      <HashRouter>
        <table className="app_table">
          <thead>
            <tr className="app_toolbar">
              <td colSpan={2} >
                <Toolbar />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="app_menu">
                <Menu />
              </td>
              <td id="content" className="app_content">
                <Route exact path="/" component={Welcome} />
                <Route exact path="/login" component={Login} />
                <Route path="/newUser" component={Register} />
                <LoggedInRoute path="/info" component={Info} />
                <LoggedInRoute path="/password" component={Password} />
                <LoggedInRoute path="/profile" component={Profile} />
                <LoggedInRoute path="/pets" component={Pets} />
                <LoggedInRoute path="/editPet" component={NewPet} />
                <LoggedInRoute path="/editPet/:id" component={NewPet} />
              </td>
            </tr>
          </tbody>
        </table>
      </HashRouter >
    );
  }
}
