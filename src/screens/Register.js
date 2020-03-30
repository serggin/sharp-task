import React, { useEffect, useState } from 'react';
import { inject, observer } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Typography } from '@material-ui/core';

import Parrot from "../components/Parrot";
import ParrotWings from "../components/ParrotWings";
import {register} from "../api";
import {ValidateEmail} from "../components/utils";

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
    width: "50%"
  },
  right: {
    display: "flex",
    flexGrow: 1,
    width: "50%",
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
  buttons: {
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    height: 56,
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "1.4em"
  },
  buttonRegister: {
    flex: 3,
    marginRight:  theme.spacing(2)
  },
  buttonCancel: {
    flex: 1,
    marginLeft:  theme.spacing(2)
  }
}));

const Register = inject("store")(
  observer(({store}) => {
    const { setToken, setShowHeader, setScreen } = store;

    const classes = useStyles();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [emailError, setEmailError] = useState(false);

    const [error, setError] = useState("");


    const onNameChange = (value) => {
      if (value !== name) {
        setName(value);
      }
    }
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
    const onPassword2Change = (value) => {
      const trimmedValue = value.trim();
      if (trimmedValue !== password2) {
        setPassword2(trimmedValue);
      }
    }
    const isEmailValid = () => {
      if (ValidateEmail(email)) {
        setEmailError(false);
      } else {
        setEmailError(true);
        setError("Invalid email address");
       }
    }

    const submitDisabled = () => !(name.trim() && email && password && password2 && !error);
    const onSubmit = () => {
      if (password === password2) {
        register({username: name.trim(), email, password})
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
      } else {
        setError("Passwords are different!");
      }
    }
    const onCancel = () => {
      setScreen('LOGIN');
    }

    useEffect(() => {
      setError("");
    }, [name, email, password, password2]);

    return (
      <div className={classes.root}>
        <div className={classes.left}>
          <Parrot />
        </div>
        <div className={classes.right}>
          <div className={classes.rightTop}><ParrotWings/></div>
          <div className={classes.rightMain}>
            <div className={classes.rightCenter}>
              <Typography variant="h3" gutterBottom>Register</Typography>
              <form className={classes.form}>
                <TextField className={classes.formElement}
                           required
                           variant="outlined"
                           label="Name"
                           type="text"
                           fullWidth
                           value={name}
                           onChange={e => onNameChange(e.target.value)}
                />
                <TextField className={classes.formElement}
                           required
                           variant="outlined"
                           label="Email Address"
                           type="email"
                           fullWidth
                           value={email}
                           error={emailError}
                           onChange={e => onEmailChange(e.target.value)}
                           onBlur={isEmailValid}
                />
                <TextField className={classes.formElement}
                           required
                           variant="outlined"
                           label="Password"
                           type="password"
                           fullWidth
                           value={password}
                           onChange={e => onPasswordChange(e.target.value)}
                />
                <TextField className={classes.formElement}
                           required
                           variant="outlined"
                           label="Repeat Password"
                           type="password"
                           fullWidth
                           value={password2}
                           onChange={e => onPassword2Change(e.target.value)}
                />
                <div className={classes.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button+" "+classes.buttonRegister}
                    disabled={submitDisabled()}
                    onClick={onSubmit}
                  >
                    Register
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button+" "+classes.buttonCancel}
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
              <div className={classes.message}>
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

export default Register;
