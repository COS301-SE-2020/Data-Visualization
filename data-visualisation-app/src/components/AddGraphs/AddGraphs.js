import React from 'react';
import GraphPreview from '../GraphPreview';

const graphs = [
	{ graphtypeid: 1, source: '' },
	{ graphtypeid: 2, source: '' },
	{ graphtypeid: 3, source: '' },
];

function AddGraphs({ add, dashboardID }) {
	return (
		<div className='graph-flex-container'>
			<div className='list'>
				{graphs.map((graph, i) => (
					<GraphPreview key={i} data={graph} onClick={() => add({ dashboardID, graphtypeid: i + 1 })} />
				))}
			</div>
		</div>

	);
}


export default AddGraphs;
