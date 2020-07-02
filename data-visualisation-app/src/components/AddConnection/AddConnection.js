import React, {useState} from 'react';
import {Button, Modal, Input, Select} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function AddConnection(props) {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [currentOkText, setCurrentOkText] = useState('Add');

    function showModal() {
        setVisible(true);
    };

    function handleOk(e) {
        console.log(e);
        // setVisible(false);
        setConfirmLoading(true);
        console.log(finished);
        if (finished) {
            setVisible(false);
            setConfirmLoading(false);
        } else {
            setTimeout(() => {
                setFinished(true);
                setCurrentOkText('Done');
                setConfirmLoading(false);
            }, 2000);
        }
    };

    function handleCancel(e) {
        console.log(e);
        setVisible(false);
    };

    const selectBefore = (
        <Select defaultValue="http://" className="select-before">
            <Select.Option value="http://">http://</Select.Option>
            <Select.Option value="https://">https://</Select.Option>
        </Select>
    );

    return (
        <div >
            <PlusOutlined onClick={showModal} />
            <Modal
                title="Add Connection"
                visible={visible}
                onOk={handleOk}
                okText={currentOkText}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >

                <Input addonBefore={selectBefore} defaultValue="mysite" />



            </Modal>
        </div>
    );
}

export default AddConnection;
