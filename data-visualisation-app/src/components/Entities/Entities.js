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
import React, { Fragment } from 'react';
import { List, Avatar, Button, Skeleton, Form, Checkbox, Card, message } from 'antd';
import {CompassOutlined} from '@ant-design/icons';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import { createForm } from 'rc-form';
import Anime, { anime } from 'react-anime';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

class Entities extends React.Component {


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
      if(this.props.form.getFieldValue(item.entityName) === true){
        request.user.selectedEntities.push(item);
        atLeastOne = true;
      }
    });
  
    if(atLeastOne){
      console.log(request.user.selectedEntities);
      this.next();
    }
    else{
      message.error('Please select at least one entity');
    }
    
  };


  handleChange = (e) => {

    this.allChecked = !this.allChecked;
    this.setState({
      allChecked: !this.allChecked
    });
    
  }


  onChange = (name) => {
    // this.props.form.setFieldsValue({
    //   name: false,
    // });
  };


  next = () => {
    this.props.setStage('suggestions');
  };

  
  /**
    * invoked immediately after a component is mounted (inserted into the tree).
  */
  componentDidMount() {

    request.user.selectedFields = [];
    request.user.graphTypes = [];

    console.log(request.user.dataSources);
    if(request.user.dataSources.length === 0){
      console.log('here');
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

      request.entities.list(source.sourceurl, function(result) {

          if (result === constants.RESPONSE_CODES.SUCCESS) {
  
            request.user.entities = Object.keys(request.user.dataSourceInfo.entityList);
            
            request.user.entities.map((entityName) => {
    
              Obj = JSON.parse(JSON.stringify(Obj));
              Obj['entityName'] = entityName;
              Obj['datasource'] = source.sourceurl;
              Obj['fields'] = request.user.dataSourceInfo.entityList[entityName];
              
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
   

      const mql = window.matchMedia('(max-width: 1024px)');
      let mobileView = mql.matches;

      if (mobileView) {
        return (
    
          <div>
             <Form
                 name='entitiesForm'
                 onFinish={this.onFinish}
             >
      
               <Card className = 'titleCard' title='Select Entities From Your Datasources' headStyle={{backgroundColor: 'rgba(255, 255, 255, 0.4)', border: 0, textAlign: 'center'}}>
                 <Checkbox onChange={this.handleChange}>Check all</Checkbox>
                </Card>
               
               <List
                 className='entitesList'
                 loading={initLoading}
                 itemLayout='horizontal'
                 loadMore={loadMore}
                 dataSource = {list}
                 
                 renderItem={item => (
                   
                   <Fragment>
                       <Card onChange = {this.onChange(item.entityName)} style= {{cursor: 'pointer'}}>
                       <List.Item
                           key={1}
                           actions={
                             [ 
                               
                               <Form.Item>
                                {getFieldDecorator(item.entityName, {
                                   valuePropName: 'checked',
                                   initialValue: this.allChecked,
                                 })(
                                  <Checkbox />
                                 )}
                                 
                               </Form.Item>
     
                             ]
                           }>
                           <Skeleton avatar title={false} loading={item.loading} active>
                             <List.Item.Meta
                               avatar={
                                 <Avatar src='https://15f76u3xxy662wdat72j3l53-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/OData-connector-e1530608193386.png' />
                               }
                               title={item.entityName}
                               description={item.datasource}
                             />
                             <div></div>
                           </Skeleton>
                         </List.Item>
                       </Card> 
                   </Fragment>
                   
                 )}
               />
             
                
               <Form.Item>
              
                 <Button id = 'button-explore-dataPage' type="primary" htmlType="submit" shape = 'round' size = 'large' icon={<CompassOutlined />}>
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
                 name='entitiesForm'
                 onFinish={this.onFinish}
             >
              
               <Card className = 'titleCard' title='Select Entities From Your Datasources' headStyle={{backgroundColor: 'rgba(255, 255, 255, 0.4)', border: 0, textAlign: 'center'}}>
               <Checkbox onChange={this.handleChange}  >Check all</Checkbox>
               <List
                 className='entitesList'
                 loading={initLoading}
                 itemLayout='horizontal'
                 loadMore={loadMore}
                 dataSource = {list}
                 
                 renderItem={item => (
                   
                   <Fragment>
                       <Card.Grid hoverable = {false} onChange = {this.onChange(item.entityName)} style= {{cursor: 'pointer'}}>
                       <List.Item
                           key={1}
                           actions={
                             [ 
                               
                               <Form.Item>
                                {getFieldDecorator(item.entityName, {
    
                                   valuePropName: 'checked',
                                   initialValue: this.allChecked,
                                 })(
                                   <Checkbox/>
                                 )}
                                 
                               </Form.Item>
     
                             ]
                           }>
                           <Skeleton avatar title={false} loading={item.loading} active>
                             <List.Item.Meta
                               avatar={
                                 <Avatar src='https://15f76u3xxy662wdat72j3l53-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/OData-connector-e1530608193386.png' />
                               }
                               title={item.entityName}
                               description={item.datasource}
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
                  <Button id = 'button-explore-dataPage' type="primary" htmlType="submit" shape = 'round' size = 'large' icon={<CompassOutlined />}>
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
