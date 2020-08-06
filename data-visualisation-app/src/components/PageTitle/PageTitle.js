import React from 'react';
import {Divider, Typography} from 'antd';

function PageTitle(props) {
    return <React.Fragment>
        <Typography.Title level={4} >{props.children}</Typography.Title>
        <Divider />
    </React.Fragment>;
}

export default PageTitle;