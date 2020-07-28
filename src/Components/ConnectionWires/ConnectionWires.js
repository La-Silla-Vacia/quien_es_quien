import React, { Component } from 'react';
import s from './ConnectionWires.css';

class ConnectionWires extends Component {
  wires = [];

  getWires() {
    const { root, connections } = this.props;
    if (!root) return;
    const containerOffset = {
      top: root.top,
      left: root.left
    };

    return Object.keys(connections).map((key) => {
      const { source, targets, color } = connections[key];
      if (!source) return;
      const sourceBB = source.getBoundingClientRect();
      const halfSourceSize = source.offsetWidth / 2;
      const sourceCoordinates = {
        x: (sourceBB.left + halfSourceSize) - containerOffset.left,
        y: (sourceBB.top + halfSourceSize) - containerOffset.top
      };
      return this.mapTargets(targets, sourceCoordinates, containerOffset, color)
    });
  }

  handleMouseEnter = (i, id) => {
    this.wires[i].setAttribute('stroke-width', 5);
    const el = document.getElementById(id);
    if (el) el.setAttribute('data-open', true);
  };

  handleMouseLeave = (i, id) => {
    this.wires[i].setAttribute('stroke-width', 2);
    const el = document.getElementById(id);
    if (el) el.removeAttribute('data-open');
  };

  mapTargets(targets, sourceCoordinates, containerOffset, color) {
    return targets.map((targetObj, i) => {
      const target = targetObj.el;
      if (!target || !target.parentNode) return;
      const targetBB = target.getBoundingClientRect();
      const halfTargetSize = target.offsetWidth / 2;
      const targetCoordinates = {
        x: (targetBB.left + halfTargetSize) - containerOffset.left,
        y: (targetBB.top + halfTargetSize) - containerOffset.top
      };

      if (targetCoordinates.x < 0 || targetCoordinates.y < 0) return;
      return <line key={target.id} height={2}
                   strokeWidth={2} stroke={color}
                   x1={sourceCoordinates.x} y1={sourceCoordinates.y} x2={targetCoordinates.x} y2={targetCoordinates.y}
                   ref={(ref) => {this.wires[`${target.id}-${i}`] = ref}}
                   onMouseEnter={this.handleMouseEnter.bind(false, `${target.id}-${i}`, target.id)}
                   onMouseLeave={this.handleMouseLeave.bind(false, `${target.id}-${i}`, target.id)}
                   fill={color} className={s.line} />
    });
  }

  render() {
    const { width, height } = this.props;
    const wires = this.getWires();

    return (
      <svg className={s.container} width={width} height={height}>
        {wires}
      </svg>
    )
  }
}

export default ConnectionWires;