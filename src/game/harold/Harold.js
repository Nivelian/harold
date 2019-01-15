import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { let_ } from 'utils';
import styles from './Harold.module.scss';

const [WIDTH, HEIGHT] = [40, 40];

class _Harold extends Component {
  render () {return (
    <div styleName="brick" style={{width: WIDTH, height: HEIGHT, ...this.pos}}> </div>
  )};

  get pos () {return let_((f=(s, x)=>this.props.center[s]-x/2) => ({marginLeft: f('x', WIDTH), marginTop: f('y', HEIGHT)}))}
}

export let Harold = CSSModules(_Harold, styles);
