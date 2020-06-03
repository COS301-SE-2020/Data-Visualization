import React, { useState } from 'react';

import DataSourceItem from './data-source-item.comp';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

function DataSourceList({ header, setSrc, SrcList }) {
  return (
    <List
      component='nav'
      subheader={<ListSubheader component='div'>{header}</ListSubheader>}>
      {SrcList.map((src, i) => (
        <DataSourceItem key={i} setSrc={setSrc} src={src} />
      ))}
    </List>
  );
}

export default DataSourceList;
