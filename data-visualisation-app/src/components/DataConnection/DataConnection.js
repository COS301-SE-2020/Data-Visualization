import React from 'react';
import { List, Avatar, Button, Skeleton, Typography } from 'antd';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import reqwest from 'reqwest';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';

import './DataConnection.scss';
import AddConnectionDialog from '../AddConnectionDialog';


const { Title } = Typography;

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
        data: request.user.dataSources,
        list: request.user.dataSources,
      });
    });

  }



  getData = callback => {
    
    request.dataSources.list(request.user.apikey, function(result) {
      console.log(result);
      
      if (result === constants.RESPONSE_CODES.SUCCESS) {
        callback(request.user.dataSources);
      }
    });

  };


  deleteItem = (itemToDelete) => {
    //request to database to delete this item and then refresh the list

    request.dataSources.delete(itemToDelete.id, request.user.apikey, function(result) {
      console.log(result);
      
      if (result === constants.RESPONSE_CODES.SUCCESS) {
        //reload??
      }
    });

  }


  changeAddState = () => {
    this.setState({
      addConnection : !this.state.addConnection,
    });
  };

  next = () => {
    this.props.setStage('entities');
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
          <Button shape = 'round' onClick={this.changeAddState} style ={{marginRight: '10px'}}>Add Connection</Button>
          <Button type = 'primary' shape = 'round' onClick={this.next}>Next</Button>
        </div>
      ) : null;
   

    return (
     <div>
        <span id = 'headingSpan'>
          <Button id = 'firstBackButton' icon={<ArrowBackIosIcon />} visible = 'false'></Button>
          <Typography>
            <Title id = 'titleText'>Connections</Title>
          </Typography>
        </span>
        <List
          className="dataSourceList"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={
                [
                  <Button id = 'deleteButton' onClick={() => {this.deleteItem(item);}} >delete</Button>
                ]
              }>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://15f76u3xxy662wdat72j3l53-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/OData-connector-e1530608193386.png" />
                  }
                  title={<a href="https://ant.design">{item.id}</a>}
                  description={item.sourceurl}
                />
                <div></div>
              </Skeleton>
            </List.Item>
          )}
        />
        <main>
        {
            this.state.addConnection ? 
            
              <AddConnectionDialog changeState = {this.changeAddState}/>
            
            :
            null
        }
        
        </main>
      </div>
    );
  }
}

export default DataConnection;