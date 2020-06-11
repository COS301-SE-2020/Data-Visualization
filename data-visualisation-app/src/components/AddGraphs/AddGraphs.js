import React from 'react';
import './AddGraphs.css';
import graph3 from '../../assets/img/Graphs/PieChart.jpg';

const graphs = ["BarChart", "PieChart", "ScatterPlot"];
function AddGraphs() {
    return (
    <div>
        <div className="addGraphs-flex-container">Add Graphs{graphs.map((g,i)=>
            <div key={i} className="addGraphs-flex-item" onClick={() => alert('Added To Dashboard')}>
                <img src={graph3} alt={g} /></div>)}
        </div>
    </div>
    );
}

export default AddGraphs;