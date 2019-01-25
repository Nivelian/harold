import React, { Component, createRef } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Game.module.scss';
import { toArray, sum, assign, isEqual } from 'lodash';
import { filter } from 'lodash/fp';
import { when, let_, bool, comp, fitBounds } from 'utils';
import { Harold } from './harold/Harold';

const [MAX_SPEED, ACC] = [5, .1];
const X_DIR = {37: -1, 39: 1};

const [HAROLD_W, HAROLD_H] = [40, 40];

let _compose = comp(sum, filter(bool), toArray);

class _Game extends Component {
  xDirections = new Set();
  dir = {x: 0, y: -1};
  speed = {x: {'+': 0, '-': 0}, y: {'+': 0, '-': 0}};
  _screen;

  constructor (props) {
    super(props);
    this.state = {max:    {x: 0, y: 0},
                  harold: {width: HAROLD_W, height: HAROLD_H, x: 0, y: 0}};
    this._screen = createRef();
  }

  componentDidMount () {
    this.redraw();
    this._screen.current.focus();
  }
  componentDidUpdate ({dim}) {
    when(!isEqual(dim, this.props.dim) && this.props.dim,
      o => {this._setState({max: {x: o.width - HAROLD_W, y: o.height - HAROLD_H}})})}

  setY = b => {this.dir.y = (b ? 1 : -1)}
  setX = (code, b) => let_((x=X_DIR[code]) => {
    when(!(b && this.xDirections.has(x)), () => {          // avoid repetitive keydown calls
      this.xDirections[b ? 'add' : 'delete'](x);
      this.dir.x = _compose(this.xDirections);
    });
  });
  setDir = b => ({keyCode}) => (keyCode === 32 ? this.setY(b) : this.setX(keyCode, b));

  _iteration = k => let_((low=this.harold[k] <= 0, high=this.harold[k] >= this.max[k]) => {
    when(this.dir[k] ===  1, () => {this.speed[k]['+'] = high ? 0 : Math.min(MAX_SPEED, this.speed[k]['+']+ACC)});
    when(this.dir[k] === -1, () => {this.speed[k]['-'] = low  ? 0 : Math.min(MAX_SPEED, this.speed[k]['-']+ACC)});
    when(this.dir[k] !== -1, () => {this.speed[k]['-'] = high ? 0 : Math.max(0, this.speed[k]['-']-ACC)});
    when(this.dir[k] !==  1, () => {this.speed[k]['+'] = low  ? 0 : Math.max(0, this.speed[k]['+']-ACC)});
    return this.speed[k]['+']-this.speed[k]['-'];
  });

  redraw = () => {
    ['x', 'y'].forEach(k =>
      this._setHarold({[k]: fitBounds(0, this.max[k], this.harold[k] + this._iteration(k))}));
    requestAnimationFrame(this.redraw);
  };

  _setHarold = (...os) => this._setState({harold: assign(this.harold, ...os)});
  _setState = (...os) => this.setState( assign(this.state, ...os) );

  render () {return (
    <div ref={this._screen} className="full anchor" tabIndex="0"
         onKeyDown={this.setDir(true)} onKeyUp={this.setDir(false)}>
      <Harold opts={this.state.harold} /> </div>
  )};

  get harold () {return this.state.harold}
  get max    () {return this.state.max}
}

export let Game = CSSModules(_Game, styles);
