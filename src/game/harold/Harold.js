import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Harold.module.scss';

class _Harold extends Component {
  render () {return (
    <div styleName="brick"> </div>
  )};
}

export let Harold = CSSModules(_Harold, styles);
