import React, { Component } from 'react';
import s from './ConnectionWires.css';

class ConnectionWires extends Component {
  getWires() {
    const { root, connections } = this.props;
    if (!root) return;
    const containerTop = root.top;
    const containerLeft = root.left;

    return Object.keys(connections).map((key) => {
      const { source, targets, color } = connections[key];
      if (!source) return;
      const sourceBB = source.getBoundingClientRect();
      const halfSourceSize = source.offsetWidth / 2;
      const sourceCoordinates = {
        x: (sourceBB.left + halfSourceSize) - containerLeft,
        y: (sourceBB.top + halfSourceSize) - containerTop
      };
      return targets.map((target) => {
        if (!target || !target.parentNode) return;
        const targetBB = target.getBoundingClientRect();
        const halfTargetSize = target.offsetWidth / 2;
        const targetCoordinates = {
          x: (targetBB.left + halfTargetSize) - containerLeft,
          y: (targetBB.top + halfTargetSize) - containerTop
        };

        if (targetCoordinates.x < 0 || targetCoordinates.y < 0) return;
        return (
          <line key={target.id}
                x1={sourceCoordinates.x} y1={sourceCoordinates.y}
                x2={targetCoordinates.x} y2={targetCoordinates.y}
                stroke={color} className={s.line}
          />
        )
      });
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