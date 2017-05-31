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

        const a = targetCoordinates.x - sourceCoordinates.x;
        const b = targetCoordinates.y - sourceCoordinates.y;

        const length = Math.sqrt( a*a + b*b );
        const angleDeg = Math.atan2(targetCoordinates.y - sourceCoordinates.y, targetCoordinates.x - sourceCoordinates.x) * 180 / Math.PI;

        if (targetCoordinates.x < 0 || targetCoordinates.y < 0) return;
        return (
          <rect key={target.id} width={length} height={1}
                style={{transform: `rotate(${angleDeg}deg)` }}
                x={sourceCoordinates.x} y={sourceCoordinates.y}
                fill={color} className={s.line}
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