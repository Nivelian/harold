import React, { Component, createRef } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Game.module.scss';
import { find, findLast, toArray, sum, assign, isEqual } from 'lodash';
import { filter } from 'lodash/fp';
import { when, let_, bool, comp, fitBounds } from 'utils';
import { Item } from './item/Item';

const [MAX_SPEED, ACC] = [5, .2];
const X_DIR = {37: -1, 39: 1};

const HAROLD = {
  width:  40,
  height: 40,
};

let _compose = comp(sum, filter(bool), toArray);
let _conv = s => (s === 'x' ? 'width' :
                  s === 'y' ? 'height' :
                  s);
let _rev = s => (s === 'x' ? 'y' : 'x');

class XY {constructor (x=0, y=0) {this.x = x;  this.y = y}}
class GameObj extends XY {constructor (width, height, x, y) {
  super(x, y);          // assume center of coordinates is on the left bottom corner
  this.width = width;  this.height = height}}

class _Game extends Component {
  xDirections = new Set();
  dir   = new XY(0, -1);
  speed = new XY();
  _screen;
  platforms = [
    [50, 20, 200, 200],
  ].map(xs => new GameObj(...xs));

  constructor (props) {
    super(props);
    this.state = {max:    new XY(),
                  harold: new GameObj(HAROLD.width, HAROLD.height)};
    this._screen = createRef();
  }

  componentDidMount () {
    this.redraw();
    this._screen.current.focus();
  }
  componentDidUpdate ({dim}) {
    when(!isEqual(dim, this.props.dim) && this.props.dim,
         o => this._setState({max: new XY(...['width', 'height'].map(k => o[k]-HAROLD[k]))}))}

  _setSpeed = (k, min, max) => let_((dir=this.dir[k], v=this.speed[k]) => {
    let border = this.harold[k] <= min || this.harold[k] >= max;
    let brake = -(ACC/2 > Math.abs(v) ? v : ACC*Math.sign(v)/2);
    let diff = (dir !== 0 ? ACC*dir : brake);
    this.speed[k] = (v && border) ? 0 : fitBounds(-MAX_SPEED , MAX_SPEED, v+diff);
  });

  _between = (k, o) => this.harold[k] <= o[k]+o[_conv(k)] && this.harold[k]+HAROLD[_conv(k)] >= o[k];
  _min = k => let_((o=findLast(this.platforms, x => x[k]+x[_conv(k)] <= this.harold[k])) => 
    (o && this._between(_rev(k), o) && o[k]+o[_conv(k)]) || 0);
  _max = k => let_((o=find(this.platforms, x => x[k] >= this.harold[k]+HAROLD[_conv(k)])) => 
    (o && this._between(_rev(k), o) && o[k]-HAROLD[_conv(k)]) || this.max[k]);

  redraw = () => {  
    ['x', 'y'].forEach(k => let_((min=this._min(k), max = this._max(k)) => {
      this._setSpeed(k, min, max);
      this._setHarold({[k]: fitBounds(min, max, this.harold[k] + this.speed[k])});
    }));
    requestAnimationFrame(this.redraw);
  };

  setY = b => {this.dir.y = (b ? 1 : -1)};
  setX = (code, b) => let_((x=X_DIR[code]) =>
    when(!(b && this.xDirections.has(x)), () => {
      this.xDirections[b ? 'add' : 'delete'](x);
      this.dir.x = _compose(this.xDirections);
    }));
  setDir = b => ({keyCode}) => (keyCode === 32 ? this.setY(b) : this.setX(keyCode, b));

  _setHarold = (...os) => this._setState({harold: assign(this.harold, ...os)});
  _setState = (...os) => this.setState( assign(this.state, ...os) );

  render () {return (
    <div ref={this._screen} className="full anchor" tabIndex="0"
         onKeyDown={this.setDir(true)} onKeyUp={this.setDir(false)}>
      <Item type="harold" opts={this.state.harold} />
      {this.platforms.map((x, i) => <Item key={i} type="platform" opts={x} />)}
    </div>
  )};

  get harold () {return this.state.harold}
  get max    () {return this.state.max}
}

export let Game = CSSModules(_Game, styles);
