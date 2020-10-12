/**
 *   @file DataConnection.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   8/7/2020   Byron Tominson      Original
 *   15/7/2020  Byron Tominson      API calls added
 *
 *   Test Cases: data-visualisation-app/src/tests/DataConnection.test.js
 *
 *   Functional Description:
 *   Displays data connections to the user.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

/**
  * Imports
*/ 
import React from 'react';
import { List, Avatar, Button, Skeleton, Card } from 'antd';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import './DataConnection.scss';
import AddConnectionDialog from '../AddConnectionDialog';
import EditConnectionDialog from '../EditConnectionDialog';
import csvIcon from '../../assets/img/csv.svg';
import jsonIcon from '../../assets/img/json.svg';
import xmlIcon from '../../assets/img/xml.svg';
import { Form, Input, Layout, Row, Col, Typography, Space, message } from 'antd';
import { Modal} from 'antd';

/**
  * takes no arguments and returns a random string of length 10.
  * @return result
*/
export function generateID() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


/**
  * a class comonent that renders the data connection list.
  * @returns React Component
*/
class DataConnection extends React.Component {

  
  /**
    * States that belong to the Data Connection class component.
  */
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    addConnection : false,
    editConnection : false,
    setEditVisible : true,
    seletedItem: null,
  };


  /**
    * invoked immediately after a component is mounted (inserted into the tree).
  */
  componentDidMount() {
      this.getData(res => {
        this.setState({
          initLoading: false,
          data: request.user.dataSources,
          list: request.user.dataSources,
        });
      });
  }
  
  /**
    * Calls the function to send the request to get the list of data sources.
    * The function called updates the 'requests.user.dataSources' object with the correct array of data sources for the user. 
  */
  getData = callback => {
    if(request.user.isLoggedIn){
      request.dataSources.list(request.user.apikey, function(result) {
  
        
        if (result === constants.RESPONSE_CODES.SUCCESS) {

          callback(request.user.dataSources);
        }
      });
    }
    else{
      callback(request.user.dataSources);
    } 
  };

  /**
    * Deletes item from the 'list'.
    * If user is logged in, delete on backend and front end.
    * If the user is not logged in, delete only on front end.
  */
  deleteItem = (itemToDelete) => {
    /**
      * If user is logged in, delete on backend and front end.
    */
    if(request.user.isLoggedIn){
      
      request.dataSources.delete(itemToDelete.id, request.user.apikey, function(result) {

        if (result === constants.RESPONSE_CODES.SUCCESS) {

        }
      });

      request.user.dataSources = this.state.list.filter(list => list.id !== itemToDelete.id);

      this.setState(previousState => ({
        data: request.user.dataSources,
        list: request.user.dataSources
      }));
    }
    else{
      /**
        * User is not logged in, delete only on front end.
      */
      request.user.dataSources = this.state.list.filter(list => list.id !== itemToDelete.id);

      this.setState(previousState => ({
        data: request.user.dataSources,
        list: request.user.dataSources
      }));
    }
   
  }



  /**
    * Adds item to the 'list'.
    * If user is logged in, delete on backend and front end.
    * If user is not logged in, add item only front end.
  */
  addItem = (name ,uri, sourcetype, cacheURIdata) => {

    var id = generateID();
    let attempt = this;
    /**
      * If user is logged in, add item on backend and front end.
    */
    if(request.user.isLoggedIn){
      request.dataSources.add(request.user.apikey, uri, sourcetype, name , cacheURIdata, function(result) {
       
        if (result === constants.RESPONSE_CODES.SUCCESS) {

          request.user.dataSources.push({
            'id': request.user.addedSourceID,
            'email': request.user.email,
            'sourceurl': uri,
            'sourcetype': sourcetype,
            'sourcename' : name,
	          'islivedata' : cacheURIdata, 
            
          });

          attempt.setState(previousState => ({
            data: request.user.dataSources,
            list: request.user.dataSources
          }));

        }
      });
      
    }
    else{
      /**
        * User is not logged in, add item only front end.
      */
      request.user.dataSources.push({
        'id': id,
        'email': request.user.email,
        'sourceurl': uri,
        'sourcetype' : sourcetype,
        'sourcename' : name,
	      'islivedata' : cacheURIdata, 
      });


      this.setState(previousState => ({
        data: request.user.dataSources,
        list: request.user.dataSources
      }));
    }
    
  }


  editItem = (item, values) => {

    let attempt = this;

    if(values.nameField !== undefined){
      if(request.user.isLoggedIn){


        request.dataSources.update(request.user.apikey, item.id, values.nameField, function(result) {
         
          if (result === constants.RESPONSE_CODES.SUCCESS) {
       
            item.sourcename = values.nameField;

            attempt.setState(previousState => ({
              data: request.user.dataSources,
              list: request.user.dataSources
            }));


          }
        });
       
      //item.sourcename = values.nameField;
        
      }
      else{
        /**
          * User is not logged in, change item only front end.
        */
       item.sourcename = values.nameField;

       //console.log( request.user.dataSources);
      }
    
    }
    
  }

 
  /**
    * handles the addConnection state
  */
  changeAddState = () => {
    this.setState({
      addConnection : !this.state.addConnection,
    });
  };
  
   /**
    * handles the editConnection state
  */
  changeEditState = () => {
    this.setState({
      editConnection : !this.state.editConnection,
    });
  };

  /**
    * sets the stage of explore to entities (the next stage)
  */
  next = () => {
    this.props.setStage('entities');
  };

  /**
    * renders elements
  */
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
     
          <Button id = 'addConnetion__button' shape = 'round' onClick={this.changeAddState} style ={{marginRight: '10px'}}>Add Connection</Button>
          <Button id = 'next__button' shape = 'round' onClick={this.next}>Next</Button>
          
    
          
        </div>
      ) : null;

      let mobileView = false;
      const mql = window.matchMedia('(max-width: 1000px)');
      mobileView = mql.matches;

    return (
     <div>

      <p className = 'connectionHeader'>Manage Your Data Connections</p>
        <List
          className="dataSourceList"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <Card hoverable className = 'dataConnectionCard'>
            <List.Item
              key={item.id}
              actions={
                [
                  <Button id = 'deleteButton' className = 'onCard' onClick={() => {this.deleteItem(item);}} >Delete</Button>,
                  <Button id = 'editButton' className = 'onCard' onClick={() => {
                    
                    
                    this.setState({
                      selectedItem : item,
                    });

                    this.changeEditState();
                   
                  
                  }} >Edit</Button>
                 
                ]
              }>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta 
                  avatar={
                    <Avatar shape='square' src={item.sourceurl.slice(-3) === 'csv' ? csvIcon : item.sourceurl.slice(-3) === 'xml' ? xmlIcon : item.sourceurl.slice(-4) === 'json' ? jsonIcon : 'https://15f76u3xxy662wdat72j3l53-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/OData-connector-e1530608193386.png'}/>
                  }
                  title={item.sourcename}
                  //description={item.sourceurl}
                  description={`${mobileView ? '' : item.sourceurl}`}
                />
                <div></div>
              </Skeleton>
            </List.Item>
            </Card>
          )}
        />
        <main>
        {
            this.state.addConnection ? 
            
              <AddConnectionDialog changeState = {this.changeAddState} addItem = {this.addItem}/>
            
            :

            this.state.editConnection ?

              <EditConnectionDialog changeState = {this.changeEditState} editItem = {this.editItem} selectedItem = {this.state.selectedItem}/>
            
            :

            null
        }
        </main>
      </div>
    );
  }
}

export default DataConnection;