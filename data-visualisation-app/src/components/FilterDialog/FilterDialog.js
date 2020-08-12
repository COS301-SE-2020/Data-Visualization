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
import React, {useState, useEffect} from 'react';
import {Button, Modal, Select, Tag, Form} from 'antd';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';



//API call (to get options)

const graphTypes = [{ value: 'Bar graph' }, { value: 'Pie chart' }, { value: 'Histogram' }, { value: 'Line graph' }, { value: 'Scatter plot' }];

var tempFields = [];


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
    // const [fieldTypes, setFieldTypes] = useState([]);

    // useEffect(() => {
	
    //     request.filter.list('https://services.odata.org/V2/Northwind/Northwind.svc', 'Orders', function(result) {
    //         if (result === constants.RESPONSE_CODES.SUCCESS) {
              
    //             console.log(request.user.fields);
                
    //             request.user.fields.map(function(entityVal) {
    //                 tempFields = tempFields.concat({value : entityVal});
    //             });
                
    //             console.log(tempFields);
            
    //             setFieldTypes(
    //                 tempFields
    //             );

    //         }
    //     });

	// }, []);


 

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 },
      };
      const tailLayout = {
        wrapperCol: { offset: 10, span: 16 },
      };

      const onFinish = values => {
       
        //API call (to send options and reload suggestions)

        console.log('Success:', values);
        handleFilterCancel();
      };
    
      const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
        handleFilterCancel();
      };

    function handleFilterCancel() {
        props.setFState(false);
        setVisible(false);
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
                            options={props.fieldTypes}
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
