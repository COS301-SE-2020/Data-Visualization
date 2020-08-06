import React from 'react';
import Entities from '../components/Entities/Entities';
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

describe('DataConnection component', () => {
  it('renders correctly', () => {
    const rendered = renderer.create(<Entities/>);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});