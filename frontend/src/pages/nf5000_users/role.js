import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Modal, Form, Input, Button, Checkbox, message, Spin} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import { newExpression } from '@babel/types';
import { formatMessage } from 'umi/locale';
import styles from './role.less';
import { RegexPattern } from './validatePattern';
import isEqual from 'lodash/isEqual';
//import { updateRoute } from '@/layouts/nf5000_updateRoute';

const { pat_rolename,pat_rolename_number } = RegexPattern

class RoleForm extends Component {
    constructor(props) {
        super(props);
        this.newpermissions = [{
            name:"usermanage",
            items:{
                user:{
                    is_read: "0",
                    is_write: "0"
                },
                role:{
                    is_read:"0",
                    is_write:"0"
                }
            }
        },{
            name:"policy",
            items:{
                policy:{
                    is_read:"0",
                    is_write:"0"
                }
            }
        },{
            name:"system",
            items:{
                time:{
                    is_read:"0",
                    is_write:"0"
                },
                configwrite: {
                    is_read: "0",
                    is_write: "0"
                },
                configreset: {
                    is_read: "0",
                    is_write: "0"
                },
                hostname: {
                    is_read: "0",
                    is_write: "0"
                }
            }
        },{
            name:"business",
            items:{
                setting: {
                    is_read: "0",
                    is_write: "0"
                }
            }
        },{
            name:"log",
            items:{
                log: {
                    is_read: "0",
                    is_write: "0"
                },
                waringlog: {
                    is_read: "0",
                    is_write: "0"
                }
            }
        }],
        this.state={
            
        }
    }

    render(){
        const { modalVisible, okHandle, cancelHandle, form, Mode, configRole, permissions, roles, loading } = this.props
        const { getFieldDecorator, validateFields, getFieldValue } = form
        const handleOk = () => {
            validateFields((err, fieldsValue) => {
                if(err) {
                  return;
                }
                okHandle(fieldsValue);
            });
        }

        let modalValues = Mode == "Add" ? {} : configRole;
        let initPermissValue = Mode == "Add" ? this.newpermissions : permissions
        return (
            <Modal 
                maskClosable={false}
                destroyOnClose
                width={700}
                title={Mode=="Add"? formatMessage({id:"app.users.role.add"}) : formatMessage({id:"app.users.role.edit"})}
                visible={modalVisible}
                onOk={handleOk}
                onCancel={cancelHandle}
            >
                <Spin spinning={loading}>
                <Form labelCol={{span: 5}} wrapperCol={{span: 15}}>
                    <Form.Item 
                        label={formatMessage({id:"app.users.role.rolename"})}
                        wrapperCol={{span: 5}}
                        >
                        {getFieldDecorator("rolename",{
                            initialValue: modalValues.rolename,
                            rules: [{
                                required:true, 
                                validator: (rule, value, callback) => {
                                    try{
                                        if(value != undefined && value != ""){
                                            let role = []
                                            if(Mode == "Add"){
                                                roles.map((i)=>{
                                                    role.push(i["rolename"])
                                                })
                                                if(role.indexOf(value) !== -1) {
                                                    callback(formatMessage({id:"app.users.role.msg.rolename.format.duplication"})) 
                                                }
                                            }
                                            if(!pat_rolename.test(value)){
                                                throw new Error(formatMessage({id:"app.users.role.msg.rolename.format"}))
                                            }
                                            if(pat_rolename_number.test(value)){
                                                throw new Error(formatMessage({id:"app.users.role.msg.rolename.format.number"}))
                                            }
                                        }else{
                                            throw new Error(formatMessage({id:"app.users.role.msg.rolename"}))
                                        }
                                    }catch(err){
                                        callback(err)
                                    }finally{
                                        callback()
                                    }
                                  }
                            }]
                        })(<Input disabled={Mode == "Config"}/>)}
                    </Form.Item>
                    <Form.Item
                        labelCol={{span: 5}}
                        wrapperCol={{span: 19}}
                        label={formatMessage({id:"app.users.role.permissions"})}
                    >
                        {getFieldDecorator("permissions", {
                            initialValue: initPermissValue,
                            rules: [{required: false,}]
                            })(<RolePermissionMenu mode={Mode} modalValues={modalValues}></RolePermissionMenu>)
                        }
                    </Form.Item>
                    <Form.Item label={formatMessage({id:"app.users.role.description"})}>
                        {getFieldDecorator("description",{
                            initialValue: modalValues.description,
                            rules:[{max: 100, message: formatMessage({id:"app.users.user.msg.description.format.length"})},]
                        })(<TextArea placeholder={formatMessage({id:"app.users.user.description.tip"})} maxLength={100} autosize={{ minRows: 3, maxRows: 6 }}/>)}
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
            <RoleForm {...props} Mode="Add"></RoleForm>
        )
    }
)
const ConfigForm = Form.create()(
     props => {
     return (
       <RoleForm {...props} Mode="Config"></RoleForm>
     )
 })

class RolePermissionMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newpermissions: []
        }
    }

    componentDidMount(){
        const { value, mode } = this.props
        this.setState({
            newpermissions: value
        })
    }

    componentDidUpdate(prevProps) {
        const { value, mode } = this.props
        if(!isEqual(value, prevProps.value)) {
            this.setState({
                newpermissions: value
            })
        }
    }

    changeHandler = (e) => {
        const { onChange } = this.props;
        const { newpermissions } = this.state;
        const checkedBox = {name:e.target.value.split("_")[0],rorw:e.target.value.split("_")[1]}
        newpermissions.map((i)=>{
            Object.keys(i.items).map((j)=>{
                if(j==checkedBox["name"]){
                    i.items[j]["is_"+checkedBox["rorw"]] = e.target.checked == true ? 1 : 0
                }
            })
        })
        this.setState({
            newpermissions
        })
        onChange(newpermissions)
    }


    render() {
        const { value, mode, modalValues } = this.props
        const { newpermissions } = this.state
        let rolePerLabel = localStorage.getItem("umi_locale") == "zh-CN" ? {} : {width:"170px"}
        return (
            newpermissions.map((i, index)=>{
                return (
                    <div key={"P"+i+index} className={styles.rolePermissions}>
                        <div className={styles.rolePermissionsLabel}>{formatMessage({id:`app.users.role.permissions.${i.name}`})}</div>
                        <div className={styles.rolePermissionsHeaderRow}>
                            {
                                Object.keys(i.items).map((j,index)=>{
                                    return (
                                        <div key={"P"+j+index} className={styles.rolePermissionsRow}>
                                            <div className={styles.rolePermissionsRowLabel} style={rolePerLabel}>{formatMessage({id:`app.users.role.menu.${j}`})}</div>
                                            <Checkbox onChange={this.changeHandler} checked={i.items[j]["is_read"] == "1" ? true : false} key={"M"+j+0} value={j+"_read"} disabled={mode == "Config"&&modalValues.rolename == "admin"}>{formatMessage({id:"app.users.role.permissions.read"})}</Checkbox>
                                            <Checkbox onChange={this.changeHandler} checked={i.items[j]["is_write"] == "1" ? true : false} key={"M"+j+1} value={j+"_write"} disabled={mode == "Config"&&modalValues.rolename == "admin"}>{formatMessage({id:"app.users.role.permissions.write"})}</Checkbox>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )       
            })   
        )
    }
}


@connect(({nf5000_user,loading})=>{
    return {
        roles: nf5000_user.roles,
        permissions: nf5000_user.permissions,
        userPerm: nf5000_user.currentPerm,
        roleCount: nf5000_user.roleCount
    }
})
export default class RolePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configRole: [],
            isCreate: false,
            isConfig: false,
            loading: false,
        }
    }

    componentDidMount() {
        this.refreshRole()
        this.queryCurrentPermiss()
    }
    //获取角色信息
    refreshRole = () => {
        const { dispatch } = this.props;
        dispatch({
            type: "nf5000_user/queryRoles",
        })
    }
    //获取指定角色对应权限
    refreshPermission = (role) => {
        const { dispatch } = this.props;
        dispatch({
            type: "nf5000_user/queryPermissions",
            payload: {rolename: role.rolename}
        })
    }
    //获取当前用户权限
    queryCurrentPermiss = () => {
        const { dispatch } = this.props;
        dispatch({
          type: "nf5000_user/queryPermiss"
        })
    }
    //创建角色
    handleIsCreateRole = () => {
        const { dispatch } = this.props;
        this.setState({
            isCreate: true,
        })
    }
    handleFinCreate = () => {
        this.setState({
            isCreate: false,
        })
    }
    handleCreate = (role) => { 
        const { dispatch } = this.props;
        this.setState({
            isCreate: false,
            loading: true
        })
        dispatch({
            type:"nf5000_user/createRole",
            payload: role,
        }).then((res)=>{
          if(res.status_code == 200) message.success(formatMessage({id:"app.users.msg.create.success"}))
            this.handleFinCreate()
            this.setState({
                loading: false
            })
        }).catch((err)=>{
            message.error(formatMessage({id:"app.users.msg.create.fail"}))
            this.handleFinCreate()
            this.setState({
                loading: false
            })
        }).finally(()=>{
            this.refreshRole()
        })
    }
    //修改角色
    handleIsConfig = (role) => { //传进来的role为当前行数据
        const { dispatch, permissions } = this.props;
        dispatch({
            type: "nf5000_user/queryPermissions",
            payload: {rolename: role.rolename}
        })
        this.setState({
            configRole: role,
            isConfig: true
        })
    }
    handleFinConfig = () => {
        this.setState({
            isConfig:false
        })
    }
    handleConfig = (role) => { 
        const { dispatch } = this.props;
        this.setState({
            isConfig: false,
            loading: true
        })
        dispatch({
            type: "nf5000_user/editRole",
            payload: role,
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:"app.users.msg.edit.success"}))
            this.handleFinConfig()
            this.setState({
                loading: false
            })
            if(role["rolename"] === localStorage.getItem("antd-pro-authority")){location.reload(true);}
        }).catch((err)=>{
            message.error(formatMessage({id:"app.users.msg.edit.fail"}))
            this.handleFinConfig()
            this.setState({
                loading: false
            })
        }).finally(()=>{
            this.refreshRole()
            this.refreshPermission(role)
        })
    }
    //删除角色
    handleDeleteRole = (role) => {
        const { dispatch } = this.props;
        this.setState({
            loading: true
        })
        dispatch({
            type: "nf5000_user/deleteRole",
            payload: {rolename: role.rolename}
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:"app.users.msg.delete.success"}))
            this.setState({
                loading: false
            })
        }).catch((err)=>{
            message.error(formatMessage({id:"app.users.role.msg.delete.role.fail"}))
            this.setState({
                loading: false
            })
        }).finally(()=>{
            this.refreshRole()
        })
    }

    render() {
        const columns = [
            {
                title: formatMessage({'id':'app.users.role.msg.title'}) ,
                dataIndex: 'rolename',
                key: 'rolename',
                sortDirections: ['descend']
            },
            {
                title: formatMessage({'id':'app.users.role.msg.des'}) ,
                dataIndex: 'description',
                key: 'description',
                sortDirections: ['descend']
            },
        ]
        
        const { roles, permissions, userPerm, roleCount } = this.props
        const { isCreate, isConfig, configRole, loading } = this.state
        const roleCreateProps = {
            modalVisible: isCreate, okHandle: this.handleCreate, cancelHandle: this.handleFinCreate,
            permissions: permissions, roles: roles, loading: loading

        }
        const roleConfigProps = {
            modalVisible: isConfig, okHandle: this.handleConfig, cancelHandle: this.handleFinConfig,
            configRole: configRole, permissions: permissions, roles: roles, loading: loading
        }
        //为Table每行数据增加key值
        roles.map((i,index) => {
            i.key = index.toString() 
        })
        
        
        if(userPerm["role_write"]) {

            columns.push({
                title: formatMessage({id:"app.users.role.action"}),
                key: 'action',
                width: 180,
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={this.handleIsConfig.bind(this,record)}>{formatMessage({id:"app.users.role.action.edit"})}</a>   &nbsp;
                        <a href="javascript:;" onClick={this.handleDeleteRole.bind(this,record)}>{formatMessage({id:"app.users.role.action.delete"})}</a>
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
                path: '/role',
                breadcrumbName: formatMessage({id:"app.users.role.breafcrumb"}),
            }
        ];
        return (
            <PageHeaderWrapper
                breadcrumb = {{routes}}
            >
                <Spin spinning={loading}>
                    <Card>
                        {
                            userPerm["role_write"] ? <Button icon="plus" type="primary" onClick={roleCount >= 50 ? () => message.warning(formatMessage({id:"app.users.role.msg.create.limit"})) : this.handleIsCreateRole.bind(this)}>{formatMessage({id:"app.users.role.create"})}</Button> : null
                        }
                        {
                            isCreate ? <CreateForm {...roleCreateProps} ></CreateForm> : null
                        }
                        {
                            isConfig ? <ConfigForm {...roleConfigProps} ></ConfigForm> : null
                        }
                        <Table
                        size="middle"
                        columns={columns}
                        dataSource={roles}
                        bordered={false}
                        />
                    </Card>
                </Spin>
            </PageHeaderWrapper>
        )
    }
}
