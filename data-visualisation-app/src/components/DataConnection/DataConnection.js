import React from 'react';
import { List, Avatar, Button, Skeleton } from 'antd';
import {Modal, Input, Select} from 'antd';
import './DataConnection.scss';
import AddConnection from '../AddConnection';

import reqwest from 'reqwest';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

class DataConnection extends React.Component {


  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    addConnection : false,
  };

  componentDidMount() {
    this.getData(res => {
      this.setState({
        initLoading: false,
        data: res.results,
        list: res.results,
      });
    });
  }

  getData = callback => {
    //get data from database
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };


  deleteItem = (itemToDelete) => {
    //request to database to delete this item
    console.log(itemToDelete.name.last)
  }


  changeAddState = () => {
    this.setState({
      addConnection : !this.state.addConnection,
    });
  };

  next = () => {
    this.props.setStage('addEntities');
  };


  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.changeAddState} style ={{marginRight: '10px'}}>Add Connection</Button>
          <Button type = 'primary'  onClick={this.next}>Next</Button>
        </div>
      ) : null;
   

    return (
     <div>
        <List
          className="dataSourceList"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <List.Item
              key={item.name.first}
              actions={
                [
                  <a onClick={() => {this.deleteItem(item)}}>
                    Delete
                  </a>
                ]
              }>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://15f76u3xxy662wdat72j3l53-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/OData-connector-e1530608193386.png" />
                  }
                  title={<a href="https://ant.design">{item.name.last}</a>}
                  description='Ant Design, a design language for background applications, is refined by Ant UED Team'
                />
                <div></div>
              </Skeleton>
            </List.Item>
          )}
        />
        <main>
        {
            this.state.addConnection ? 
            
              <AddConnection changeState = {this.changeAddState}/>
            
            :
            null
        }
        
        </main>
      </div>
    );
  }
}

export default DataConnection;