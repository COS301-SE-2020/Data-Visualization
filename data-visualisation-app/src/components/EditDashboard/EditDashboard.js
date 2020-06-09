import React from 'react';

class EditDashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            add: props.AddConnection,
            filter: props.Filter,
        }
    }

    render() {
        return (
          <div className="EditDashboard">

          </div>
        );
    }
}