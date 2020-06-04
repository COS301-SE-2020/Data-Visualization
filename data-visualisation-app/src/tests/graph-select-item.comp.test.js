import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import GraphSelectItem from '../graph-selection/graph-select-item.comp';

test('renders List Item representing a Graph-Type, and that sets the selected graph type once clicked', () => {
  let selectedTypeMock = '';
  const typeMock = {
    type: 'bar-chart',
    name: 'Bar Chart',
    image: './graph-images/bar-chart-1.png',
  };

  const setGraphMock = (type) => {
    selectedTypeMock = type;
  };

  const comp = <GraphSelectItem graphType={typeMock} setGraph={setGraphMock} />;
  const { queryByAltText, getByAltText } = render(comp);

  let tree = renderer.create(comp).toJSON();
  expect(tree).toMatchSnapshot();

  expect(queryByAltText(new RegExp(typeMock.type))).toBeTruthy();
  //manually trigger onClick
  fireEvent.click(getByAltText(new RegExp(typeMock.type)));

  expect(selectedTypeMock).toBe(typeMock.type);
});
