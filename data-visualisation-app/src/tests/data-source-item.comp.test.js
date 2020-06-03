import React from 'react';
import renderer from 'react-test-renderer';
import DataSourceItem from '../data-source/data-source-item.comp';

test('renders List Item representing a data-source, and that sets the selected Data source once clicked', () => {
  let selectedSrcMock = '';
  const srcMock = 'MockSourceA';

  const setSrcMock = (src) => {
    selectedSrcMock = src;
  };

  const comp = renderer.create(
    <DataSourceItem src={srcMock} setSrc={setSrcMock} />
  );

  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();

  //manually trigger onClick
  tree.props.onClick();
  expect(selectedSrcMock).toBe(srcMock);
});
