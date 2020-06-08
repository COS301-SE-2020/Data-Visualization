import React from 'react';
import { render } from '@testing-library/react';
import Panel from '../components/Panel/Panel';

function testPanel(captionString) {
    test(`renders Panel component with caption "${captionString}"`, () => {
        const { getByText } = render(<Panel caption={captionString} />);
        const el = getByText(new RegExp(captionString));
        expect(el).toBeInTheDocument();
    });
}

testPanel('Data Sources are loading');