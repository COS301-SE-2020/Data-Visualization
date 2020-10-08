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
import React, { Fragment} from 'react';
import { List, Avatar, Skeleton, Form, Checkbox, Card, message } from 'antd';
import {CompassOutlined} from '@ant-design/icons';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import { createForm } from 'rc-form';



var showAll = false;
let mobileView = false;

var entityIDs = []; 

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
      if(this.formRef.current.getFieldValue(item.entityName+item.datasource) === true){
        request.user.selectedEntities.push(item);
        atLeastOne = true;
      }
    });
  
    if(atLeastOne){
      //console.log(request.user.selectedEntities);
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
    //console.log( entityIDs.length);

    entityIDs.forEach((id) => {
      tempItem[id] = showAll;
      //this.formRef.current.setFieldsValue(tempItem);

      if(showAll){
        if(!mobileView){
          document.getElementById('card-'+id).style.backgroundColor = 'white';
          document.getElementById('card-'+id).style.boxShadow  = '0 2px 12.2px -20px #434ee8,0 5.7px 12.3px -20px #434ee8,0 2px 7px -20px #434ee8,0 5.3px 12.9px -20px #434ee8,0 2.8px 12.4px -20px #434ee8,0 5px 30px -20px #434ee8';
        } 
      }
      else{
        if(!mobileView){
          document.getElementById('card-'+id).style.backgroundColor = '';
          document.getElementById('card-'+id).style.boxShadow = '';
        }
      }
     
    });
    
    this.formRef.current.setFieldsValue(tempItem);
    
    // this.props.form.setFieldsValue({
    //   [e.target.name]: e.target.value,
    // });

    

  }


  next = () => {
    this.props.setStage('suggestions');
  };

  
  /**
    * invoked immediately after a component is mounted (inserted into the tree).
  */
  componentDidMount() {
    entityIDs = []; 
    
    showAll = false;
    request.user.selectedFields = [];
    request.user.graphTypes = ['bar','line', 'pie', 'scatter'];

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
      //console.log(source);
     
      request.entities.list(source.sourceurl, source.sourcetype, function(result) {

          if (result === constants.RESPONSE_CODES.SUCCESS) {
  
            request.user.entities = Object.keys(request.user.dataSourceInfo.entityList);
            
            request.user.entities.map((entityName) => {
              entityIDs.push(entityName+source.sourceurl);
              
              Obj = JSON.parse(JSON.stringify(Obj));
              Obj['entityName'] = entityName;
              Obj['datasource'] = source.sourceurl;
              Obj['fields'] = request.user.dataSourceInfo.entityList[entityName];
              Obj['datasourcetype'] = source.sourcetype;
              Obj['datasourcename'] = source.sourcename;
              Obj['isLiveData'] = source.islivedata;

              
              request.user.entitiesToDisplay.push(Obj);

            });
            callback(request.user.entitiesToDisplay);
          }
        });
    });
   
  };

  render() {
  
    //const { getFieldDecorator } = this.props.form;
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
      mobileView = mql.matches;

      if (mobileView) {
        return (
    
          <div>
             <Form
                ref={this.formRef}
                name='entitiesForm'
                onFinish={this.onFinish}
             >
      
               <Card className = 'titleCard' title='Select Entities From Your Data Sources' headStyle={{backgroundColor: 'rgba(255, 255, 255, 0.4)', border: 0, textAlign: 'center'}}>
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
                   
                       <Card id = {'card-'+item.entityName+item.datasource} onClick={() => { 
                                                 
                          var tempItem = {};
                          tempItem[item.entityName+item.datasource] = !this.formRef.current.getFieldValue(item.entityName+item.datasource);
                          this.formRef.current.setFieldsValue(tempItem);

                        }} 
                        >

                       <List.Item
                           key={1}
                           actions={
                             [ 
                               
                              <Form.Item name={item.entityName+item.datasource} valuePropName='checked'>
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
                               description={item.datasourcename}
                             />
                             <div></div>
                           </Skeleton>
                         </List.Item>
                       </Card> 
                   </Fragment>
                 )}
               />

               <Form.Item>
              
               <div className="blob-div" >
                  <button className="preblob-btn" id={request.user.isLoggedIn ? 'loggedIn_generateSuggestions' : 'loggedOut_generateSuggestions'}
                    type='submit' shape = 'round' size = 'large' icon={<CompassOutlined />}>
                    Generate Suggestions

                    <span className="preblob-btn__inner">
                            <span className="preblob-btn__blobs">
                                <span className="preblob-btn__blob"></span>
                                <span className="preblob-btn__blob"></span>
                                <span className="preblob-btn__blob"></span>
                                <span className="preblob-btn__blob"></span>
                    </span>
                    </span>
                  </button>

                  <br/>

                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                    <defs>
                      <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
                        <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
                      </filter>
                    </defs>
                  </svg>

                </div>
                
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
              
               <Card className = 'titleCard' bordered = {false} title='Select Entities From Your Data Sources' style= {{width:'80%', margin: '0 auto', marginTop: '20px', backgroundColor: 'transparent'}} headStyle={{ border: 0, textAlign: 'center'}}>
               <Checkbox onChange={this.handleChange}  >Check All</Checkbox>
               <List
                 className='entitesList'
                 loading={initLoading}
                 itemLayout='horizontal'
                 loadMore={loadMore}
                 dataSource = {list}
                 
                 renderItem={item => ( 
                   <Fragment>
                       <Card.Grid hoverable = {false} className='entities__entity' id = {'card-'+item.entityName+item.datasource}  style= {{cursor: 'pointer', margin: '10px', marginLeft: '50px', width:'28%',  backgroundColor: 'transparent'}}  onClick={() => {
                          var tempItem = {};
                          tempItem[item.entityName+item.datasource] = !this.formRef.current.getFieldValue(item.entityName+item.datasource);
                          this.formRef.current.setFieldsValue(tempItem);

                
                          if(tempItem[item.entityName+item.datasource]  === false){                       
                            document.getElementById('card-'+item.entityName+item.datasource).style.boxShadow  = '';
                            document.getElementById('card-'+item.entityName+item.datasource).style.backgroundColor = '';
                           }
                          else{
                            document.getElementById('card-'+item.entityName+item.datasource).style.backgroundColor = 'white';
                            document.getElementById('card-'+item.entityName+item.datasource).style.boxShadow  = '0 2px 12.2px -20px #434ee8,0 5.7px 12.3px -20px #434ee8,0 2px 7px -20px #434ee8,0 5.3px 12.9px -20px #434ee8,0 2.8px 12.4px -20px #434ee8,0 5px 30px -20px #434ee8';
                          }
                     
                        }} 
                        >
                        
                       <List.Item
                           key={1}
                           actions={
                             [ 
                               
                              <Form.Item name={item.entityName+item.datasource} valuePropName='checked'>
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
                               description={item.datasourcename}
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
               <div className="blob-div" >
                  <button className="preblob-btn" id={request.user.isLoggedIn ? 'loggedIn_generateSuggestions' : 'loggedOut_generateSuggestions'}
                    type='submit' shape = 'round' size = 'large' icon={<CompassOutlined />}>
                    Generate Suggestions

                    <span className="preblob-btn__inner">
                            <span className="preblob-btn__blobs">
                                <span className="preblob-btn__blob"></span>
                                <span className="preblob-btn__blob"></span>
                                <span className="preblob-btn__blob"></span>
                                <span className="preblob-btn__blob"></span>
                    </span>
                    </span>
                  </button>

                  <br/>

                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                    <defs>
                      <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
                        <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
                      </filter>
                    </defs>
                  </svg>

                </div>
               </Form.Item>
               
             </Form>
           </div>
         );
      }
    
  }
}

Entities = createForm()(Entities);
export default Entities;