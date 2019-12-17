import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage} from 'umi/locale';
import { Card, Modal, Form, Select, Button,message } from 'antd';
import styles from './nf5000_time.less';
import { connect } from 'dva';

const CreateForm = Form.create()(props => {
  return <Systemform {...props}></Systemform>;
});

class Systemform extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isCreateForm,
      handleOk,
      handleCancel,
      form,
      handleShow,
      currentDistrict,
      select_optionarr,
      currentSystime
    } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const Okhandle = () => {
      validateFields((err, fieldsvalue) => {
        if (err) {
          return;
        }
        handleOk(fieldsvalue);
      });

    
    };

    return (
      <Modal
        title={formatMessage({ id: 'app.change.systime.district' })}
        visible={isCreateForm}
        onOk={Okhandle}
        onCancel={handleCancel}
      >
        <Form labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
          <Form.Item
            label={formatMessage({ id: 'app.systime.district' })}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator('id', {
              initialValue: currentSystime,
              rules: [{ required: true, message: 'Please select the district' }],
            })(
              <Select
                size={'small'}
                placeholder={formatMessage({ id: 'app.sys.selectinfo' })}
              >
                {select_optionarr.map((item, index) => {
                  return (
                    <Select.Option key={index} value={index + 1}>
                      {formatMessage({ id: select_optionarr[index] })}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

@connect(({ nf5000_home, nf5000_user }) => {
  return {
    currentSystime: nf5000_home.currentSystime,
    currentPerm: nf5000_user.currentPerm,
  };
})
export default class Systime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateForm: false,
    };
  }

  handleOk = timeinfo => {
    const { dispatch } = this.props;
    dispatch({
      type: `nf5000_home/configureTime`,
      payload: timeinfo,
    }) .then(res => {
        if (res.status_code == '200')
          message.success(formatMessage({ id: 'app.system.timesuccessful' }),2);
          this.handleShow();
      })
      .catch(err => {
        message.error(formatMessage({ id: 'app.system.timefail' }));
      })
    ;

    this.setState({
      isCreateForm: false,
    });
  };

  handleCancel = () => {
    this.setState({
      isCreateForm: false,
    });
  };

  buttonClick = () => {
    this.setState({
      isCreateForm: true,
    });
  };

  handleShow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `nf5000_home/fetchTime`,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `nf5000_user/queryPermiss`,
    });
    this.handleShow()
  }

  render() {
    const { currentSystime, currentPerm } = this.props;
    const { ModalVisible, isCreateForm } = this.state;

    let currentDistrict = formatMessage({ id: 'app.systime101' });

    let button_status = currentPerm.time_write === true ? false : true;

    const select_optionarr = [
      'app.systime1',
      'app.systime2',
      'app.systime3',
      'app.systime4',
      'app.systime5',
      'app.systime6',
      'app.systime7',
      'app.systime8',
      'app.systime9',
      'app.systime10',
      'app.systime11',
      'app.systime12',
      'app.systime13',
      'app.systime14',
      'app.systime15',
      'app.systime16',
      'app.systime17',
      'app.systime18',
      'app.systime19',
      'app.systime20',
      'app.systime21',
      'app.systime22',
      'app.systime23',
      'app.systime24',
      'app.systime25',
      'app.systime26',
      'app.systime27',
      'app.systime28',
      'app.systime29',
      'app.systime30',
      'app.systime31',
      'app.systime32',
      'app.systime33',
      'app.systime34',
      'app.systime35',
      'app.systime36',
      'app.systime37',
      'app.systime38',
      'app.systime39',
      'app.systime40',
      'app.systime41',
      'app.systime42',
      'app.systime43',
      'app.systime44',
      'app.systime45',
      'app.systime46',
      'app.systime47',
      'app.systime48',
      'app.systime49',
      'app.systime50',
      'app.systime51',
      'app.systime52',
      'app.systime53',
      'app.systime54',
      'app.systime55',
      'app.systime56',
      'app.systime57',
      'app.systime58',
      'app.systime59',
      'app.systime60',
      'app.systime61',
      'app.systime62',
      'app.systime63',
      'app.systime64',
      'app.systime65',
      'app.systime66',
      'app.systime67',
      'app.systime68',
      'app.systime69',
      'app.systime70',
      'app.systime71',
      'app.systime72',
      'app.systime73',
      'app.systime74',
      'app.systime75',
      'app.systime76',
      'app.systime77',
      'app.systime78',
      'app.systime79',
      'app.systime80',
      'app.systime81',
      'app.systime82',
      'app.systime83',
      'app.systime84',
      'app.systime85',
      'app.systime86',
      'app.systime87',
      'app.systime88',
      'app.systime89',
      'app.systime90',
      'app.systime91',
      'app.systime92',
      'app.systime93',
      'app.systime94',
      'app.systime95',
      'app.systime96',
      'app.systime97',
      'app.systime98',
      'app.systime99',
      'app.systime100',
      'app.systime101',
      'app.systime102',
      'app.systime103',
      'app.systime104',
      'app.systime105',
      'app.systime106',
      'app.systime107',
      'app.systime108',
      'app.systime109',
      'app.systime110',
      'app.systime111',
      'app.systime112',
      'app.systime113',
      'app.systime114',
      'app.systime115',
      'app.systime116',
      'app.systime117',
      'app.systime118',
      'app.systime119',
      'app.systime120',
      'app.systime121',
      'app.systime122',
      'app.systime123',
      'app.systime124',
      'app.systime125',
      'app.systime126',
      'app.systime127',
      'app.systime128',
      'app.systime129',
      'app.systime130',
      'app.systime131',
      'app.systime132',
      'app.systime133',
      'app.systime134',
      'app.systime135',
    ];

    //对传过来的数据进行处理
    if (currentSystime) {
      currentDistrict = formatMessage({ id: select_optionarr[currentSystime - 1] });
    }

    const CreateProps = {
      handleCancel: this.handleCancel,
      handleOk: this.handleOk,
      isCreateForm: isCreateForm,
      handleShow: this.handleShow,
      currentDistrict: currentDistrict,
      select_optionarr: select_optionarr,
      currentSystime:currentSystime
    };
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
        path: '/time',
        breadcrumbName: formatMessage({ id: 'app.system.time.breadcrumb' }),
      },
    ];
    return (
      <PageHeaderWrapper breadcrumb={{ routes }}>
        <Card>
          <div>
            <div style={{ display: 'inline', fontWeight: 'bold' }}>
              {formatMessage({ id: 'app.current.district' })}
            </div>
            <div style={{ display: 'inline', marginLeft: 20, fontWeight: 'bold' }}>
              {currentDistrict}
            </div>
            <Button
              type="primary"
              disabled={button_status}
              className={styles.div_line2_button}
              onClick={this.buttonClick}
            >
              {formatMessage({ id: 'app.systime.button' })}
            </Button>
            {isCreateForm ? <CreateForm {...CreateProps}> </CreateForm> : null}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
