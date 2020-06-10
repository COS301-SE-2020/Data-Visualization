import React from 'react';
import "./DashboardPreview.css"
import graph1 from '../../assets/img/Graphs/Barchart1.png';
import graph2 from '../../assets/img/Graphs/Barchart2.png';
import graph3 from '../../assets/img/Graphs/PieChart.jpg';
import graph4 from '../../assets/img/Graphs/PieChart1.png';
import graph5 from '../../assets/img/Graphs/ScatterPlot1.png';
import graph6 from '../../assets/img/Graphs/ScatterPlot2.png';
const graphs = ["BarChart", "PieChart", "ScatterPlot"];
function DashboardPreview() {
    return (
    <div>
        <div className="dashboard-flex-container">Dashboard{graphs.map((g,i)=>
                <div className="dashboard-flex-item" key={i} onClick={() => alert('Added To Dashboard')}>
                <img src={graph2} alt={g} /></div>)}
        </div>
    </div>
    );
}

export default DashboardPreview;