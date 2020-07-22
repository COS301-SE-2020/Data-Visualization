import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LoginDialog from '../pages/LoginDialog/LoginDialog';
import renderer from 'react-test-renderer';


describe('LoginDialog component renders correctly', () => {
    it('renders correctly', () => {
      const rendered = renderer.create(<LoginDialog/>);
      expect(rendered.toJSON()).toMatchSnapshot();
    });
});


// describe('Input value', () => {

//     // it('updates on change', () =>{
//     //     const {queryByPlaceholderText} = render(<AddDashboard/>);

//     //     const addInput = queryByPlaceholderText('Consumer');

//     //     fireEvent.change(addInput, {target: {value: 'test'}});

//     //     expect(addInput.value).toBe('test');
//     // });
// });



