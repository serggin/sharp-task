import React from 'react';
import {inject, observer} from'mobx-react';


import Login from "../screens/Login";
import Register from "../screens/Register";
import Logged from "../screens/Logged";
import Create from "../screens/Create";
import History from "../screens/History";

const MainContent = inject("store")(
  observer(({store}) => {
    const { screen } = store;

    return (
      <React.Fragment>
        {screen === "LOGIN" && <Login />}
        {screen === "REGISTER" && <Register />}
        {screen === "LOGGED" && <Logged />}
        {screen === "CREATE" && <Create />}
        {screen === "HISTORY" && <History />}
      </React.Fragment>
    );
  })
);

export default MainContent;
