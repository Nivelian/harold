import React, { Component, createRef } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Game.module.scss';
import { toArray, sum, assign, isEqual } from 'lodash';
import { filter } from 'lodash/fp';
import { when, let_, bool, comp, fitBounds } from 'utils';
import { Harold } from './harold/Harold';

const [MAX_SPEED, ACC] = [5, .2];
const X_DIR = {37: -1, 39: 1};

const [HAROLD_W, HAROLD_H] = [40, 40];

let _compose = comp(sum, filter(bool), toArray);

class _Game extends Component {
  xDirections = new Set();
  dir   = {x: 0, y: -1};
  speed = {x: 0, y: 0};
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
      o => this._setState({max: {x: o.width - HAROLD_W, y: o.height - HAROLD_H}}))}

  _setSpeed = k => let_((dir=this.dir[k], v=this.speed[k]) => {
    let [low, high] = [this.harold[k] <= 0, this.harold[k] >= this.max[k]];
    let brake = -(ACC/2 > Math.abs(v) ? v : ACC*Math.sign(v)/2);
    let diff = (dir !== 0 ? ACC*dir : brake);
    this.speed[k] = (v && (low || high)) ? 0 : fitBounds(-MAX_SPEED , MAX_SPEED, v+diff);
  });

  setY = b => {this.dir.y = (b ? 1 : -1)};
  setX = (code, b) => let_((x=X_DIR[code]) =>
    when(!(b && this.xDirections.has(x)), () => {
      this.xDirections[b ? 'add' : 'delete'](x);
      this.dir.x = _compose(this.xDirections);
    }));
  setDir = b => ({keyCode}) => (keyCode === 32 ? this.setY(b) : this.setX(keyCode, b));

  redraw = () => {
    ['x', 'y'].forEach(k => {
      this._setSpeed(k);
      this._setHarold({[k]: fitBounds(0, this.max[k], this.harold[k] + this.speed[k])});
    });
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
