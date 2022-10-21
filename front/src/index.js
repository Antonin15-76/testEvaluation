import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';
import { frFR as coreFrFR } from '@material-ui/core/locale'
import { frFR } from '@material-ui/data-grid'

const theme = responsiveFontSizes(
  createTheme(
    {
      palette: {
        primary: {
          light: '#83C9D7',
          main: '#e61919',
          dark: '#2296AE',
          contrastText: '#fff'
        },
        secondary: {
          light: '#64b5f6',
          main: '#6FA0F5',
          dark: '#1976d2',
          contrastText: '#fff'
        }
      }
    },
    frFR,
    coreFrFR
  )
)

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App /> 
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
