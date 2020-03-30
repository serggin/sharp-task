import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { getUserInfo } from "../api";
import feather from '../assets/images/feather.png';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  feather: {
    padding: theme.spacing(2)
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
  },
  error: {
    height: 56,
    lineHeight: "56px",
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  },
}));

const Logged = inject("store")(
  observer(({store}) => {
    const classes = useStyles();

    const { setUser, id_token } = store;
    const [error, setError] = useState("");

    getUserInfo(id_token)
      .then(result => {
        const { name, balance, message } = result;
        if (name) {
          setUser({ name, balance: Number(balance) });
        } else {
          setError(message);
        }
      });


    return (
      <div className={classes.root}>
        <div className={classes.feather}>
          <img src={feather} alt=""/>
        </div>
        <div className={classes.main}>
          <Typography variant="h4" gutterBottom>Welcome to Parrot Wings!</Typography>
          <Typography variant="body1" gutterBottom>
            To go ahead, please select option from menu.
          </Typography>
          {error && <div className={classes.error}>{error}</div>}
        </div>
      </div>
    );
  })
);

export default Logged;
