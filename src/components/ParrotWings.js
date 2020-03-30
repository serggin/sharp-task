import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wings: {
    padding: theme.spacing(1),
    color: "#009ee0",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "right",
  },
}));

const ParrotWings = () => {
  const classes = useStyles();
  return (
    <div className={classes.wings}>
      {"Parrot Wings"}
    </div>
  );
}

export default ParrotWings;
