import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './App.module.scss';

class App extends Component {
  render () {return (
    <div className="centered" styleName="root"> 
      <span> Harold is ready to rock! </span> </div>
  )};
}

export default CSSModules(App, styles);
