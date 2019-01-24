import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './App.module.scss';
import { capitalize } from 'lodash';
import { let_, keymap } from 'utils';
import { Game } from 'game/Game';

let _dim = () => let_((x = document.documentElement) =>
  keymap(['width', 'height'], s => x[`client${capitalize(s)}`]));

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {dim: {width: 0, height: 0}};
    window.onresize = _ => this.setState({dim: _dim()});
  }

  componentDidMount () {window.dispatchEvent( new Event('resize') )}

  render () {return (
    <div className="row" styleName="root"> 
      <Game dim={this.state.dim} /> </div>
  )};
}

export default CSSModules(App, styles);
