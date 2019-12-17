import { Alert } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import { CurrentStatus } from '@/models/nf5000_login';
import LoginComponents from './components/Login';
import styles from './style.less';
import { LoginParamsType } from '@/models/nf5000_login';
import { ConnectState } from '@/models/connect';

const { UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: CurrentStatus;
  submitting: boolean;
}
interface LoginState {
  autoLogin: boolean;
}

@connect(({ nf5000_login, loading }: ConnectState) => ({
  userLogin: nf5000_login.status,
  submitting: loading.effects['nf5000_login/login'],
}))
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    autoLogin: true,
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err: unknown, values: LoginParamsType) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'nf5000_login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 15 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting, userLogin } = this.props;
    const { status_code } = userLogin;
    const { autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          // onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
            <>
            {status_code == 4012 &&/////////提示信息
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
              )}
            </>
            <UserName 
              name="username"
              placeholder={`${formatMessage({ id: 'user-login.login.userName' })}:`}
              maxLength={255}
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
