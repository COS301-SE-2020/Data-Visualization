/**
 * @file index.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 1/06/2020   Phillip Schulze    Original
 *
 * Test Cases: none
 *
 * Functional Description: This file is used to render the REACT Application.
 *
 * Error Messages: "Error"
 * Assumptions: None.
 * Constraints: None.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './assets/fonts/segoe_ui/segoeui.ttf';

ReactDOM.render(<App />, document.getElementById('root'));
