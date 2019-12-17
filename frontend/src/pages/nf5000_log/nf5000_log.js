/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { moment } from 'moment';
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
} from 'antd';
import { connect } from 'dva';
import { any } from 'prop-types';
import Highlighter from 'react-highlight-words';
import { LOG_MODULE } from './nf5000_log_config' ;
@connect(({ nf5000_log, loading }) => {
  return {
    returnSysLogData: nf5000_log.returnIpReassemblyData,
    returnWaringLogData: nf5000_log.returnDeduplicationData,
  };
})
export default class SysLog extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    searchText: '',
    data: [],
    pagination: {},
    loading: false,
    start_time: null,
    end_time: null,
    searchKey: 0,
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
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          {formatMessage({ 'id': 'log.syslog.search' })}
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          icon="redo"
          style={{ width: 90 }}
        >
          {formatMessage({ 'id': 'log.syslog.reset' })}
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  getTimeColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ width: 450, height: 100, paddingTop: 15 }}>
        <Col>
          <DatePicker
            style={{ width: 200, margin: 10, float: 'right' }}
            placeholder={formatMessage({ 'id': 'log.syslog.end_time' })}
            onChange={this.onOpenChange.bind(this, 'end_time')}
            value={this.state.end_time}
          />
        </Col>
        <Col>
          <DatePicker
            style={{ width: 200, margin: 10, float: 'right' }}
            placeholder={formatMessage({ 'id': 'log.syslog.start_time' })}
            onChange={this.onOpenChange.bind(this, 'start_time')}
            value={this.state.start_time}
          />
        </Col>

        <Col style={{ float: 'right' }}>
          <Button
            onClick={() => this.handleDefaultSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ marginRight: 10 }}
          >
            {formatMessage({ 'id': 'log.syslog.search' })}
          </Button>
          <Button
            onClick={() => this.resetSearchTime(clearFilters)}
            size="small"
            icon="redo"
            style={{ marginRight: 10 }}
          >
            {formatMessage({ 'id': 'log.syslog.reset' })}
          </Button>
        </Col>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="calendar" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  componentDidMount() {
    this.fetchSysLog({});
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetchSysLog({
      pagesize: pagination.pageSize,
      page: pagination.current,
      sort_field: sorter.field,
      sort_order: sorter.order,
      start_time: this.state.start_time ? this.GMTToStr(this.state.start_time) : '',
      end_time: this.state.end_time ? this.GMTToStr(this.state.end_time) : '',
      ...filters,
    });
  };

  handleTimeChange = () => {
    this.fetchSysLog({
      pagesize: this.state.pagination.pageSize ? 10 : 10,
      page: this.state.pagination.current ? this.state.pagination.current : 1,
      sort_field: this.state.sortedInfo ? this.state.sortedInfo.field : '',
      sort_order: this.state.sortedInfo ? this.state.sortedInfo.order : '',
      start_time: this.state.start_time ? this.GMTToStr(this.state.start_time) : '',
      end_time: this.state.end_time ? this.GMTToStr(this.state.end_time) : '',
      ...this.state.filteredInfo,
    });
  };

  resetSearchTime = clearFilters => {
    //在回调里面，调用函数，解决state延迟更新的问题
    this.setState({
      start_time: null,
      end_time: null,
    },function (){
      clearFilters();
      this.handleTimeChange();
    });
  };

  handleDefaultSearch = (selectedKeys, confirm) => {
    confirm();
    this.handleTimeChange()
  };

  clearAll = () => {
    this.setState({
      searchKey: this.state.searchKey + 1
    })
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
      start_time: null,
      end_time: null,
    });
    this.fetchSysLog();
  };

  toQueryPair(key, value) {
    if (typeof value == 'undefined') {
      return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
  }
  toQueryString(obj) {
    var ret = [];
    for (var key in obj) {
      key = encodeURIComponent(key);
      var values = obj[key];
      if (values && values.constructor == Array) {
        //数组
        var queryValues = [];
        for (var i = 0, len = values.length, value; i < len; i++) {
          value = values[i];
          queryValues.push(this.toQueryPair(key, value));
        }
        ret = ret.concat(queryValues);
      } else {
        //字符串
        ret.push(this.toQueryPair(key, values));
      }
    }
    return ret.join('&');
  }

  search() {
    this.setState({ searchText: '' });
    this.fetchSysLog();
  }

  fetchSysLog = (params = {}) => {
    const paramsString = this.toQueryString(params);
    const { dispatch } = this.props;
    dispatch({
      type: 'nf5000_log/getSysLog',
      payload: paramsString,
    })
      .then(res => {
        const pagination = { ...this.state.pagination };
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = res.total_count;
        this.setState({
          loading: false,
          data: res.data,
          pagination,
        });
      })
      .catch(err => { })
      .finally(() => { });
  };

  handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleReset = clearFilters => {
    clearFilters();
  };

  onOpenChange(flag, date, dateString) {
    if (flag == 'start_time') {
      this.setState({
        start_time: date,
      });
    } else {
      this.setState({
        end_time: date,
      });
    }
  }

  GMTToStr(time) {
    let date = new Date(time)
    let Str = date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate() + ' '
    return Str
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: formatMessage({ 'id': 'log.syslog.username' }),
        dataIndex: 'username',
        key: 'username',
        width: '15%',
        ellipsis: true,
        // filteredValue: filteredInfo.username || null,
        ...this.getColumnSearchProps('username'),
      },
      {
        title: formatMessage({ 'id': 'log.syslog.module' }),
        dataIndex: 'module',
        key: 'module',
        width: '20%',
        filters: LOG_MODULE,
        filterMultiple: false,
      },
      {
        title: formatMessage({ 'id': 'log.syslog.operate' }),
        dataIndex: 'operate',
        key: 'operate',
        width: '25%',
        ...this.getColumnSearchProps('operate'),
      },
      {
        title: formatMessage({ 'id': 'log.syslog.ip' }),
        dataIndex: 'ip_address',
        key: 'ip_address',
        width: '20%',
        ...this.getColumnSearchProps('ip_address'),
      },
      {
        title: formatMessage({ 'id': 'log.syslog.operate_time' }),
        dataIndex: 'time',
        key: 'time',
        width: '20%',
        ...this.getTimeColumnSearchProps('time'),
        sorter: (a, b) => {
          // const time1 = new Date(a.time);
          // const time2 = new Date(b.time);
          // return time1.getTime() - time2.getTime();
        },
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card title="">
          <div style={{ padding: 8, float: 'right' }}>
            <Button icon="sync" onClick={this.clearAll} style={{ marginRight: 10 }}>
              {formatMessage({ 'id': 'log.syslog.refresh' })}
            </Button>
            <Button style={{ cursor: "pointer" }}>
            <a href="/api/log/export">
                <Icon type="download" /> &nbsp;
                {formatMessage({'id':'log.syslog.export'})}
              </a>
            </Button>
          </div>
          <Table
            key={this.state.searchKey}
            bordered
            columns={columns}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            style={{ marginTop: 30 }}
            size="small"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
