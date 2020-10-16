import React from 'react';

const Total = props => (
  <>
    <span className="text-muted">
      {props.label}:
    </span> <strong style={{ fontSize: '105%' }}>
      {new Intl.NumberFormat().format(props.value)}
    </strong>
  </>
);

export default Total;