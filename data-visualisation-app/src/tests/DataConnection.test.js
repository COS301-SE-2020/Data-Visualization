import React from 'react';
import DataConnection, {generateID} from '../components/DataConnection/DataConnection';
import renderer from 'react-test-renderer';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('ID generator', () => {
    it('It reutrns the right type of string', () => {
      expect(generateID()).toHaveLength(10);
    });

});

describe('DataConnection component', () => {
  it('renders correctly', () => {
    const rendered = renderer.create(<DataConnection/>);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});

