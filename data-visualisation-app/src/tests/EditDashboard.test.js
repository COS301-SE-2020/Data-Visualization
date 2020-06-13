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
        }
        const comp = renderer.create(
            <EditDashboard dashboard={dashboard} Back={null} addGraph={null} Delete={null} removeGraph={null} Update={null}/>
        );

        let tree = comp.toJSON();
        expect(tree).toMatchSnapshot();
    });

})