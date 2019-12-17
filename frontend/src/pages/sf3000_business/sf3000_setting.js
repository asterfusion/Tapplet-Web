import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import {
  Form,
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
  Spin,
} from 'antd';
import './sf3000_setting.less';
import { connect } from 'dva';
import { any } from 'prop-types';

const FormItem = Form.Item;

//去重表单组件
class DupForm extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    loading: false,
    iconLoading: false,
    disabledFlag: false,
  };
  //表单验证，并提交数据
  handleSubmit = () => {
    const deduplicationInfo = this.props.form.getFieldsValue();
    const type = 'deduplication';
    const { form } = this.props;
    const { values, validateFields } = form;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.setCommonConfig(type, deduplicationInfo);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { setCommonConfig, disabledFlag, iconLoading } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 5 },
      className: 'ant-col-12 ',
    };
    console.table(this.props.returnDeduplicationData);
    return (
      <Form>
        <FormItem label={formatMessage({ id: 'app.duplicate.deep.match' })} {...formItemLayout}>
          {getFieldDecorator('compare_bytes', {
            initialValue: this.props.returnDeduplicationData.compare_bytes,
            rules: [
              {
                required: true,
                message: formatMessage({id:'app.msg.empty'}),
              },
            ],
          })(<InputNumber  min={0} max={128} disabled={disabledFlag} />)}
        </FormItem>
        <FormItem label={formatMessage({ id: 'app.duplicate.offset.deep' })} {...formItemLayout}>
          {getFieldDecorator('compare_offset', {
            initialValue: this.props.returnDeduplicationData.compare_offset,
            rules: [
              {
                required: true,
                message: formatMessage({id:'app.msg.empty'})
              },
            ],
          })(<InputNumber  min={0} max={2000} disabled={disabledFlag} />)}
        </FormItem>
        <FormItem label={formatMessage({id:'app.duplicate.tcp'})} {...formItemLayout}>
          {getFieldDecorator('no_care_tcp', {
            initialValue: this.props.returnDeduplicationData.no_care_tcp ? true : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem label={formatMessage({id:'app.duplicate.ttl'})} {...formItemLayout}>
          {getFieldDecorator('no_care_ttl', {
            valuePropName: 'checked',
            initialValue: this.props.returnDeduplicationData.no_care_ttl ? true : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem label={formatMessage({id:'app.duplicate.mac'})} {...formItemLayout}>
          {getFieldDecorator('no_care_mac', {
            valuePropName: 'checked',
            initialValue: this.props.returnDeduplicationData.no_care_mac ? true : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem label={formatMessage({id:'app.duplicate.i2'})} {...formItemLayout}>
          {getFieldDecorator('no_care_l2', {
            valuePropName: 'checked',
            initialValue: this.props.returnDeduplicationData.no_care_l2 ? true : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem label={formatMessage({id:'app.duplicate.dscp'})} {...formItemLayout}>
          {getFieldDecorator('no_care_dscp', {
            valuePropName: 'checked',
            initialValue: this.props.returnDeduplicationData.no_care_dscp ? true : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem label={formatMessage({id:'app.duplicate.port'})} {...formItemLayout}>
          {getFieldDecorator('no_care_interface', {
            valuePropName: 'checked',
            initialValue: this.props.returnDeduplicationData.no_care_interface ? true : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem className="ant-col-24">
          <Button
            style={{ float: 'right' }}
            type="primary"
            loading={iconLoading}
            onClick={this.handleSubmit.bind(this)}
            disabled={!this.props.canWrite}
          >
            {formatMessage({id:'app.msg.setting'})}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const DupSForm = Form.create()(DupForm);

//KeyWord表单组件
class KeyWordForm extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    disabledFlag: false,
    iconLoading: false,
  };
  //表单验证，并提交数据
  handleSubmit = () => {
    const keywordInfo = this.props.form.getFieldsValue();
    const type = 'keyword';
    const { form } = this.props;
    const { values, validateFields } = form;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.setCommonConfig(type, keywordInfo);
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { setCommonConfig, disabledFlag, iconLoading } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 5 },
      className: 'ant-col-12 ',
    };

    return (
      <Form>
        <FormItem label={formatMessage({id:'app.keyword.keyword'})} {...formItemLayout}>
          {getFieldDecorator('keyw_modulel_switch', {
            valuePropName: 'checked',
            initialValue: this.props.returnKeyWordData.keyw_modulel_switch ? true : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem label={formatMessage({id:'app.keyword.keyflow'})} {...formItemLayout}>
          {getFieldDecorator('keyw_flow_switch', {
            valuePropName: 'checked',
            initialValue: this.props.returnKeyWordData.keyw_flow_switch ? true : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem className="ant-col-24">
          <Button
            style={{ float: 'right' }}
            type="primary"
            loading={iconLoading}
            onClick={this.handleSubmit}
            disabled={!this.props.canWrite}
          >
            {formatMessage({id:'app.msg.setting'})}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const KWForm = Form.create()(KeyWordForm);

//IPR表单组件
class IpReassemblyForm extends React.Component {
  constructor(props) {
    super(props);
  }
  //表单验证，并提交数据
  handleIpRSubmit = () => {
    const ipRConfigInfo = this.props.form.getFieldsValue();
    const { form } = this.props;
    const { values, validateFields } = form;
    let type = 'ip_reassembly';
    validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ iconLoading: true, disabledFlag: true });
      this.props.setCommonConfig(type, ipRConfigInfo);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { handleIpRSubmit, setCommonConfig, disabledFlag, iconLoading } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 5 },
      className: 'ant-col-12 ',
    };

    return (
      <Form>
        <FormItem label={formatMessage({id:'app.ip-slice.max_pkt_num'})} {...formItemLayout}>
          {getFieldDecorator('max_pkt_num', {
            initialValue: this.props.returnIpReassemblyData.max_pkt_num,
            rules: [
              {
                required: true,
                message: formatMessage({id:'app.msg.empty'}),
              },
            ],
          })(<InputNumber  min={0} max={10000000} disabled={disabledFlag} />)}
        </FormItem>
        <FormItem label={formatMessage({id:'app.ip-slice.time_out'})} {...formItemLayout}>
          {getFieldDecorator('time_out', {
            initialValue: this.props.returnIpReassemblyData.time_out,
            rules: [
              {
                required: true,
                message: formatMessage({id:'app.msg.empty'}),
              },
            ],
          })(<InputNumber  min={0} max={1000} disabled={disabledFlag} />)}
        </FormItem>
        <FormItem label={formatMessage({id:'app.ip-slice.inner_switch'})} {...formItemLayout}>
          {getFieldDecorator('ip_reassembly_inner_switch', {
            valuePropName: 'checked',
            initialValue: this.props.returnIpReassemblyData.ip_reassembly_inner_switch
              ? true
              : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem label={formatMessage({id:'app.ip-slice.outer_switch'})} {...formItemLayout}>
          {getFieldDecorator('ip_reassembly_outer_switch', {
            valuePropName: 'checked',
            initialValue: this.props.returnIpReassemblyData.ip_reassembly_outer_switch
              ? true
              : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem className="ant-col-24">
          <Button
            disabled={!this.props.canWrite}
            style={{ float: 'right' }}
            type="primary"
            loading={iconLoading}
            onClick={() => this.handleIpRSubmit()}
          >
             {formatMessage({id:'app.msg.setting'})}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const IpRForm = Form.create()(IpReassemblyForm);

//TCP表单组件
class TcpReassemblyForm extends React.Component {
  constructor(props) {
    super(props);
  }
  //表单验证，并提交数据
  handleTcPSubmit = () => {
    const dupInfo = this.props.form.getFieldsValue();
    const type = 'tcp_reassembly';
    const { form } = this.props;
    const { values, validateFields } = form;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.setCommonConfig(type, dupInfo);
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { setCommonConfig, disabledFlag, iconLoading } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 5 },
      className: 'ant-col-12 ',
    };

    return (
      <Form>
        <FormItem label={formatMessage({id:'app.tcp-disorder.inner_switch'})} {...formItemLayout}>
          {getFieldDecorator('tcp_reassembly_inner_switch', {
            valuePropName: 'checked',
            initialValue: this.props.returnTcpReassemblyData.tcp_reassembly_inner_switch
              ? true
              : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem label={formatMessage({id:'app.tcp-disorder.outer_switch'})} {...formItemLayout}>
          {getFieldDecorator('tcp_reassembly_outer_switch', {
            valuePropName: 'checked',
            initialValue: this.props.returnTcpReassemblyData.tcp_reassembly_outer_switch
              ? true
              : false,
          })(
            <Switch checkedChildren={formatMessage({id:'app.msg.open'})} unCheckedChildren={formatMessage({id:'app.msg.close'})} disabled={disabledFlag}></Switch>,
          )}
        </FormItem>
        <FormItem label={formatMessage({id:'app.tcp-disorder.packet_number'})} {...formItemLayout}>
          {getFieldDecorator('packet_number', {
            initialValue: this.props.returnTcpReassemblyData.packet_number,
            rules: [
              {
                required: true,
                message: formatMessage({id:'app.msg.empty'}),
              },
            ],
          })(<InputNumber  min={0} max={10000000} disabled={disabledFlag} />)}
        </FormItem>
        <FormItem label={formatMessage({id:'app.tcp-disorder.time_out'})} {...formItemLayout}>
          {getFieldDecorator('tcp_reassembly_timeout', {
            initialValue: this.props.returnTcpReassemblyData.tcp_reassembly_timeout,
            rules: [
              {
                required: true,
                message: formatMessage({id:'app.msg.empty'}),
              },
            ],
          })(<InputNumber  min={0} max={1000} disabled={disabledFlag} />)}
        </FormItem>
        <FormItem label={formatMessage({id:'app.tcp-disorder.stream_timeout'})} {...formItemLayout}>
          {getFieldDecorator('tcp_stream_timeout', {
            initialValue: this.props.returnTcpReassemblyData.tcp_stream_timeout,
            rules: [
              {
                required: true,
                message: formatMessage({id:'app.msg.empty'}),
              },
            ],
          })(<InputNumber  min={0} max={1000} disabled={disabledFlag} />)}
        </FormItem>

        <FormItem className="ant-col-24">
          <Button
            style={{ float: 'right' }}
            type="primary"
            loading={iconLoading}
            onClick={this.handleTcPSubmit}
            disabled={!this.props.canWrite}
          >
            {formatMessage({id:'app.msg.setting'})}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const TcpRForm = Form.create()(TcpReassemblyForm);

@connect(({ sf3000_common_config,sf3000_user, loading }) => {
  return {
    returnIpReassemblyData: sf3000_common_config.returnIpReassemblyData,
    returnDeduplicationData: sf3000_common_config.returnDeduplicationData,
    returnKeyWordData: sf3000_common_config.returnKeyWordData,
    returnTcpReassemblyData: sf3000_common_config.returnTcpReassemblyData,
    currentPerm: sf3000_user.currentPerm,
  };
})
export default class BusinessCommonConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledFlag: false,
      iconLoading: false,
      disabledKwFlag: false,
      iconLoadingKw: false,
      disabledIpFlag: false,
      iconLoadingIp: false,
      disabledTcpFlag: false,
      iconLoadingTcp: false,
      loading: false,
    };
  }
  componentDidMount() {
    this.getCommonConfig();
  }
  //获取Common参数配置
  getCommonConfig = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sf3000_common_config/getCommonConfig',
      payload: 'deduplication',
    });
    dispatch({
      type: 'sf3000_common_config/getCommonConfig',
      payload: 'keyword',
    });
    dispatch({
      type: 'sf3000_common_config/getCommonConfig',
      payload: 'ip_reassembly',
    });
    dispatch({
      type: 'sf3000_common_config/getCommonConfig',
      payload: 'tcp_reassembly',
    });
  };

  //设置tup乱序参数
  setCommonConfig = (commonType, data) => {
    const { dispatch } = this.props;
    const dup = { name: commonType, config: data };
    this.setState({loading:true})
    dispatch({
      type: 'sf3000_common_config/setCommonConfig',
      payload: dup,
    })
      .then(res => {
        message.destroy();
        if (res.status_code == '200')
          message.success(formatMessage({ id: 'app.msg.operate.success' }));
          this.setState({loading:false})
      })
      .catch(err => {
        message.error(formatMessage({ id: 'app.msg.operate.fail' }));
        this.setState({loading:false})
      });
  };

  setSubmitStatus(type, status) {
    switch (type) {
      case 'deduplication':
        this.setState({ iconLoading: status, disabledFlag: status });
        break;
      case 'keyword':
        this.setState({ iconLoadingKw: status, disabledKwFlag: status });
        break;
      case 'ip_reassembly':
        this.setState({ iconLoadingIp: status, disabledIpFlag: status });
        break;
      case 'tcp_reassembly':
        this.setState({ iconLoadingTcp: status, disabledTcpFlag: status });
        break;
    }
  }
  render() {
    const {
      disabledFlag,
      iconLoading,
      disabledKwFlag,
      iconLoadingKw,
      disabledIpFlag,
      iconLoadingIp,
      disabledTcpFlag,
      iconLoadingTcp,
    } = this.state;
    const {
      returnDeduplicationData,
      returnKeyWordData,
      returnIpReassemblyData,
      returnTcpReassemblyData,
      currentPerm
    } = this.props;
    const canWrite = currentPerm["setting_write"]
    console.log('212121',currentPerm);
    const returnDuplicationProps = {
      returnDeduplicationData: returnDeduplicationData,
      setCommonConfig: this.setCommonConfig,
      disabledFlag: disabledFlag,
      iconLoading: iconLoading,
      canWrite:canWrite,
    };
    const returnKeyWordDataProps = {
      returnKeyWordData: returnKeyWordData,
      setCommonConfig: this.setCommonConfig,
      disabledFlag: disabledKwFlag,
      iconLoading: iconLoadingKw,
      canWrite:canWrite
    };
    const returnIpReassemblyDataProps = {
      returnIpReassemblyData: returnIpReassemblyData,
      setCommonConfig: this.setCommonConfig,
      disabledFlag: disabledIpFlag,
      iconLoading: iconLoadingIp,
      canWrite:canWrite
    };
    const returnTcpReassemblyDataProps = {
      returnTcpReassemblyData: returnTcpReassemblyData,
      setCommonConfig: this.setCommonConfig,
      disabledFlag: disabledTcpFlag,
      iconLoading: iconLoadingTcp,
      canWrite:canWrite
    };
    const routes = [
      {
        path: '/',
        breadcrumbName: formatMessage({id:"menu.home"}),
      },
      {
        path: 'business',
        breadcrumbName: formatMessage({id:"app.bussiness.breadcrumb"}),
      },
      {
        path: '/setting',
        breadcrumbName: formatMessage({id:"app.bussiness.setting.breadcrumb"}),
      }
    ];
    return (
      <PageHeaderWrapper
        breadcrumb = {{routes}}
      >
         <Spin spinning={this.state.loading} style={{
          position: 'fixed',
          top: '0px',
          left: '10%',
          right: '0px',
          bottom: '0px',
          margin: 'auto',
        }}>
        <Card title={formatMessage({ id: 'app.duplicate' })}>
          <DupSForm {...returnDuplicationProps}></DupSForm>
        </Card>
        <Card title={formatMessage({ id: 'app.keyword' })} style={{ marginTop: 10 }}>
          <KWForm {...returnKeyWordDataProps}></KWForm>
        </Card>
        <Card title={formatMessage({ id: 'app.ip-slice' })} style={{ marginTop: 10 }}>
          <IpRForm {...returnIpReassemblyDataProps}></IpRForm>
        </Card>
        <Card title={formatMessage({ id: 'app.tcp-disorder' })} style={{ marginTop: 10 }}>
          <TcpRForm {...returnTcpReassemblyDataProps}></TcpRForm>
        </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}
