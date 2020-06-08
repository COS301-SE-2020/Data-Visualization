import React from 'react';

class DisplayDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.dashboard.name,
            content: props.dashboard.content,
            backFunc: props.backFunc,
        }
    }

    render()
    {
        return(
        <div className="DisplayDashboard">
            <h1>{this.state.name}</h1>
            <button type="Submit" style="float: right" onClick = {() => this.state.backFunc}>Back</button>
            <br/>
            <article>{this.state.content}</article>
        </div>
        );
    }
}

export default DisplayDashboard;