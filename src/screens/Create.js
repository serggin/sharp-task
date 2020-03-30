import React, {useState, useEffect} from 'react';
import { inject, observer } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import {Button, CircularProgress, TextField, Typography} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {getUsersList, createTransaction} from "../api";
import TransListDialog from "./TransListDialog";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  error: {
    width: "50%",
    winWidth: 480,
    height: 56,
    lineHeight: "56px",
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  },
  form: {
    width: "50%",
    winWidth: 480,
    height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  autocomplete: {
    position: "relative"
  },
  circular: {
    position: "absolute",
    top:28,
    left: 100
  },
  buttons: {
    marginTop: 10,
    marginBottom: 10,
    //width: "83%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button : {
    marginTop: 10,
    marginBottom: 10,
    height: 56,
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "1.4em"
  },
  buttonCommit: {
    flex: 3,
    marginRight:  theme.spacing(2)
  },
  buttonClear: {
    flex: 1,
    marginLeft:  theme.spacing(2)
  }
}));

const Create = inject("store")(
  observer(({store}) => {
    const classes = useStyles();

    const { balance, setBalance, id_token } = store;

    const [userOptions, setUserOptions] = useState({options: []});
    const [recipient, setRecipient] = useState("");
    const [recipientOpen, setRecipientOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [amountError, setAmountError] = useState("");
    const [inProgress, setInProgress] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
      setError("");
    }, [recipient, amount]);

    useEffect(() => {
      setRecipientOpen(filter !== recipient);
    }, [filter, recipient]);

    const onFilterChange = (value) => {
      setFilter(value);
      if (!value) {
        return;
      }
      setInProgress(true);
      getUsersList(id_token, value)
        .then(result => {
          setInProgress(false);
          const { data, message } = result;
          if (data && Array.isArray(data) && data.length) {
            setUserOptions({options: data.map(item => item.name)});
          }
          if (message) {
            setError(message);
          }

        });
    }

    const onRecipientChange = (value) => {
      setRecipient(value);
     }


    const onAmountChange = (strvalue) => {
      const value = Number(strvalue);
      if (value < 0) {
        setAmountError("Value cannot be negative");
      } else
      if (value > balance) {
        setAmountError("Value cannot be more than your balance");
      } else {
        setAmountError("");
        setAmount(value);
      }
    }

    const submitDisabled = () => !(
      recipient &&
      amount &&
      !amountError
    );
    const onSubmit = () => {
      setInProgress(true);
      createTransaction(id_token, recipient, amount)
        .then(result => {
          setInProgress(false);
          const { data, message } = result;
          if (data) {
            setBalance(data.trans_token.balance);
            onClear();
          }
          if (message) {
            setError(message);
          }
        });
    }

    const onClear = () => {
      setFilter("");
      setRecipient("");
      setAmountError("");
      setAmount("");
    }

    const onChoose = () => {
      setModalOpen(true);
    }

    const onRowClick = (row) => {
      if (row) {
        const {username, amount} = row;
        setRecipient(username);
        setFilter(username);
        setAmount(amount);
      }
      setModalOpen(false);
    }

    return (
      <div className={classes.root}>
        <Typography variant="h3" gutterBottom>Create a Transaction</Typography>
        <form className={classes.form}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            className={classes.button}
            onClick={onChoose}
          >
            Choose from Transactions
          </Button>
          {modalOpen && <TransListDialog onRowClick={onRowClick}/>}
          <div className={classes.autocomplete}>
            <Autocomplete
              {...userOptions}
              id="auto-complete"
              autoComplete
              autoSelect
              value={filter}
              open={filter.length>0 && recipientOpen}
              renderInput={params =>
                <TextField {...params}
                           label="Recepient"
                           required
                           variant="outlined"
                           margin="normal" />}
              onInputChange={(event, value, reason) => {
                onFilterChange(value);
              }}
              onChange={(event, value, reason) => {
                onRecipientChange(value);
              }}
            />
            <div className={classes.circular}>
              {inProgress && <CircularProgress />}
            </div>
          </div>
          <TextField className={classes.formElement}
                     required
                     variant="outlined"
                     label="Amount"
                     type="number"
                     fullWidth
                     value={amount}
                     error={!!amountError}
                     helperText={amountError}
                     onChange={e => onAmountChange(e.target.value)}
          />
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button+" "+classes.buttonCommit}
              disabled={submitDisabled()}
              onClick={onSubmit}
            >
              Commit
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button+" "+classes.buttonClear}
              onClick={onClear}
            >
              Clear
            </Button>
          </div>

        </form>
        {error && <div className={classes.error}>{error}</div>}
      </div>
    );
  })
);

export default Create;
