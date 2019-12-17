import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import {
  Table,
  InputNumber,
  Card,
  Modal,
  Select,
  Button,
  Switch,
  Row,
  Col,
  message,
  Input,
  Icon,
  TimePicker,
  DatePicker,
  Tag
} from 'antd';
import { connect } from 'dva';
import { any } from 'prop-types';
import Highlighter from 'react-highlight-words';
import { WARING_LEVELS , WARING_TYPES } from './nf5000_log_config' ;

@connect(({ nf5000_log, loading }) => {
  return {
    returnSysLogData: nf5000_log.returnIpReassemblyData,
    returnWaringLogData: nf5000_log.returnDeduplicationData
  };
})
export default class WaringLog extends React.Component {   
  state = {
    searchText: '',
    data: [],
    pagination: {},
    loading: false,
    searchKey:0,
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          // placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
           {formatMessage({'id':'log.syslog.search'})}
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
        {formatMessage({'id':'log.syslog.reset'})}
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  componentDidMount() {
    this.fetch2({});
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch2({
      pagesize: pagination.pageSize,
      page: pagination.current,
      sort_field: sorter.field,
      sort_order: sorter.order,
      start_time:this.state.start_time,
      end_time:this.state.end_time,
      ...filters,
    });
  };

  refresh(){
    this.setState({
       searchText: '',
       searchKey: this.state.searchKey + 1
      });
    this.fetch2();
  }
  
  fetch2 = (params = {}) => {
    const { dispatch } = this.props
    dispatch({
        type: 'nf5000_log/getWaringLog',
        payload:params
    }).then((res)=>{
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = res.total_count;
      this.setState({
        loading: false,
        data: res.data,
        pagination,
      });
    }).catch((err)=>{
        
    }).finally(()=>{
    })
  };

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
  };

  onOpenChange(flag,date, dateString) {
    if(flag=='start_time'){
      this.setState({
        start_time:dateString
      })
    }else{
      this.setState({
        end_time:dateString
      }) 
    }
  }

  render() {
    const columns = [
      {
        title: formatMessage({'id':'log.waringlog.waring.level'}),
        dataIndex: 'waring_level',
        key: 'waring_level',
        width: '20%',
        filters: WARING_LEVELS,  
        filterMultiple: true,
        onFilter: (value, record) => record.waring_level.indexOf(value) === 0,
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
             <Tag color={color} key={text}>
               {text}
             </Tag>
           );
      }
      },
      {
        title: formatMessage({'id':'log.waringlog.waringType'}),
        dataIndex: 'waring_type',
        key: 'waring_type',
        width: '20%',
        filters: WARING_TYPES,  
        filterMultiple: true,
        onFilter: (value, record) => record.waring_type.indexOf(value) === 0,
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
            {text}
            </font>
           );
      }
      },
      {
        title: formatMessage({'id':'log.waringlog.time'}),
        dataIndex: 'time',
        key: 'time',
        defaultSortOrder: 'descend',
        sortDirections: ['descend'],
        width: '20%',
        sorter: (a, b) =>{
          const time1 = new Date( a.time); 
          const time2 = new Date( b.time); 
          return time1.getTime() - time2.getTime() ;  
        },
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
               {text}
             </font>
           );
      }
      },
     
      {
        title: formatMessage({'id':'log.waringlog.content'}),
        dataIndex: 'content',
        key: 'content',
        width: '50%',
        ...this.getColumnSearchProps('content'),
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
               {text}
             </font>
           );
      }
      },
      
    ];
    return (
      <PageHeaderWrapper>
        <Card title=''>
        <Col style={{float:"right",marginBottom:10}}>
        <Button icon="sync" onClick={this.refresh.bind(this)}> {formatMessage({'id':'log.syslog.refresh'})}</Button>
        </Col>
      <Table bordered columns={columns}
        key={this.state.searchKey}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        style={{marginTop:20}}
        size='small'
      />
      </Card>
      </PageHeaderWrapper>
      )
  }
}
