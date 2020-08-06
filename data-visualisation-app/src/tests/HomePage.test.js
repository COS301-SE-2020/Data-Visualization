import React from 'react';
import HomePage from '../components/HomePage/HomePage';
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

describe('HomePage component', () => {
    it('HomePage renders correctly', () => {
        const rendered = renderer.create(<HomePage/>);
        expect(rendered.toJSON()).toMatchSnapshot();
    });
});

