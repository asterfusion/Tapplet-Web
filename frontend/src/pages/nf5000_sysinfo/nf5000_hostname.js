import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { Card, Button, message, Spin, Input, Form } from 'antd';
import { connect } from 'dva';
import nf5000_system from '@/models/nf5000_system';
import { validate } from '@babel/types';

class Hostform extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { hostnameChange, loading, form, currentInformation } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const button_status = this.props.currentPerm.hostname_write === true ? false : true;
    const handleSubmit = () => {
      validateFields((err, fieldsvalue) => {
        if (err) {
          return;
        }
        hostnameChange(fieldsvalue);
      });
    };
    const exPattern = /^[a-zA-Z0-9][a-zA-Z0-9.-]+[a-zA-Z0-9]$/

    return (
      <Form>
        <Form.Item
          style={{ display: 'inline-block', marginBottom: '0px' }}
          label={formatMessage({ id: 'app.system.changehostname' })}
          labelCol={localStorage.getItem("umi_locale") == "en-US" ? { span: 12 } : { span: 8 }}
          wrapperCol={localStorage.getItem("umi_locale") == "en-US" ? { span: 12 } : { span: 14 }}
        >
          {getFieldDecorator('hostname', {
            initialValue: currentInformation.hostname,
            rules: [
              {
                validator: (rule, value, callback) => {
                  try {
                    if (value.length == 0) {
                      throw new Error(formatMessage({ id: 'app.system.msg.hostname.notempty' }))
                    }
                    if (value != undefined && value != "") {

                      if (value.length > 15) {
                        throw new Error(formatMessage({ id: 'app.system.msg.format.length' }))
                      }
                      if (!exPattern.test(value)) {
                        throw new Error(formatMessage({ id: "app.system.msg.hostname.format" }))
                      }
                    }
                  } catch (err) {
                    callback(err)
                  } finally {
                    callback()
                  }
                }
              }]
          })(<Input disabled={button_status} />)}
        </Form.Item>
        <span style={{ display: 'inline-block' }}> </span>
        <Form.Item style={{ display: 'inline-block', marginBottom: '0px', marginLeft: '10px' }}>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={button_status}
          >
            {formatMessage({ id: 'app.hostname.config' })}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const CreateForm = Form.create()(props => {
  return <Hostform {...props}></Hostform>;
});

@connect(({ nf5000_user, nf5000_home }) => {
  return {
    currentInformation: nf5000_home.currentInformation,
    currentPerm: nf5000_user.currentPerm
  };
})
export default class HostName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'nf5000_home/fetchSysteminformation',
    });
  }

  hostnameChange = data => {
    const { dispatch } = this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type: `nf5000_system/hostnameChange`,
      payload: data,
    })
      .then(res => {
        message.destroy();
        if (res.status_code == '200')
          message.success(formatMessage({ id: 'app.system.hostnamesuccessful' }));
      })
      .catch(err => {
        message.error(formatMessage({ id: 'app.system.hostnamefail' }));
      })
      .finally(() => {
        dispatch({
          type: 'nf5000_home/fetchSysteminformation',
        });
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const { loading } = this.state;
    const { currentInformation, currentPerm } = this.props;
    const routes = [
      {
        path: '/',
        breadcrumbName: formatMessage({ id: 'menu.home' }),
      },
      {
        path: 'system',
        breadcrumbName: formatMessage({ id: 'app.system.breadcrumb' }),
      },
      {
        path: '/hostname',
        breadcrumbName: formatMessage({ id: 'app.system.hostname.breadcrumb' }),
      },
    ];
    const props = {
      hostnameChange: this.hostnameChange,
      loading: loading,
      currentInformation: currentInformation,
      currentPerm: currentPerm
    };

    return (
      <PageHeaderWrapper breadcrumb={{ routes }}>
        <Card>
          <CreateForm {...props}></CreateForm>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
