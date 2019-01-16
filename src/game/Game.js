import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Game.module.scss';
import { toArray, sum } from 'lodash';
import { map, filter } from 'lodash/fp';
import { when, let_, bool, comp, transpose, keymap } from 'utils';
import { Harold } from './harold/Harold';

const DIR = {
  37: 'w',
  38: 'n',
  39: 'e',
  40: 's',
};
const SHIFT = {
  w: [-1,  0],
  n: [ 0, -1],
  e: [ 1,  0],
  s: [ 0,  1],
};
const SPEED = 5;

let _coord = f => keymap(['x', 'y'], f);
let _shift = comp(map(sum), transpose, map(s => SHIFT[s]), filter(bool), toArray);

class _Game extends Component {
  directions = new Set();
  shift = [];

  constructor (props) {
    super(props);
    this.state = {center: {x: 0, y: 0}};
  }

  componentDidMount () {this.redraw()}

  setDir = b => ({keyCode}) => let_((x=DIR[keyCode]) => {
    when(!(b && this.directions.has(x)), () => {          // avoid repetitive keydown calls
      this.directions[b ? 'add' : 'delete'](x);
      this.shift = _shift(this.directions);
    });
  });

  redraw = () => {
    this.setState({center: _coord((s, i) => this.state.center[s]+(this.shift[i]||0)*SPEED)});
    requestAnimationFrame(this.redraw);
  };

  render () {return (
    <div className="full anchor" tabIndex="0" onKeyDown={this.setDir(true)} onKeyUp={this.setDir(false)}>
      <Harold center={this.state.center} /> </div>
  )};
}

export let Game = CSSModules(_Game, styles);
