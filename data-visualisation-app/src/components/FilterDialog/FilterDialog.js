/**
 *   @file FilterDialog.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   15/7/2020   Byron Tominson      Original
 *
 *   Test Cases: data-visualisation-app/src/tests/FilterDialog.test.js
 *
 *   Functional Description:
 *   Modal for filtering dashboard suggestions
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

/**
  * Imports
*/
import React, {useState} from 'react';
import {Button, Modal, Select, Tag, Form} from 'antd';
import request from '../../globals/requests';
import {message} from 'antd';



function tagRender(props) {

    var tagColour = 'purple';

    const { label, value, closable, onClose } = props;
  

    //adjust tag colour
    
    var firstLetter = value.substring(0,1);
    var magenta = /^[A-Fa-f]+$/;
    var green = /^[Q-Uq-u]+$/;
    var gold = /^[G-Kg-k]+$/;
    var cyan = /^[L-Pl-p]+$/;
    

    if(magenta.test(firstLetter))
    {
        tagColour='magenta';
    }
    else if(gold.test(firstLetter)){
        tagColour='gold';
    }
    else if(cyan.test(firstLetter)){
        tagColour='cyan';
    }
    else if(green.test(firstLetter)){
        tagColour='green';
    }
  

    return (
      <Tag color={tagColour} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    );
  }

const FilterDialog = (props) => {

    const [visible, setVisible] = useState(true);
    
    const graphTypes = [{ value: 'bar' }, { value: 'pie' }, { value: 'line' }, { value: 'scatter' }, { value: 'effectScatter' }];

    
    var obj = {};
    var checkForDuplicate = [];

    request.user.fields = [];
    var fieldsToDisplay = [];
    
    request.user.selectedEntities.map((item) => {
        request.user.fields = request.user.fields.concat(item.fields);
    });

    request.user.fields.map((item) => {
        if(!checkForDuplicate.includes(item)){
            checkForDuplicate.push(item);
            obj = {};
            obj = JSON.parse(JSON.stringify(obj));
            obj['value'] = item;
            fieldsToDisplay.push(obj);
        }
    });
    checkForDuplicate = [];


    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 },
      };
      const tailLayout = {
        wrapperCol: { offset: 10, span: 16 },
      };

      const onFinish = values => {

        
        request.user.selectedFields = [];
        if(values.fieldSelect !== undefined){
            request.user.selectedFields = values.fieldSelect;
        }
        
        request.user.graphTypes = ['bar','line', 'pie', 'scatter', 'effectScatter'];
        if(values.graphSelect !== undefined){
            request.user.graphTypes = values.graphSelect;
        }
        

        //API call (to send options and reload suggestions)
        console.log('Success:', values);

        handleFilterCancel();
        message.success('Filter settings set');
        //props.generateCharts(request.user.graphTypes, request.user.selectedEntities,  request.user.selectedFields, request.user.fittestGraphs);
      };
    
      const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
        handleFilterCancel();
      };

    function handleFilterCancel() {
        setVisible(false);
        props.setFState(false);
    };


    return (
        <div >
            <Modal
                title="Filter"
                visible={visible}
                onCancel={handleFilterCancel}
                footer={[
                    
                  ]}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    
                    <Form.Item 
                        name="graphSelect"
                        label="Graph type"
                    >
                        <Select
                            mode="multiple"
                            tagRender={tagRender}
                            style={{ width: '100%' }}
                            options={graphTypes}
                            defaultValue={request.user.graphTypes}
                        />
                    </Form.Item>

                    <Form.Item
                        name="fieldSelect"
                        label="Fields"
                    >
                        <Select
                            mode="multiple"
                            tagRender={tagRender}
                            style={{ width: '100%' }}
                            options={fieldsToDisplay}
                            defaultValue={[]}
                        />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary"  htmlType="submit">
                            Ok
                        </Button>
                    </Form.Item>
                    </Form>
            
            </Modal>
        </div>
    );
};

export default FilterDialog;
