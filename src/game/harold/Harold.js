import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { keymap } from 'utils';
import styles from './Harold.module.scss';

let _convert = s => (s === 'left'   ? 'x' :
                     s === 'bottom' ? 'y' :
                     s);

class _Harold extends Component {
  render () {return (
    <div styleName="brick" className="float"
         style={{...keymap(['width', 'height', 'left', 'bottom'],
                           s => this.props.opts[_convert(s)])}}> </div>
  )};
}

export let Harold = CSSModules(_Harold, styles);
