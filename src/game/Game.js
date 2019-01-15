import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Game.module.scss';
import { isEqual } from 'lodash';
import { when } from 'utils';
import { Harold } from './harold/Harold';


class _Game extends Component {
  constructor (props) {
    super(props);
    this.state = {center: {x: 0, y: 0}};
  }

  componentDidUpdate ({dim}) {
    when(!isEqual(dim, this.props.dim),
      () => this.setState({center: {x: this.props.dim.width/2, y: this.props.dim.height/2}}));
  }

  render () {return (
    <div className="full anchor"> <Harold center={this.state.center} /> </div>
  )};
}

export let Game = CSSModules(_Game, styles);
