import React from 'react';

const Total = props => (
  <div>
    <span className="text-muted">{props.label}:</span> <strong style={{ fontSize: '115%' }}>{new Intl.NumberFormat().format(props.value)}</strong>
  </div>
);

export default Total;