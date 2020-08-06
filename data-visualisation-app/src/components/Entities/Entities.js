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

import './Entities.css';
import React, { Fragment } from 'react';
import { List, Avatar, Button, Skeleton, Form, Checkbox } from 'antd';
import {CompassOutlined} from '@ant-design/icons';
import reqwest from 'reqwest';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';

const count = 20;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;



class Entities extends React.Component {

  onFinish = values => {
    console.log('Received values of form: ', values);
    this.next();
  };

  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };


  onChange = (item) => {
    console.log(item.name.last);
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
    

    //call on all data soureces
  

        request.entities.list('https://services.odata.org/V2/Northwind/Northwind.svc', function(result) {
          console.log(result);
          if (result === constants.RESPONSE_CODES.SUCCESS) {
            callback(request.user.dataSources);
          }
        });

      
    
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
        </div>
      ) : null;
   

    return (
      
     <div>
        <Form
            name='entitiesForm'
            onFinish={this.onFinish}
        >
          <List
            className='dataSourceList'
            loading={initLoading}
            itemLayout='horizontal'
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
            
              <Fragment>
                  {/*<div id = 'selectorDiv' onClick = {() => {this.onChange(item)}}>*/}
                    <List.Item
                      key={item.name.first}
                      actions={
                        [ 
                        <Form.Item name = {item.name.first} valuePropName = 'checked'>
                            <Checkbox defaultChecked = {false}></Checkbox>
                        </Form.Item>
                        ]
                      }>
                      <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                          avatar={
                            <Avatar src='https://15f76u3xxy662wdat72j3l53-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/OData-connector-e1530608193386.png' />
                          }
                          title={<a href="https://ant.design">{item.name.last}</a>}
                          description='Ant Design, a design language for background applications, is refined by Ant UED Team'
                        />
                        <div></div>
                      </Skeleton>
                    </List.Item>
                    {/*</div>*/}
              </Fragment>
            )}
          />
          <Form.Item>
            <Button id = 'button-explore-dataPage' type="primary" htmlType="submit" shape = 'round' icon={<CompassOutlined />}>
              Generate Suggestions
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Entities;
