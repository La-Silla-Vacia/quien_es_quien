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
    this.wires[i].setAttribute('height', 5);
    const el = document.getElementById(id);
    if (el) el.setAttribute('data-open', true);
  };

  handleMouseLeave = (i, id) => {
    this.wires[i].setAttribute('height', 2);
    const el = document.getElementById(id);
    if (el) el.removeAttribute('data-open');
  };

  mapTargets(targets, sourceCoordinates, containerOffset, color) {
    return targets.map((targetObj, i) => {
      const target = targetObj.el;
      const description = targetObj.relationDescription;
      if (!target || !target.parentNode) return;
      const targetBB = target.getBoundingClientRect();
      const halfTargetSize = target.offsetWidth / 2;
      const targetCoordinates = {
        x: (targetBB.left + halfTargetSize) - containerOffset.left,
        y: (targetBB.top + halfTargetSize) - containerOffset.top
      };

      const a = targetCoordinates.x - sourceCoordinates.x;
      const b = targetCoordinates.y - sourceCoordinates.y;

      const length = Math.sqrt( a*a + b*b );
      const angleDeg = Math.atan2(targetCoordinates.y - sourceCoordinates.y, targetCoordinates.x - sourceCoordinates.x) * 180 / Math.PI;

      if (targetCoordinates.x < 0 || targetCoordinates.y < 0) return;
      return (
        <rect key={target.id} width={length} height={2}
              style={{transform: `rotate(${angleDeg}deg)` }}
              x={sourceCoordinates.x} y={sourceCoordinates.y}
              ref={(ref) => {this.wires[`${target.id}-${i}`] = ref}}
              onMouseEnter={this.handleMouseEnter.bind(false, `${target.id}-${i}`, target.id)}
              onMouseLeave={this.handleMouseLeave.bind(false, `${target.id}-${i}`, target.id)}
              title={description}
              fill={color} className={s.line}
        />
      )
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