import React from 'react';
import DashboardsList from '../components/DashboardsList';
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

describe('DashboardsList component', () => {
    it('DashboardsList renders correctly', () => {
        const rendered = renderer.create(<DashboardsList/>);
        expect(rendered.toJSON()).toMatchSnapshot();
    });
});

