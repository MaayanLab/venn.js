import React from 'react';
import ReactDOM from 'react-dom';
import VennJSComponent from '../src';

ReactDOM.render(
  <VennJSComponent
    width={800}
    height={200}
    sets={[
      {sets: ['A'], size: 12},
      {sets: ['B'], size: 12},
      {sets: ['C'], size: 12},
      {sets: ['A','B'], size: 3},
      {sets: ['A','C'], size: 3},
      {sets: ['C','B'], size: 3},
      {sets: ['A','B','C'], size: 3},
    ]}
    tooltip={(datum, ind) => `${datum.size}`}
    onClick={(datum, ind) => console.log(`(${JSON.stringify(datum)}, ${ind})`)}
  />,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
