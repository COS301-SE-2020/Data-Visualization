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
import { List, Avatar, Button, Skeleton, Form, Checkbox, Card } from 'antd';
import {CompassOutlined} from '@ant-design/icons';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import { createForm } from 'rc-form';



class Entities extends React.Component {


  state = {
    initLoading: true,
    loading: false,
    checked : true,
    data: [],
    list: [],
    allChecked: true,
  };

  onFinish = values => {
   
    request.user.entitiesToUse = [];
    request.user.entitiesToDisplay.map((item) => {
      if(this.props.form.getFieldValue(item.entityName) === true){
        request.user.entitiesToUse.push(item);
      }
    });

    console.log(request.user.entitiesToUse);
    
    this.next();
  };


  handleChange = (e) => {
    this.setState({
      allChecked: !this.allChecked
    });
    this.allChecked = !this.allChecked;
  }


  onChange = (item) => {
   
    console.log(this.props.form.getFieldValue('Categories'));
    
  };


  next = () => {
    this.props.setStage('suggestions');
  };


  
  /**
    * invoked immediately after a component is mounted (inserted into the tree).
  */
  componentDidMount() {
    

    console.log(request.user.isLoggedIn);
      this.getData(res => {
        this.setState({
          initLoading: false,
          data: request.user.entitiesToDisplay,
          list: request.user.entitiesToDisplay,
        });

      });

      
    
  }


  /**
    * Funnction uses the dataSources to update the entites list.
  */
  getData = callback => {
   
    var Obj = {};
    request.user.entitiesToDisplay = [];
    request.user.dataSourceInfo = [];
    request.user.entities = [];

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
   

    return (
      
     <div>
        <Form
            name='entitiesForm'
            onFinish={this.onFinish}
        >
          <Card><Checkbox onChange={this.handleChange}  >Check all</Checkbox></Card>
        
          <List
            className='entitesList'
            loading={initLoading}
            itemLayout='horizontal'
            loadMore={loadMore}
            dataSource = {list}
            
            renderItem={item => (
            
              <Fragment>
                  {/* <div id = 'selectorDiv' onClick = {() => {this.onChange(item);}}> */}
                  <Card hoverable>
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
                
                    
                  {/* </div> */}
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
  }
}

Entities = createForm()(Entities);
export default Entities;
