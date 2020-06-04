const MockDataSources = () => ['Source A', 'Source B', 'Source C', 'Source D'];
const MockAPIresponseTime = () => 1500; //ms

const MockGraphTypes = () => [
  {
    type: 'bar-chart',
    name: 'Bar Chart',
    image: './graph-images/bar-chart-1.png',
  },
  {
    type: 'scatter-plot',
    name: 'Scatter Plot',
    image: './graph-images/scatter-plot-1.png',
  },
  {
    type: 'pie-chart',
    name: 'Pie Chart',
    image: './graph-images/pie-chart-1.png',
  },
];

const MockGraphsFromType = (type) => {
  const src = {
    'bar-chart': [
      {
        type: 'bar-chart',
        name: 'Bar Chart 1',
        image: './graph-images/bar-chart-1.png',
      },
      {
        type: 'bar-chart',
        name: 'Bar Chart 2',
        image: './graph-images/bar-chart-2.png',
      },
      {
        type: 'bar-chart',
        name: 'Bar Chart 3',
        image: './graph-images/bar-chart-3.png',
      },
    ],
    'scatter-plot': [
      {
        type: 'scatter-plot',
        name: 'Scatter Plot 1',
        image: './graph-images/scatter-plot-1.png',
      },
    ],
    'pie-chart': [
      {
        type: 'pie-chart',
        name: 'Pie Chart 1',
        image: './graph-images/pie-chart-1.png',
      },
    ],
  };
  return src[type];
};

export {
  MockAPIresponseTime,
  MockDataSources,
  MockGraphTypes,
  MockGraphsFromType,
};
