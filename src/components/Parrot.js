import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import logo from '../assets/images/parrot.png';

const useStyles = makeStyles(theme => ({
  largeLogo: {
    padding: 20
  },
  largeLogoImg: {
    maxWidth: "100%"
  },
}));

const Parrot = () => {
  const classes = useStyles();
 return (
   <div className={classes.largeLogo}>
     <img className={classes.largeLogoImg} src={logo} alt=""/>
   </div>
 );
}

export default Parrot;
