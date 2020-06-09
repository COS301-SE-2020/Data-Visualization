import React from 'react';

class EditDashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            //add: props.AddConnection,
            //filter: props.Filter,
            delete: props.Delete,
        }
    }

    render() {
        return (
            <div className="EditDashboard">
                <button type="Submit" onClick={() => alert("Functionality not ready yet")}>Add Connection</button>
                <button type="Submit" onClick={() => alert("Functionality not ready yet")}>Filter</button>
                <Suggestions />
                <button type="Submit" style="float: right" onClick={() => this.state.delete}>Delete Dashboard</button>
            </div>
        );
    }
}

export default EditDashboard;