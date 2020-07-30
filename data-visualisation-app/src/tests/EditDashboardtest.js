/**
 * @file EditDashboardtest.js
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
 * Functional Description: This file implements a test, to see if the dashboard edit screen renders
 * correctly.
 *
 * Error Messages: "Error"
 * Assumptions: None.
 * Constraints: None.
 */
import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import graph1 from "../assets/img/Graphs/Barchart.png";
import graph2 from "../assets/img/Graphs/PieChart.jpg";
import EditDashboard from "../pages/EditDashboard";

describe( 'Renders the dashboard edit screen', () => {
    it('displays graph', () => {
        const dashboard = {
            name: 'Banking',
            description:
                'This is a banking business intelligence dashboard that analytically displays different banking data sets across multiple systems. ',
            id: 0,
            graphs: [graph1, graph2, graph1],
        };
        const comp = renderer.create(
            <EditDashboard dashboard={dashboard} Back={null} addGraph={null} Delete={null} removeGraph={null} Update={null}/>
        );

        let tree = comp.toJSON();
        expect(tree).toMatchSnapshot();
    });

});