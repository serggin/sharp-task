import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';

import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

import './index.css';
import App from './App';
import {store} from './components/Store'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: green,
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
