import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Game.module.scss';
import { Harold } from './harold/Harold';

class _Game extends Component {
  render () {return (
    <div className="full"> <Harold /> </div>
  )};
}

export let Game = CSSModules(_Game, styles);
