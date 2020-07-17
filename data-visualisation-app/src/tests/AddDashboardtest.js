/**
 * @file AddDashboardtest.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 15/07/2020   Phillip Schulze    Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a test, to see if a dashboard is added and renders
 * correctly.
 *
 * Error Messages: "Error"
 * Assumptions: None.
 * Constraints: None.
 */
import React from 'react';
import { render, fireEveent, queryByPlaceholderText, fireEvent } from '@testing-library/react';
import AddDashboard from '../pages/AddDashboard';

it('renders correctly', () =>{
    const{queryByTestId, queryAllByPlaceholderText} = render(<AddDashboard/>);
    expect(queryByTestId('add-button')).toBeTruthy();
    expect(queryAllByPlaceholderText('Consumer')).toBeTruthy();
});

describe('Input value', () => {
    it('updates on change', () =>{
        const {queryByPlaceholderText} = render(<AddDashboard/>);

        const addInput = queryByPlaceholderText('Consumer');

        fireEvent.change(addInput, {target: {value: 'test'}});

        expect(addInput.value).toBe('test');
    })
});



