import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { assign } from 'lodash';
import { keymap } from 'utils';
import styles from './Item.module.scss';

let _convert = s => (s === 'left'   ? 'x' :
                     s === 'bottom' ? 'y' :
                     s);

const STYLES = {
  harold:   {backgroundColor: 'red'},
  platform: {backgroundColor: 'grey'}
};

class _Item extends Component {
  render () {return (
    <div className="float"
         style={assign(keymap(['width', 'height', 'left', 'bottom'],
                       s => this.props.opts[_convert(s)]), STYLES[this.props.type])}>
    </div>
  )};
}

export let Item = CSSModules(_Item, styles);
