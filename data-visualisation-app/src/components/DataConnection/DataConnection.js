import React from 'react';
import { List, Avatar, Button, Skeleton } from 'antd';
import {Modal, Input, Select} from 'antd';
import './DataConnection.scss';
import AddConnection from '../AddConnection';

import reqwest from 'reqwest';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

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
        data: res.results,
        list: res.results,
      });
    });
  }

  getData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };


  changeAddState = () => {
    this.setState({
      addConnection : !this.state.addConnection,
    });
  };

  next = () => {
    this.props.setStage('addEntities');
  };


  // onLoadMore = () => {
  //   this.setState({
  //     loading: true,
  //     list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
  //   });
  //   this.getData(res => {
  //     const data = this.state.data.concat(res.results);
  //     this.setState(
  //       {
  //         data,
  //         list: data,
  //         loading: false,
  //       },
  //       () => {
  //         // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
  //         // In real scene, you can using public method of react-virtualized:
  //         // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
  //         window.dispatchEvent(new Event('resize'));
  //       },
  //     );
  //   });
  // };

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
          <Button onClick={this.changeAddState}>Add Connection</Button>
          <Button onClick={this.next}>Next</Button>
        </div>
      ) : null;
   
    return (
     <div>
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <List.Item
              actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://15f76u3xxy662wdat72j3l53-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/OData-connector-e1530608193386.png" />
                  }
                  title={<a href="https://ant.design">{item.name.last}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
                <div>data source</div>
              </Skeleton>
            </List.Item>
          )}
        />
        <main>
        {
            this.state.addConnection ? 
            
              <AddConnection changeState = {this.changeAddState}/>
            
            :
            null
        }
        
        </main>
      </div>
    );
  }
}

export default DataConnection;