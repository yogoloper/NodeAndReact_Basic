import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>

          {/* 아래와 같은 형식으로 라우팅 하고 싶었으나 렌더링이 되지 않음 */}
          {/* <Route exact path="/" components = {LandingPage} />
          <Route exact path="/login" components = {LoginPage} />
          <Route exact path="/register" components = {RegisterPage} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
