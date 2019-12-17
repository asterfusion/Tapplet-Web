import { Alert } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
//import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import { CurrentStatus } from '@/models/sf3000_login';
import LoginComponents from './components/Login';
import styles from './style.less';
import { LoginParamsType } from '@/models/sf3000_login';
import { ConnectState } from '@/models/connect';
import md5 from 'js-md5';
const { UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: CurrentStatus;
  submitting: boolean;
}

@connect(({ sf3000_login, loading }: ConnectState) => ({
  userLogin: sf3000_login.status,
  submitting: loading.effects['sf3000_login/login'],
}))
class Login extends Component<LoginProps> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  handleSubmit = (err: unknown, values: LoginParamsType) => {
    if (!err) {
      const { dispatch } = this.props;
      console.log(values)
      dispatch({
        type: 'sf3000_login/login',
        payload: {...values}//{username: values["username"], password: md5(values["password"])},
      });
    }
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting, userLogin } = this.props;
    const { status_code } = userLogin;
    return (
      <div className={styles.main}>
        <LoginComponents
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
            <>
            {status_code == 401 &&//提示信息
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
              )}
            </>
            <UserName
              name="username"
              placeholder={`${formatMessage({ id: 'user-login.login.userName' })}:`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'user-login.login.password' })}:`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                if (this.loginForm) {
                  this.loginForm.validateFields(this.handleSubmit);
                }
              }}
            />
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
