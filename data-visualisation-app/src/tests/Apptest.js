/**
 * @file Apptest.js
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
 * Functional Description: This file implements a test, to see if the react application renders correctly.
 *
 * Error Messages: "Error"
 * Assumptions: None.
 * Constraints: None.
 */
import React from 'react';
import { render } from '@testing-library/react';
import App from '../components/App/App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  // const linkElement = getByText(/select a data source/i);
  // expect(linkElement).toBeInTheDocument();
});
