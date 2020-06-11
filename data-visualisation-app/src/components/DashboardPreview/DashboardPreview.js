import React from 'react';
import "./DashboardPreview.css"
import graph1 from '../../assets/img/Graphs/Barchart.png';
const graphs = ["BarChart", "PieChart", "ScatterPlot"];
function DashboardPreview() {
    return (
    <div>
        <div className="dashboard-flex-container">Dashboard{graphs.map((g,i)=>
            <div className="dashboard-flex-item" key={i} onClick={() => alert('Added To Dashboard')}>
                <img src={graph1} alt={g}/>
            </div>)}
        </div>
    </div>
    );
}

export default DashboardPreview;