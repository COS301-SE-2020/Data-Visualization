import React from 'react';
import AddDashboard from '../components/AddDashboard';
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

describe('AddDashboard component', () => {
    it('AddDashboard renders correctly', () => {
        const rendered = renderer.create(<AddDashboard/>);
        expect(rendered.toJSON()).toMatchSnapshot();
    });
});

