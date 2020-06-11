import React from 'react';
import './GraphSuggestions.css';
import graph2 from '../../assets/img/Graphs/ScatterPlot2.png';
const graphs = ["BarChart", "PieChart", "ScatterPlot"];
function GraphSuggestions() {
    return (
    <div>
        <div className="graphSuggestions-flex-container">Suggested Graphs{graphs.map((g,i)=>
            <div key={i} className="graphSuggestions-flex-item" onClick={() => alert('Added To Dashboard')}>
                <img src={graph2} alt={g} /></div>)}
        </div>
    </div>
    );
}

export default GraphSuggestions;