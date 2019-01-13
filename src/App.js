import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './App.module.scss';
import { capitalize } from 'lodash';
import { let_, keymap } from './utils';
import { Game } from './game/Game';

let _dim = () => let_((x = document.documentElement) =>
  keymap(['width', 'height'], s => x[`client${capitalize(s)}`]));

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {dimension: {}};
    window.onresize = _ => this.setState({dimension: _dim()});
  }

  render () {return (
    <div className="row" styleName="root"> 
      <Game dimension={this.state.dimension} /> </div>
  )};
}

export default CSSModules(App, styles);
