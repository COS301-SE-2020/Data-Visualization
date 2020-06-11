import React from 'react';
import './EditDashboard.css';
import GraphSuggestions from "../../components/GraphSuggestions";
import AddGraphs from "../../components/AddGraphs";
import DashboardPreview from "../../components/DashboardPreview";
function EditDashboard(props) {
    return (
    <div className='EditDashboard'>
        <button
        type='Submit'
        onClick={() => alert('Functionality not ready yet')}>
        Add Connection
        </button>

        <button
        type='Submit'
        onClick={() => alert('Functionality not ready yet')}>
        Filter
        </button>

        <button
        type='Submit'
        onClick={() => props.Back(false)}
        style={{ float: 'right' }}>
        Back
        </button>

        <button type='Submit' style={{ float: 'right' }} onClick={props.Delete}>
            Delete Dashboard
        </button>

        <div className = "dashBoardWrapper">
            <DashboardPreview/>
            <AddGraphs/>
            <GraphSuggestions/>
        </div>

    </div>
    );
}

export default EditDashboard;
