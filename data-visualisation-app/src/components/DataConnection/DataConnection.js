import React from 'react';
import { List, Avatar, Button, Skeleton, Typography } from 'antd';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import reqwest from 'reqwest';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';

import './DataConnection.scss';
import AddConnectionDialog from '../AddConnectionDialog';
import {useGlobalState} from '../../globals/Store';
import update from 'react-addons-update';
import { ListAlt } from 'styled-icons/material';

const { Title } = Typography;

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;


function generateID() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



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

    if(request.user.isLoggedIn){
      request.dataSources.list(request.user.apikey, function(result) {
        console.log(result);
        
        if (result === constants.RESPONSE_CODES.SUCCESS) {
          callback(request.user.dataSources);
        
        }
      });
    }
    else{
      callback(request.user.dataSources);
    }
    
  };


  deleteItem = (itemToDelete) => {
    
    if(request.user.isLoggedIn){
      //delete on back end
      request.dataSources.delete(itemToDelete.id, request.user.apikey, function(result) {
        console.log(result);
        if (result === constants.RESPONSE_CODES.SUCCESS) {

        }
      });

      //delete on front end
      request.user.dataSources = this.state.list.filter(list => list.id !== itemToDelete.id);

      this.setState(previousState => ({
        data: request.user.dataSources,
        list: request.user.dataSources
      }));
    }
    else{
      //delete on front end
      request.user.dataSources = this.state.list.filter(list => list.id !== itemToDelete.id);

      this.setState(previousState => ({
        data: request.user.dataSources,
        list: request.user.dataSources
      }));
    }
   
    
  }

    

  addItem = (values) => {

  
    
    var newID = generateID();

    if(request.user.isLoggedIn){
      //add item on back end
      request.dataSources.add(newID, request.user.apikey, values.uri, function(result) {
        console.log(result);
        console.log(request.user.dataSources);
        if (result === constants.RESPONSE_CODES.SUCCESS) {
          
        }
      });

      //added item on front end
      request.user.dataSources.push({
        'id': newID,
        'email': request.user.email,
        'sourceurl': values.uri
      });

      this.setState(previousState => ({
        data: request.user.dataSources,
        list: request.user.dataSources
      }));
    }
    else{
      //added item on front end
      request.user.dataSources.push({
        'id': newID,
        'email': request.user.email,
        'sourceurl': values.uri
      });

      this.setState(previousState => ({
        data: request.user.dataSources,
        list: request.user.dataSources
      }));
    }
    
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
                  title={<a href="https://ant.design">{item.sourceurl}</a>}
                  description={item.id}
                />
                <div></div>
              </Skeleton>
            </List.Item>
          )}
        />
        <main>
        {
            this.state.addConnection ? 
            
              <AddConnectionDialog changeState = {this.changeAddState} addItem = {this.addItem}/>
            
            :
            null
        }
        
        </main>
      </div>
    );
  }
}

export default DataConnection;