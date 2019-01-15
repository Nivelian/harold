import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Game.module.scss';
import { keymap } from 'utils';
import { Harold } from './harold/Harold';

const direction = [
  
]

//const SPEED = 0.05;
let _coord = f => keymap(['x', 'y'], f);

class _Game extends Component {

  constructor (props) {
    super(props);
    this.state = {center: {x: 0, y: 0}};
  }

  componentDidMount () {this.redraw()}

  redraw = () => {
    //this.setState({center: _center(this.state.center, this.mouse)});
    requestAnimationFrame(this.redraw);
  };

  render () {return (
    <div className="full anchor"> <Harold center={this.state.center} /> </div>
  )};
}

export let Game = CSSModules(_Game, styles);
