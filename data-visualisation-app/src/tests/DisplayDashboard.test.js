import React from 'react';
import { render } from '@testing-library/react';
import DisplayDashboard from "../pages/DisplayDashboard";
import DisplayGraph from "../pages/DisplayDashboard/DisplayGraph";
import renderer from 'react-test-renderer';
import DataSourceItem from "../components/DataSource/DataSourceItem";
import graph1 from "../assets/img/Graphs/Barchart.png";
import graph2 from "../assets/img/Graphs/PieChart.jpg";

describe( 'Renders the dashboard display', () => {
    it('displays graph', () => {
        const comp = renderer.create(
            <DisplayGraph data={"test"}/>
        );

        let tree = comp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('displays dashboard', () => {
        const dashboard = {
            name: 'Banking',
            description:
                'This is a banking business intelligence dashboard that analytically displays different banking data sets across multiple systems. ',
            id: 0,
            graphs: [graph1, graph2, graph1],
        }
        const comp = renderer.create(
            <DisplayDashboard backFunc={null} editDashboard={null} dashboard={dashboard}/>
        );

        let tree = comp.toJSON();
        expect(tree).toMatchSnapshot();
    });

})