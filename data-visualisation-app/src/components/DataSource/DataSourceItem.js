import React, { useState } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function DataSourceItem({ setSrc, src }) {
  return (
    <ListItem onClick={(e) => setSrc(src)} button>
      <ListItemText primary={src} />
    </ListItem>
  );
}

export default DataSourceItem;
