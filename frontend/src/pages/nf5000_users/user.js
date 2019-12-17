import React, { Component } from 'react';
import {Card, Table, Button, Modal, Form, Input, Select, message, Spin} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import { formatMessage } from 'umi/locale';
import { RegexPattern } from './validatePattern';
import md5 from 'js-md5';
import { async } from 'q';
import isEqual from 'lodash/isEqual';
const { pat_username, pat_password, pat_fullname, pat_department, pat_phonenum, pat_email } = RegexPattern

class UserForm extends Component {
    constructor(props){
        super(props);
        
    }

    render() {
        const { modalVisible, okHandle, cancelHandle, Mode, form, editUser, roleOptions, users, loading } = this.props;
        const { getFieldDecorator, validateFields, getFieldValue } = form;
        const handleOk = () => {
          validateFields((err, fieldsValue) => {
            if(err) {
              return;
            }
            okHandle(fieldsValue);
          });
        };
        let modalValues = Mode == "Add" ? {} : editUser;
        let passwordReq = Mode == "Add" ? true : false;
        let newOptions = roleOptions.map((perItem)=>{
          return perItem["rolename"]
        })
        return (
            <Modal
                maskClosable={false}
                destroyOnClose
                width={700}
                title={Mode == "Add" ? formatMessage({id:'app.users.user.add'}) : formatMessage({id:'app.users.user.edit'})}
                visible={modalVisible}
                onOk={handleOk}
                onCancel={cancelHandle}
            >
              <Spin spinning={loading}>
                <Form 
                  labelCol={{span:5}} 
                  wrapperCol={{span:15}}  
                  >
                  <Form.Item 
                    label={formatMessage({id:'app.users.user.username'})}
                    wrapperCol={{span:5}}
                    >
                    {getFieldDecorator("username",{
                      initialValue: modalValues.username,
                      rules: [{
                          required: true, 
                          validator: (rule, value, callback) => {
                            try{
                                if(( value != undefined && value != "" )){
                                  let user = []
                                  if(Mode == "Add"){
                                      users.map((i)=>{
                                        user.push(i["username"])
                                    })
                                    if(user.indexOf(value) !== -1) {
                                      throw new Error(formatMessage({id:"app.users.user.msg.username.format.duplication"}))
                                    }
                                  }
                                  if(value.length > 100){
                                      throw new Error(formatMessage({id:"app.users.user.msg.format.length"}))
                                  }
                                  if(!pat_username.test(value)){
                                    throw new Error(formatMessage({id:"app.users.user.msg.username.format"}))
                                  }
                              }else{
                                throw new Error(formatMessage({id:"app.users.user.msg.username"}))
                              }
                            }catch(err){
                              callback(err)
                            }finally{
                              callback()
                            }  
                          },
                      }],
                    })(<Input disabled={Mode == 'Edit'} />)}
                  </Form.Item>
                  <Form.Item 
                    label={formatMessage({id:'app.users.user.password'})}
                    wrapperCol={{span:5}}
                    >
                    {getFieldDecorator("password",{
                      initialValue: modalValues.password,
                      rules:[{
                        required: passwordReq,
                        validator: (rule, value, callback) => {
                          try{
                            if(value != undefined && value != ""){
                              if(!pat_password.test(value)){
                                throw new Error(formatMessage({id:"app.users.user.msg.password.format"}))
                              }
                              if(value.length > 20){
                                throw new Error(formatMessage({id:"app.users.user.msg.password.format.length"}))
                              }
                              if(value.length < 6){
                                throw new Error(formatMessage({id:"app.users.user.msg.password.format.minlength"}))
                              }
                            }else{
                              if(Mode == "Add"){
                                 throw new Error(formatMessage({id:"app.users.user.msg.password"}))
                              }
                            }
                          }catch(err){
                            callback(err)
                          }finally{
                            callback()
                          }
                        }
                      }
                    ],
                    })(<Input.Password />)} 
                  </Form.Item>
                  <Form.Item 
                    label={formatMessage({id:'app.users.user.name'})}
                    wrapperCol={{span:5}}
                    >
                    {getFieldDecorator("name",{
                      initialValue: modalValues.name,
                      rules:[{
                        required:true,
                        validator: (rule, value, callback) => {
                          try{
                            if(value != undefined && value != ""){
                              if(!pat_fullname.test(value)){
                                throw new Error(formatMessage({id:"app.users.user.msg.fullname.format"}))
                              }
                              if(value.length > 100){
                                throw new Error(formatMessage({id:"app.users.user.msg.format.length"}))
                              }
                            }else{
                              throw new Error(formatMessage({id:"app.users.user.msg.fullname"}))
                            }
                          }catch(err){
                            callback(err)
                          }finally{
                            callback()
                          }
                        }
                      }
                    ],
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item 
                    label={formatMessage({id:'app.users.user.email'})}
                    wrapperCol={{span:8}}
                    >
                    {getFieldDecorator("email",{
                      initialValue: modalValues.email,
                      rules:[{
                        required:true,
                        validator: (rule, value, callback) => {
                          try{
                            if(value != undefined && value != ""){
                              if(!pat_email.test(value) || value.length > 255){
                                throw new Error(formatMessage({id:"app.users.user.msg.email.format"}))
                              }
                            }else{
                              throw new Error(formatMessage({id:"app.users.user.msg.email"}))
                            }
                          }catch(err){
                            callback(err)
                          }finally{
                            callback()
                          }
                        }
                      }
                    ],//pattern
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item 
                    label={formatMessage({id:'app.users.user.department'})}
                    wrapperCol={{span:8}}
                    >
                    {getFieldDecorator("department",{
                      initialValue: modalValues.department,
                      rules:[{
                        required:true,
                        validator: (rule, value, callback) => {
                          try{
                            if(value != undefined && value != ""){
                              if(!pat_department.test(value)){
                                throw new Error(formatMessage({id:"app.users.user.msg.department.format"}))
                              }
                              if(value.length > 100){
                                throw new Error(formatMessage({id:"app.users.user.msg.format.length"}))
                              }
                            }else{
                              throw new Error(formatMessage({id:"app.users.user.msg.department"}))
                            }
                          }catch(err){
                            callback(err)
                          }finally{
                            callback()
                          }
                        }
                      }
                    ],//pattern字母或数字或汉字
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item 
                    label={formatMessage({id:'app.users.user.rolename'})}
                    wrapperCol={{span:8}}
                    >
                    {getFieldDecorator("rolename",{
                      initialValue: modalValues.rolename,
                      rules:[{required:true, message: formatMessage({id:"app.users.user.msg.rolename"})}],
                    })(<Select
                          showSearch
                        >
                          {
                            newOptions.map((item) => {
                              return <Select.Option key={item} value={item}>{item}</Select.Option>
                            })
                          }
                        </Select>
                    )}
                  </Form.Item>
                  <Form.Item 
                    label={formatMessage({id:'app.users.user.telephone'})}
                    wrapperCol={{span:8}}
                    >
                    {getFieldDecorator("phone_num",{
                      initialValue: modalValues.phone_num,
                      rules:[{required:true,
                        validator: (rule, value, callback) => {
                          try{
                            if(value != undefined && value != ""){
                              if(!pat_phonenum.test(value) || value.length > 20){
                                throw new Error(formatMessage({id:"app.users.user.msg.telephone.format"}))
                              }
                            }else{
                              throw new Error(formatMessage({id:"app.users.user.msg.telephone"}))
                            }
                          }catch(err){
                            callback(err)
                          }finally{
                            callback()
                          }
                        }
                      }
                    ],//数字
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item 
                    label={formatMessage({id:'app.users.user.description'})}
                    >
                    {getFieldDecorator("description",{
                      initialValue: modalValues.description,
                      rules:[{max: 100, message: formatMessage({id:"app.users.user.msg.description.format.length"})},]
                    })(<TextArea maxLength={100} autosize={{minRows: 3, maxRows: 6 }} placeholder={formatMessage({id:"app.users.user.description.tip"})}/>)}
                  </Form.Item>
                </Form>
              </Spin>
            </Modal>
        )
    }
}

const CreateForm = Form.create()(
    props => {
    return (
      <UserForm {...props} Mode={"Add"}></UserForm>
    )
})
const EditForm = Form.create()(
   props => {
   return (
      <UserForm {...props} Mode={"Edit"}></UserForm>
   )
})

@connect(({nf5000_user,nf5000_login,loading})=>{
  return {
    users: nf5000_user.users,
    roles: nf5000_user.roles,
    userPerm: nf5000_user.currentPerm,
    userCount: nf5000_user.userCount
  }
})
export default class UserPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
          editUser: [],
          isCreateUser:false,
          isEditUser:false,
          loading: false,
          refreshKey: 0
      }
    }
    componentDidMount(){
      this.refreshUser()
      this.queryCurrentPermiss()
    }
    componentDidUpdate(prevProps) {
      const { userPerm } = this.props;
      if(this.state.refreshKey == 0 || !isEqual(userPerm, prevProps.userPerm)) {
        if(userPerm["user_write"]) this.queryRoleOptions()
        this.setState({
          refreshKey: this.state.refreshKey+1
        })
      }
    }
    //获取用户信息
    refreshUser = () => {
      const { dispatch } = this.props;
      dispatch({
        type: "nf5000_user/queryUsers"
      })
    }
    //获取角色信息
    queryRoleOptions = () => {
      const { dispatch } = this.props;
      dispatch({
        type: "nf5000_user/queryRoles"
      })
    }
    //获取当前用户权限
    queryCurrentPermiss = () => {
      const { dispatch } = this.props;
      dispatch({
        type: "nf5000_user/queryPermiss"
      })
    }
    //创建用户
    handleIsCreateUser = () => {
      this.setState({
        isCreateUser: true,
      })
    }
    handleFinCreateUser = () => {
      this.setState({
        isCreateUser: false
      })
    }
    handleCreateUser = (user) => {
      const {dispatch} = this.props;
      this.setState({
        isCreateUser: false,
        loading: true
      })
      dispatch({
        type: "nf5000_user/createUser",
        payload: user
      }).then((res)=>{
        if(res.status_code == 200) message.success(formatMessage({id:"app.users.msg.create.success"}))
        this.handleFinCreateUser()
        this.setState({
          loading: false
        })
      }).catch((err)=>{
        message.error(formatMessage({id:"app.users.msg.create.fail"}))
        this.handleFinCreateUser()
        this.setState({
          loading: false
        })
      }).finally(()=>{
        this.refreshUser()
      })
    }
    //修改用户
    handleIsEditUser = (user) => {
      this.setState({
        editUser: user,
        isEditUser: true
      })
    }
    handleFinEditUser = () => {
      this.setState({
        isEditUser: false
      })
    }
    handleEditUser = (user) => {
      const {dispatch} = this.props;
      this.setState({
        isEditUser: false,
        loading: true
      })
     dispatch({
        type: "nf5000_user/editUser",
        payload: user
      }).then((res)=>{
        if(typeof res.status_code == "undefined") message.success(formatMessage({id:"app.users.msg.edit.success"}))
        this.handleFinEditUser()
        this.setState({
          loading: false
        })
        if(localStorage.getItem("currentUsername") == user["username"] && localStorage.getItem("antd-pro-authority") !== user["rolename"]){
          localStorage.setItem("antd-pro-authority", user["rolename"])
          location.reload(true)
        }
      }).catch((err)=>{
        message.error(formatMessage({id:"app.users.msg.edit.fail"}))
        this.handleFinEditUser()
        this.setState({
          loading: false
        })
      }).finally(()=>{
        this.refreshUser()
      })
    }
    //删除用户
    handleDeleteUser = (user) => {
      const {dispatch} = this.props;
      this.setState({
        loading: true
      })
      dispatch({
        type: "nf5000_user/deleteUser",
        payload: {username: user.username}
      }).then((res)=>{
        if(typeof res.status_code == "undefined") message.success(formatMessage({id:"app.users.msg.delete.success"}))
        this.setState({
          loading: false
        })
      }).catch((err)=>{
        message.error(formatMessage({id:"app.users.msg.delete.fail"}))
        this.setState({
          loading: false
        })
      }).finally(()=>{
        this.refreshUser()
      })
    }

   render() {
    const columns = [
        {
          title: formatMessage({id:'app.users.user.username'}),
          dataIndex: 'username',
          key: 'username',
          sortDirections: ['descend'],
          width: '15%',
          ellipsis: true,
        },
        {
          title: formatMessage({id:'app.users.user.name'}),
          dataIndex: 'name',
          key: 'name',
          sortDirections: ['descend'],
          width: '15%',
          ellipsis: true,
        },
        {
          title: formatMessage({id:'app.users.user.email'}),
          dataIndex: 'email',
          key: 'email',
          sortDirections: ['descend'],
          width: '25%',
        },
        {
          title: formatMessage({id:'app.users.user.department'}),
          dataIndex: 'department',
          key: 'department',
          sortDirections: ['descend'],
          width: '15%',
          ellipsis: true,
        },
        {
          title: formatMessage({id:'app.users.user.rolename'}),
          dataIndex: 'rolename',
          key: 'role',
          sortDirections: ['descend'],
          width: '15%',
        },
        {
          title: formatMessage({id:'app.users.user.telephone'}),
          dataIndex: 'phone_num',
          key: 'phone_num',
          sortDirections: ['descend'],
          width: '20%',
        },
        {
          title: formatMessage({id:'app.users.user.description'}),
          dataIndex: 'description',
          key: 'description',
          sortDirections: ['descend'],
          width: '15%',
        },
      ]

    const { isCreateUser, isEditUser, editUser, loading } = this.state;
    const { users, userPerm, userCount } = this.props;
    const createProps = {
      modalVisible: isCreateUser, okHandle: this.handleCreateUser, cancelHandle: this.handleFinCreateUser, 
      roleOptions: this.props.roles, users: users, loading: loading
    }  
    const editProps = {
      modalVisible: isEditUser, okHandle: this.handleEditUser, cancelHandle: this.handleFinEditUser,
      editUser: editUser, roleOptions: this.props.roles, users: users, loading: loading
    }
    //为Table每行数据增加key值
    users.map((i,index) => {
      i.key = index.toString() 
    })

    if(userPerm["user_write"]) {
        columns.push({
            title: formatMessage({id:'app.users.user.action'}),
            key: 'action',
            width: 180,
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={this.handleIsEditUser.bind(this,record)}>{formatMessage({id:'app.users.user.action.edit'})}</a>   &nbsp;
                    {record.username == "admin" || record.username == localStorage.getItem("currentUsername") ? null : <a href="javascript:;" onClick={this.handleDeleteUser.bind(this,record)}>{formatMessage({id:'app.users.user.action.delete'})}</a> }
                </span>     
            )
        })
   }
   const routes = [
        {
          path: '/',
          breadcrumbName: formatMessage({id:"menu.home"}),
        },
        {
          path: 'usermanage',
          breadcrumbName: formatMessage({id:"app.users.usermanage.breafcrumb"}),
        },
        {
          path: '/user',
          breadcrumbName: formatMessage({id:"app.users.user.breafcrumb"}),
        }
    ];

    return (
         <PageHeaderWrapper
            breadcrumb = {{routes}}
         >
            <Spin spinning={loading}>
              <Card>
                  {
                    userPerm["user_write"] ? <Button icon="plus" type="primary" onClick={userCount >= 50 ? () => message.warning(formatMessage({id:"app.users.user.msg.create.limit"})) : this.handleIsCreateUser.bind(this)}>{formatMessage({id:'app.users.user.create'})}</Button> : null
                  }
                  {
                    isCreateUser ? <CreateForm {...createProps}></CreateForm> : null
                  }
                  {
                    isEditUser ? <EditForm {...editProps}></EditForm> : null
                  }
                  <Table 
                      size="middle"
                      columns={columns}
                      dataSource={users}
                      bordered={false}
                      pagination={{
                        pageSize: 12,
                      }}
                  />
              </Card>
            </Spin>
        </PageHeaderWrapper>
     )

   }
};



