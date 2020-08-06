import React from 'react';
import GraphPreview from '../GraphPreview';
import {Row, Col} from 'antd';

const graphs = [
  { graphtypeid: 1, source: '' },
  { graphtypeid: 2, source: '' },
  { graphtypeid: 3, source: '' },
];

function GraphSuggestions({ add, dashboardID }) {
  return (
    <div className='graph-flex-container' style={{marginRight: '8px'}} >

        {graphs.map((graph, i) => (
            <Row gutter={[16, 16]} >
                <Col span={24}>
                    <GraphPreview key={i} data={graph} onClick={() => add({ dashboardID, graphtypeid: i + 1 })} />
                </Col>
            </Row>
        ))}

      {/*<div className='list'>*/}
      {/*  {graphs.map((graph, i) => (*/}
      {/*    <GraphPreview key={i} data={graph} onClick={() => add({ dashboardID, graphtypeid: i + 1 })} />*/}
      {/*  ))}*/}
      {/*</div>*/}

    </div>
  );
}

export default GraphSuggestions;
