import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import DataSourceList from './DataSourceList';
import Panel from '../Panel/Panel';

function DataSources({ setSrc, SrcList }) {
    const [expanded, setExpanded] = useState(false);

    const renderNoSource = () => {
        return (
            <Button variant='contained' onClick={() => setExpanded(true)}>
                Select a Data Source
            </Button>
        );
    };

    const renderBody = () => {
        if (expanded) {
            if (SrcList.length <= 0) return <Panel caption='Loading Data Sources' />;
            else
                return (
                    <DataSourceList
                        header='Available Data Sources'
                        setSrc={setSrc}
                        SrcList={SrcList}
                    />
                );
        } else return renderNoSource();
    };

    return <div className='data-source-list-container'>{renderBody()}</div>;
}

export default DataSources;
