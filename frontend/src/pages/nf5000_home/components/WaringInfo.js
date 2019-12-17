import React, { Component } from 'react';
import { Col, Icon, Card, List,Table  } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

class WaringInfo extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  // eslint-disable-next-line class-methods-use-this
  renderWaringList(item) {
    let color = '';
    if (item[0] == 'CRITICAL' || item[0] == 'ERROR') {
      color = 'orange';
    }
    if (item[0] == 'ALERT' || item[0] == 'EMERGENCIES') {
      color = 'red';
    }
    return (
      <font color={color} >
        <Icon style={{ float: "left",marginTop:4 }} type="close-circle" />
        <span style={{ float: "left", display: 'inline-block' }}>
          {formatMessage({ id: 'waring.log.time' })} {item[1]}{' '}
        </span>
        <span style={{ float: "left", display: 'inline-block' }}>
          {formatMessage({ id: 'waring.log.level' })} {item[0]}{' '}
        </span>
        <span style={{ float: "left", display: 'inline-block' }}>
          {formatMessage({ id: 'waring.log.type' })} {item[2]}{' '}
        </span>
        <span style={{ display: 'inline-block' }}>
          {formatMessage({ id: 'waring.log.content' })} {item[3]}{' '}
        </span>
      </font>
    );
  }

  render() {
    const result = this.props.waringData;
    const waringData = [];
    for (var key in result) {
      waringData[key] = [
        result[key].waring_level,
        result[key].time,
        result[key].waring_type,
        result[key].content,
      ];
    }
    const columns = [
      
      {
        title: formatMessage({ id: 'waring.log.time' }),
        dataIndex: 'time',
        key: 'time',
        width: '28%',
        render:  (text, record) => {
          let color = '';
           if (record.waring_level =='WARNING') {
             color = '';
           }
           if (record.waring_level == 'CRITICAL'||record.waring_level == 'ERROR') {
             color = 'orange';
           }
           if(record.waring_level == 'ALERT'||record.waring_level == 'EMERGENCIES') {
            color = 'red';
          }
           return (
             <font color={color}>
               <Icon type="close-circle" />&nbsp;
               {formatMessage({ id: 'waring.log.time' })}
               {text}
             </font>
           );
      }
      },
      
      {
        title: formatMessage({ id: 'waring.log.level' }),
        dataIndex: 'waring_level',
        key: 'waring_level',
        width: '18%',
        render:  (text, record) => {
          let color = '';
           if (text =='WARNING') {
             color = '';
           }
           if (text == 'CRITICAL'||text == 'ERROR') {
             color = 'orange';
           }
           if(record.waring_level == 'ALERT'||record.waring_level == 'EMERGENCIES') {
            color = 'red';
          }
           return (
            <font color={color}>
            {formatMessage({ id: 'waring.log.level' })} 
            {text}
          </font>
           );
      }
      },
      {
        title: formatMessage({ id: 'waring.log.type' }),
        dataIndex: 'waring_type',
        key: 'waring_type',
        width: '20%',
        render:  (text, record) => {
          let color = '';
           if (record.waring_level  =='WARNING') {
             color = '';
           }
           if (record.waring_level  == 'CRITICAL'||record.waring_level  == 'ERROR') {
             color = 'orange';
           }
           if(record.waring_level == 'ALERT'||record.waring_level == 'EMERGENCIES') {
            color = 'red';
          }
           return (
            <font color={color}>
            {formatMessage({ id: 'waring.log.type' })} 
            {text}
            </font>
           );
      }
      },
      {
        title: formatMessage({ id: 'waring.log.content' }),
        dataIndex: 'content',
        key: 'content',
        width: '20%',
        render:  (text, record) => {
          let color = '';
          let xFlase = false;
           if (record.waring_level =='WARNING') {
             color = '';
           }
          if(record.waring_level == 'CRITICAL'||record.waring_level == 'ERROR') {
             color = 'orange';
           }
           if(record.waring_level == 'ALERT'||record.waring_level == 'EMERGENCIES') {
            color = 'red';
          }
           return (
             <font color={color}>
                {formatMessage({ id: 'waring.log.content' })} 
               {text}
             </font>
           );
      }
      },
    ];
    return (
      <Col span={24} style={{ marginBottom: 24 }}>
        <Card
          title={formatMessage({ id: 'waring.log' })}
          headStyle={{ fontSize: 20, fontWeight: 700 }}
          bodyStyle={{ padding: 15 }}
        >
         
           <Table
            bordered={false}
            showHeader={false}
            columns={columns}
            dataSource={result}
            pagination={false}
            size="small"
          />
        </Card>
      </Col>
    );
  }
}

export default WaringInfo;
