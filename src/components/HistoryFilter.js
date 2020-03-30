import React, {useState, useEffect} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import {IconButton, TextField, Toolbar} from '@material-ui/core';
import {Clear as ClearIcon, Search as SearchIcon} from "@material-ui/icons";
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "#e2e2e2",
    },
    content: {
      width: "100%",
      flexGrow: 1,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
    },
    group: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    formElement: {
      maxWidth: 140,
      backgroundColor: theme.palette.background.default,
    },
    formDateElement: {
      maxWidth: 110,
      backgroundColor: theme.palette.background.default,
    },
    clearButton: {
    },
  }),
);

const PWTextField = (props) => {
  const classes = useStyles();
  return (
    <TextField className={classes.formElement}
               variant="outlined"
               label={props.label}
               type={props.type}
               value={props.value}
               onChange={e => props.onChange(e.target.value)}
               error={props.error}
               onBlur={props.onBlur}
    />
  );
}

const PWDatePicker = (props) => {
  const classes = useStyles();
  return (
    <DatePicker className={classes.formDateElement}
                disableFuture={true}
                autoOk={true}
                format="MM/dd/yyyy"
                inputVariant="outlined"
                variant="dialog"
                emptyLabel=""
                label={props.label}
                value={props.value}
                onChange={props.onChange}
                onOpen={props.onDateOpen}
    />
  );
};

const HistoryFilter = (props) => {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [minAmountError, setMinAmountError] = useState(false);
  const [maxAmount, setMaxAmount] = useState("");
  const [maxAmountError, setMaxAmountError] = useState(false);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [filter, setFilter] = useState({});

  const onDateOpen = (id) => {
    if (id === "dateFrom" && !dateFrom) {
      setDateFrom(new Date());
    }
    if (id === "dateTo" && !dateTo) {
      setDateTo(new Date());
    }
  }

  const onMinAmountChange = (value) => {
    setMinAmountError(false);
    setMinAmount(value);
  }
  const isMinAmountValid = (value) => {
    if (value!=="" && isNaN(value)) {
      setMinAmountError(true);
    }
  }
  const onMaxAmountChange = (value) => {
    setMaxAmountError(false);
    setMaxAmount(value);
  }
  const isMaxAmountValid = (value) => {
    if (value!=="" && isNaN(value)) {
      setMaxAmountError(true);
    }
  }

  useEffect(() => {
    if (minAmount!=="" && isNaN(minAmount)) {
      return;
    }
    if (maxAmount!=="" && isNaN(maxAmount)) {
      return;
    }
    const newFilter = {
      ...(username && {username}),
      ...(minAmount!=="" && {minAmount}),
      ...(maxAmount!=="" && {maxAmount}),
      ...(dateFrom && {dateFrom: new Date(dateFrom.toDateString())}),
      ...(dateTo && {dateTo: new Date(dateTo.toDateString())}),
    };
    if (!(Object.keys(filter).length === 0 && Object.keys(newFilter).length === 0)) {
      setFilter(newFilter);
      props.onFilter(newFilter);
    }
  }, [username, minAmount, maxAmount, dateFrom, dateTo]);

  const onClear = () => {
    if (username) {
      setUsername("");
    }
    if (minAmount!=="") {
      setMinAmount("");
    }
    if (maxAmount!=="") {
      setMaxAmount("");
    }
    if (dateFrom) {
      setDateFrom(null);
    }
    if (dateTo) {
      setDateTo(null);
    }
    setMinAmountError(false);
    setMaxAmountError(false);
  }

  return (
    <Toolbar className={classes.root}>
      <div className={classes.content}>
        <SearchIcon />
        <PWTextField
         label="Correspondent"
         type="text"
         value={username}
         id="username"
         onChange={setUsername}
        />
        <div className={classes.group}>
          <PWTextField
            label="Min Amount"
            type="text"
            value={minAmount}
            error={minAmountError}
            onChange={onMinAmountChange}
            onBlur={e => {isMinAmountValid(e.target.value)}}
          />
          <PWTextField
            label="Max Amount"
            type="text"
            value={maxAmount}
            error={maxAmountError}
            onChange={onMaxAmountChange}
            onBlur={e => {isMaxAmountValid(e.target.value)}}
          />
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div className={classes.group}>
            <PWDatePicker
              label="Date from"
              value={dateFrom}
              onChange={setDateFrom}
              onOpen={() => {onDateOpen("dateFrom")}}
            />
            <PWDatePicker
              label="Date to"
              value={dateTo}
              onChange={setDateTo}
              onOpen={() => {onDateOpen("dateTo")}}
            />
          </div>
        </MuiPickersUtilsProvider>
        <IconButton
          edge="start"
          className={classes.clearButton}
          color="inherit"
          onClick = {onClear}
        >
          <ClearIcon />
        </IconButton>

      </div>
    </Toolbar>
  );
}
HistoryFilter.propTypes = {
  onFilter: PropTypes.func.isRequired
}

export default HistoryFilter;
