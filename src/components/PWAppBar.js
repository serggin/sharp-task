import React, {useState} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {inject, observer} from "mobx-react";
import {AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography} from "@material-ui/core";
import {Menu as MenuIcon, Create as CreateIcon, History as HistoryIcon} from "@material-ui/icons";

import PW_Logo from '../assets/images/PW_Logo.png';
import pw_money from '../assets/images/pw_money.png';
import user_dummy from '../assets/images/user_dummy.png';


const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    pwLogo: {
    },
    balance: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    pw_money: {
      marginLeft:  theme.spacing(1)
    },
    logout: {
      color: theme.palette.background.default,
      borderColor: theme.palette.background.default,
      fontWeight: "bold",
      marginLeft:  theme.spacing(2)
    }
  }),
);


const PWAppBar = inject("store")(
  observer(({store}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const {title, user, setScreen, setShowHeader, setUser} = store;

    const menuItems = [
      {caption: "Create", screen: "CREATE", icon: CreateIcon},
      {caption: "History", screen: "HISTORY", icon: HistoryIcon},
    ];

    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleMenuClick = (screen) => {
      setScreen(screen);
      handleClose();
    };
    const onLogout = () => {
      setUser({name: "", balance: 0});
      setShowHeader(false);
      setScreen('LOGIN');
    }

    const menuGroup = (
      <React.Fragment>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick = {e => setAnchorEl(e.currentTarget)}
        >
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {menuItems.map(item => {
            return (
              <MenuItem
                key={item.screen}
                onClick={() => {handleMenuClick(item.screen)}}
              >
                {item.icon && <item.icon />}
                {item.caption}
              </MenuItem>
            )})}
        </Menu>
      </React.Fragment>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {menuGroup}
            <div className={classes.pwLogo}>
              <img src={PW_Logo} alt="" />
            </div>
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
            <div className={classes.balance}>
              <Typography variant="h5" className={classes.title}>
                {user.balance}
              </Typography>
              <div className={classes.pw_money}>
                <img src={pw_money} alt="" />
              </div>
              <div className={classes.pw_money}>
                <img src={user_dummy} alt="" />
              </div>
              <Typography variant="h5" className={classes.title}>
                {user.name}
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.logout}
              onClick={onLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );

  })
);

export default PWAppBar;
