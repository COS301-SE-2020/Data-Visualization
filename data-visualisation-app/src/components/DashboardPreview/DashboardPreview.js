import React from 'react';

import GraphPreview from '../GraphPreview';
import {Col, Row} from 'antd';

function DashboardPreview({ dashboard, remove }) {
  return (
    <div className='graph-flex-container'>
        {(() => {

            let cols;
            let output = [], d_i = 0;
            for (let r = 0; r < 3; r++) {
                cols = [];
                for (let c = 0; c < (r === 0 ? 2 : 3); c++) {
                    if (d_i < dashboard.graphs.length) {
                        cols.push(<Col span={(r === 0 ? 12 : 8)}>
                            <GraphPreview key={d_i} isPanel={true} data={dashboard.graphs[d_i]} onClick={(theid) => remove(theid)} />
                        </Col>);
                        d_i++;
                    } else {
                        cols.push(<Col span={(r === 0 ? 12 : 8)}>
                            <div className='edit-dashboard-empty-panel'></div>
                        </Col>);
                    }
                }
                output.push(<Row gutter={[16, 16]}>
                    {cols}
                </Row>);
            }

            return output;
        })()}

      {/*{dashboard.graphs &&*/}
      {/*  dashboard.graphs.map((graph, i) => <GraphPreview key={i} data={graph} onClick={() => remove(graph.id)} />)}*/}

    </div>
  );
}

export default DashboardPreview;
