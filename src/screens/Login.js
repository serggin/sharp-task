import React, { useEffect, useState } from 'react';
import { inject, observer } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Link, TextField, Typography } from '@material-ui/core';

import Parrot from "../components/Parrot";
import ParrotWings from "../components/ParrotWings";
import {login} from "../api";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: theme.palette.background.default,
    width: "100%",
  },
  left: {
    flexGrow: 1,
    width: "45%"
  },
  right: {
    display: "flex",
    flexGrow: 1,
    width: "45%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%"
  },
  rightTop:{
    alignSelf: "flex-end",
    marginRight: 40
  },
  rightMain:{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightCenter:{
    display: "flex",
    flexDirection: "column",
  },
  form: {
    width: "83%",
    height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  formElement: {
    marginTop: 10,
    marginBottom: 10,
    height: 56
  },
  message: {
    height: 56,
    marginTop: 10,
    marginBottom: 10,
  },
  rightError:{
    height: 56,
    width: "83%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  error: {
    height: 56,
    lineHeight: "56px",
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  },
  button : {
    marginTop: 10,
    marginBottom: 10,
    height: 56,
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "1.4em"
  }
}));

const Login = inject("store")(
  observer(({store}) => {
    const { setToken, setShowHeader, setScreen } = store;

    const classes = useStyles();

    //const [email, setEmail] = useState("serggin@yandex.ru");
    //const [password, setPassword] = useState("sharp");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const onEmailChange = (value) => {
      const trimmedValue = value.trim();
      if (trimmedValue !== email) {
        setEmail(trimmedValue);
      }
    }
    const onPasswordChange = (value) => {
      const trimmedValue = value.trim();
      if (trimmedValue !== password) {
        setPassword(trimmedValue);
      }
    }
    const submitDisabled = () => !(email && password);
    const onSubmit = () => {
      login({email, password})
        .then(result => {
          const { id_token, message } = result;
          if (id_token) {
            setToken(id_token);
            //Next screen
            setShowHeader(true);
            setScreen('LOGGED');
          } else {
            setError(message);
          }
        });
    }
    const goRegister = () => {
      setScreen('REGISTER');
    }

    useEffect(() => {
      setError("");
    }, [email, password]);

    return (
      <div className={classes.root}>
        <div className={classes.left}>
          <Parrot />
        </div>
        <div className={classes.right}>
          <div className={classes.rightTop}><ParrotWings/></div>
          <div className={classes.rightMain}>
            <div className={classes.rightCenter}>
              <Typography variant="h3" gutterBottom>Log In</Typography>
              <form className={classes.form}>
                <TextField className={classes.formElement}
                  variant="outlined"
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={e => onEmailChange(e.target.value)}
                />
                <TextField className={classes.formElement}
                  variant="outlined"
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={e => onPasswordChange(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={classes.button}
                  disabled={submitDisabled()}
                  onClick={onSubmit}
                >
                  Login
                </Button>

              </form>
              <div className={classes.message}>
                {!error &&
                  <Typography variant="body1">
                    Not a member yet? <br />
                    Welcome onboard - <Link href="#" onClick={goRegister}>Register</Link> now!
                  </Typography>
                }
                <div className={classes.rightError}>
                  {error && <div className={classes.error}>{error}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })
);

export default Login;
