import React from 'react';

function EditDashboard(props) {
    this.state = {
        //add: props.AddConnection,
        //filter: props.Filter,
        back: props.Back,
        delete: props.Delete,
    };

    return (
        <div className="EditDashboard">
            <button
                type='Submit'
                onClick={() => alert("Functionality not ready yet")}
            >Add Connection</button>

            <button
                type='Submit'
                onClick={() => alert("Functionality not ready yet")}
            >Filter</button>

            <button
                type='Submit'
                onClick={() => this.state.back(false)}
                style={ {float: 'right'} }
                >Back</button>
            
            <Suggestions/>

            <button
                type='Submit'
                style={ {float: 'right'} } 
                onClick={() => this.state.delete}
            >Delete Dashboard</button>
        </div>
    );
}

export default EditDashboard;