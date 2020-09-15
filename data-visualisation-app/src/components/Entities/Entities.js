/**
 *   @file Entities.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   15/7/2020   Byron Tominson      Original
 *
 *   Test Cases: data-visualisation-app/src/tests/Entities.test.js
 *
 *   Functional Description:
 *   Displays entities for the user to choose from.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import './Entities.scss';
import React, { Fragment, useEffect, useState, useRef} from 'react';
import { List, Avatar, Button, Skeleton, Form, Checkbox, Card, message } from 'antd';
import {CompassOutlined} from '@ant-design/icons';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import { createForm } from 'rc-form';
import Anime, { anime } from 'react-anime';



var showAll = false;


class Entities extends React.Component {

  
  formRef = React.createRef();

  state = {
    initLoading: true,
    loading: false,
    checked : true,
    data: [],
    list: [],
    allChecked: false,
  };

  onFinish = values => {

    var atLeastOne = false;
    request.user.selectedEntities = [];
    
    request.user.entitiesToDisplay.map((item) => {
      if(this.formRef.current.getFieldValue(item.entityName) === true){
        request.user.selectedEntities.push(item);
        atLeastOne = true;
      }
    });
  
    if(atLeastOne){
      console.log(request.user.selectedEntities);
      showAll = false;
      this.next();
    }
    else{
      message.error('Please select at least one entity');
    }
    
  };


  handleChange = (e) => {
    
    showAll = !showAll;
    var tempItem = {};

    request.user.entities.map((entityName) => {
      tempItem[entityName] = showAll;
      this.formRef.current.setFieldsValue(tempItem);
      if(showAll){
        document.getElementById('card-'+entityName).style.backgroundColor = '#EAFFF5';
        document.getElementById('card-'+entityName).style.boxShadow  = '0 -1.8px 1.2px #3EC195,0 1.7px 1.3px #3EC195,0 -1.5px 1px #3EC195,0 1.3px 1.9px #3EC195,0 -1.8px 3.4px #3EC195,0 1px 5px #3EC195';
      }
      else{
        document.getElementById('card-'+entityName).style.backgroundColor = '';
        document.getElementById('card-'+entityName).style.boxShadow = '';
      }
     
    });

  }


  next = () => {
    this.props.setStage('suggestions');
  };

  
  /**
    * invoked immediately after a component is mounted (inserted into the tree).
  */
  componentDidMount() {

    request.user.selectedFields = [];
    request.user.graphTypes = ['bar','line', 'pie', 'scatter', 'effectScatter'];

    //console.log(request.user.dataSources);
    if(request.user.dataSources.length === 0){
      this.setState({
        initLoading: false,
        data: [],
        list: [],
      });
    }else{
      this.getData(res => {
        this.setState({
          initLoading: false,
          data: request.user.entitiesToDisplay,
          list: request.user.entitiesToDisplay,
        });
      });
    }
    
  }


  /**
    * Funnction uses the dataSources to update the entites list.
  */
  getData = callback => {
   
    var Obj = {};
    request.user.dataSourceInfo = [];

    request.user.entities = [];
    request.user.entitiesToDisplay = [];

    request.user.dataSources.map((source) => {
        console.log(source);
     
      request.entities.list(source.sourceurl, source.sourcetype, function(result) {

          if (result === constants.RESPONSE_CODES.SUCCESS) {
  
            request.user.entities = Object.keys(request.user.dataSourceInfo.entityList);
            
            request.user.entities.map((entityName) => {
    
              Obj = JSON.parse(JSON.stringify(Obj));
              Obj['entityName'] = entityName;
              Obj['datasource'] = source.sourceurl;
              Obj['fields'] = request.user.dataSourceInfo.entityList[entityName];
              Obj['datasourcetype'] = source.sourcetype;
              
              request.user.entitiesToDisplay.push(Obj);
            });
            callback(request.user.entitiesToDisplay);
          }
        });
    });
   
  };

  render() {
  
    const { getFieldDecorator } = this.props.form;
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
        </div>
      ) : null;
   
      //1800px
      const mql = window.matchMedia('(max-width: 1000px)');
      let mobileView = mql.matches;

      if (mobileView) {
        return (
    
          <div>
             <Form
                ref={this.formRef}
                name='entitiesForm'
                onFinish={this.onFinish}
             >
      
               <Card className = 'titleCard' title='Select Entities From Your Datasources' headStyle={{backgroundColor: 'rgba(255, 255, 255, 0.4)', border: 0, textAlign: 'center'}}>
                 <Checkbox onChange={this.handleChange}>Check All</Checkbox>
                </Card>
               
               <List
                 className='entitesList'
                 loading={initLoading}
                 itemLayout='horizontal'
                 loadMore={loadMore}
                 dataSource = {list}
                 
                 renderItem={item => (
                   
                   <Fragment>
                       <Card id = {'card-'+item.entityName} onClick={() => {                          
                          var tempItem = {};
                          tempItem[item.entityName] = !this.formRef.current.getFieldValue(item.entityName);
                          this.formRef.current.setFieldsValue(tempItem);

                          if(tempItem[item.entityName]  === false){                       
                            document.getElementById('card-'+item.entityName).style.boxShadow = '';
                           }
                          else{
                            document.getElementById('card-'+item.entityName).style.boxShadow = '0px 0px 43px -12px rgba(189,189,189,1)';
                          }
                        }} 
                        >

                       <List.Item
                           key={1}
                           actions={
                             [ 
                               
                              <Form.Item name={item.entityName} valuePropName='checked'>
                                <Checkbox/>
                              </Form.Item>
     
                             ]
                           }>
                           <Skeleton avatar title={false} loading={item.loading} active>
                             <List.Item.Meta
                               avatar={
                                 <Avatar src='https://15f76u3xxy662wdat72j3l53-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/OData-connector-e1530608193386.png' />
                               }
                               title={item.entityName}
                               description={item.datasource.slice(item.datasource.length - 13)}
                             />
                             <div></div>
                           </Skeleton>
                         </List.Item>
                       </Card> 
                   </Fragment>
                 )}
               />

               <Form.Item>
              
                <Button id = 'button__generateSuggestions' type="primary" htmlType="submit" shape = 'round' size = 'large' icon={<CompassOutlined />}>
                   Generate Suggestions
                 </Button>
                
               </Form.Item>
               
             </Form>
           </div>
         );
      } else {
        return (
      
          <div>  
             <Form
                ref={this.formRef}
                name='entitiesForm'
                onFinish={this.onFinish} 
             >
              
               <Card className = 'titleCard' bordered = {false} title='Select Entities From Your Datasources' style= {{width:'80%', margin: '0 auto', marginTop: '20px', backgroundColor: 'transparent'}} headStyle={{ border: 0, textAlign: 'center'}}>
               <Checkbox onChange={this.handleChange}  >Check All</Checkbox>
               <List
                 className='entitesList'
                 loading={initLoading}
                 itemLayout='horizontal'
                 loadMore={loadMore}
                 dataSource = {list}
                 
                 renderItem={item => (
                   <Fragment>
                       <Card.Grid hoverable = {false} className='entities__entity' id = {'card-'+item.entityName}  style= {{cursor: 'pointer', margin: '10px', marginLeft: '50px', width:'28%',  backgroundColor: 'transparent'}}  onClick={() => {
                          var tempItem = {};
                          tempItem[item.entityName] = !this.formRef.current.getFieldValue(item.entityName);
                          this.formRef.current.setFieldsValue(tempItem);

                
                          if(tempItem[item.entityName]  === false){                       
                            document.getElementById('card-'+item.entityName).style.boxShadow  = '';
                            document.getElementById('card-'+item.entityName).style.backgroundColor = '';
                           }
                          else{
                            document.getElementById('card-'+item.entityName).style.backgroundColor = '#EAFFF5';
                            document.getElementById('card-'+item.entityName).style.boxShadow  = '0 -1.8px 1.2px #3EC195,0 1.7px 1.3px #3EC195,0 -1.5px 1px #3EC195,0 1.3px 1.9px #3EC195,0 -1.8px 3.4px #3EC195,0 1px 5px #3EC195';
                          }
                     
                        }} 
                        >
                        
                       <List.Item
                           key={1}
                           actions={
                             [ 
                               
                              <Form.Item name={item.entityName} valuePropName='checked'>
                                   <Checkbox style={{visibility: 'hidden'}}/>
                               </Form.Item>
     
                             ]
                           }>
                           <Skeleton avatar title={false} loading={item.loading} active>
                             <List.Item.Meta
                               avatar={
                                 <Avatar src='https://15f76u3xxy662wdat72j3l53-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/OData-connector-e1530608193386.png' />
                               }
                               title={item.entityName}
                               description={item.datasource.slice(item.datasource.length - 13)}
                             />
                             <div></div>
                           </Skeleton>
                         </List.Item>
                       </Card.Grid> 
                   </Fragment>
                 )}
               />
               </Card>
              
               <Form.Item>
                  <Button id={
                    request.user.isLoggedIn ? 'button__generateSuggestions_notLoggedIn' : 'button__generateSuggestions'
                  }
                   type="primary" htmlType="submit" shape = 'round' size = 'large' icon={<CompassOutlined />}>
                    Generate Suggestions
                  </Button>
               </Form.Item>
               
             </Form>
           </div>
         );
      }
    
  }
}

Entities = createForm()(Entities);
export default Entities;