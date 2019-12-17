import React, {Component} from 'react'
import { Card, Button, Form, Modal, Popover, Divider, Input, Transfer, Switch, Tabs, Select, message, List } from 'antd'
import styles from './groups.less'
import { formatMessage } from 'umi/locale'
import { connect } from 'dva'
import TextArea from 'antd/lib/input/TextArea'
import ConfigForm from './ConfigForm'
import ChooseForm from './ChooseForm'
import IGroup from './Group/IGroup'
import EGroup from './Group/EGroup'
import isEqual from 'lodash/isEqual'


class CreateGroup extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { clickHandle, type, canWrite, content } = this.props
        let cursor = canWrite ? "pointer" : "default"
        
        return (
            <Button onClick={clickHandle} className={styles.createGroup} style={canWrite ? {} : {backgroundColor: "white", border:".5px dashed #000", color:"#aeaeae"}} disabled={!canWrite}>
                <div className={styles.createContext}>
                    <p className={styles.add} style={canWrite ? {} : {color:"#aeaeae"}}>➕</p>
                    <p className={styles.igress}>{content}</p>
                </div>
            </Button>
        )
    }
}
const CreateChoose = Form.create()(
    props => {
        return (
            <ChooseForm {...props}></ChooseForm>
        )
    }
)
const CreateForm = Form.create()(
    props => {
        return (
            <ConfigForm {...props} Mode="Add"></ConfigForm>
        )
})
const EditForm = Form.create()(
    props => {
        return (
            <ConfigForm {...props} Mode="Edit"></ConfigForm>
        )
})

@connect()
export default class Groups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCreate: false,
            isCreateForm: false,
            isEditIGroup: false,
            editIGroup: [],
            refsList: {},
            grouptype: "",
            //ref
            groupsRef: null
        }
    }

    componentDidMount(){
        this.setState({
            groupsRef: React.createRef()
        })
    }

    componentDidUpdate(prevProps, prevState){
        const { forwardingRefs, currentPolicy, currentRuleConnects } = this.props
        const { refsList, groupsRef } = this.state
        
        if(!isEqual(prevProps.currentPolicy, currentPolicy)){
            console.log("接口组信息变化了：",prevProps.currentPolicy, currentPolicy)
            let nrefsList = {}
            this.props.currentPolicy.map((i) => {
                nrefsList[i.name] = React.createRef()
            })
            this.setState({
                refsList: nrefsList
            })
        }
        /////////////////////////////////////////////////
        let c = 0
        let len = Object.keys(refsList).length
        Object.keys(refsList).map((name) => {
            if(refsList[name].current !== null){
                c++
            }
        })
        if(c == len){
            forwardingRefs(refsList, groupsRef.current)
        }
        /////////////////////////////////////////////////
    }
    /**
     * 选择出接口组类型
     */
    handleCreate = (grouptype) => {
        this.setState({
            grouptype,
            isCreate: false,
            isCreateForm: true
        })
    }
    handleFinCreate = () => {
        this.setState({
            isCreate: false
        })
    }
    /**
     * 创建接口组
     */
    handleIsCreateGroup = () => {
        const { itype } = this.props
        if(itype == "Igress"){
            this.setState({
                isCreateForm: true,
            }) 
        }else{
           this.setState({
            isCreate: true,
        })}
    }
    handleCreateGroup = (config) => {
        const { dispatch, itype, refreshGroups, refreshRuleConnect, refreshCopyConnect, refreshDefaultInterfaces, loadingChange } = this.props
        const { grouptype } = this.state
        let t = itype == 'Igress' ? 'I' : 'E';
        if(itype == 'Igress') {
            config.deduplication = config.deduplication == true ? 1 : 0
            config.tuple_mode = config.tuple_mode == true ? 1 : 0 
        }
        loadingChange(true)
        dispatch({
            type: `sf3000_policy/create${t}Group`,
            payload: config
        }).then((res)=>{
            if(typeof res.status_code == "undefined"){
                message.success(formatMessage({id:'app.policy.msg.create.success'}))
            }
            this.handleFinCreateGroup()
            loadingChange(false)
            
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.create.fail'}))
            this.handleFinCreateGroup()
            loadingChange(false)
        }).finally(()=>{
            refreshDefaultInterfaces()
            refreshGroups()
            refreshRuleConnect()
            refreshCopyConnect()
        })
    }
    handleFinCreateGroup = () => {
        this.setState({
            isCreateForm: false,
        }) 
    }
    /**
     * 修改接口组
     */
    handleIsEditIGroup = (groupInfo) => {
        const { itype } = this.props;
        if(itype == "Igress") {
            groupInfo.deduplication = groupInfo.deduplication == 1 ? true : false;
            groupInfo.tuple_mode = groupInfo.tuple_mode == 1 ? true : false;
        }
        this.setState({
            editIGroup: groupInfo,
            isEditIGroup: true,
        })
    }
    handleFinEditIGroup = () => {
        this.setState({
            isEditIGroup: false,
        }) 
    }
    handleEditGroup = (groupInfo) => {
        const { dispatch, itype, refreshGroups, refreshRuleConnect, refreshCopyConnect, refreshDefaultInterfaces, handleFinEditEGroup, loadingChange } = this.props;
        let t = itype == 'Igress' ? 'I' : 'E';
        if(itype == 'Igress') {
            groupInfo.deduplication = groupInfo.deduplication == true ? 1 : 0;
            groupInfo.tuple_mode = groupInfo.tuple_mode == true ? 1 : 0;
        }
        loadingChange(true)
        dispatch({
            type:`sf3000_policy/edit${t}Group`,
            payload: groupInfo
        }).then((res)=>{
            if(typeof res.status_code == "undefined"){
                message.success(formatMessage({id:'app.policy.msg.edit.success'}))
            }
            if(itype == "Igress") this.handleFinEditIGroup()
            else handleFinEditEGroup()
            loadingChange(false)
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.edit.fail'}))
            loadingChange(false)
        }).finally(()=>{
            refreshDefaultInterfaces()
            refreshGroups()
            refreshRuleConnect()
            refreshCopyConnect()
        })
    }
    /**
     * 删除接口组
     */
    handleDeleteGroup = (groupInfo) => {
        const { dispatch, itype, refreshGroups, refreshRuleConnect, refreshCopyConnect, refreshDefaultInterfaces, loadingChange } = this.props;
        let t = itype == 'Igress' ? 'I' : 'E';
        loadingChange(true)
        dispatch({
            type: `sf3000_policy/delete${t}Group`,
            payload: {name: groupInfo.name}
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.delete.success'}))
            loadingChange(false)
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.delete.fail'}))
            loadingChange(false)
        }).finally(()=>{
            refreshDefaultInterfaces() 
            refreshGroups()
            refreshRuleConnect()
            refreshCopyConnect()
        })
    }
    /**
     * 拖拽复制接口组
     */
    handleCopyGroup = (copyInfo) => {
        const { dispatch, itype, refreshGroups, refreshRuleConnect, refreshCopyConnect, refreshDefaultInterfaces, loadingChange } = this.props;
        loadingChange(true)
        dispatch({
            type: 'sf3000_policy/setCopy',
            payload: copyInfo
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.copy.success'}))
            loadingChange(false)
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.copy.fail'}))
            loadingChange(false)
        }).finally(()=>{
            refreshDefaultInterfaces()
            refreshGroups()
            refreshRuleConnect()
            refreshCopyConnect()
        })
    }
    /**
     * 拖拽删除端口
     */
    handleDeletePort = (iteminfo) => {
        const { dispatch, itype, refreshGroups, refreshRuleConnect, refreshCopyConnect, refreshDefaultInterfaces, loadingChange } = this.props;
        loadingChange(true)
        dispatch({
            type: 'sf3000_policy/deletePort',
            payload: iteminfo
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.delete.success'}))
            loadingChange(false)
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.delete.fail'}))
            loadingChange(false)
        }).finally(()=>{
            refreshDefaultInterfaces()
            refreshGroups()
        })
    }

    render() {
        const { isCreate, isCreateForm, refsList, isEditIGroup, editIGroup, grouptype, groupsRef } = this.state;
        const { itype, currentPolicy, currentRuleConnects, handleIsCreateRuleGroup, canWrite, confirmLoading, loadingChange, createContent } = this.props;
        //穿梭框sourse
        const ports = [];
        for(let i = 0; i<48; i++) {
            ports.push({
                key: i.toString(),
                title: `X${i+1}`,
            })
        }
        let isEdit = itype == "Igress" ? isEditIGroup : this.props.isEditEGroup
        let editGroup = itype == "Igress" ? editIGroup : this.props.editEGroup
        let handleFinEditGroup = itype == "Igress" ? this.handleFinEditIGroup : this.props.handleFinEditEGroup
        let gtype = grouptype == "" ? "Igress" : grouptype
        const createProps = {
            type: itype, modalVisible: isCreate, okHandle: this.handleCreate, cancelHandle: this.handleFinCreate,
            ports: ports,
        }
        const createFormProps = {
            type: itype, modalVisible: isCreateForm, okHandle: this.handleCreateGroup, cancelHandle: this.handleFinCreateGroup,
            ports: ports, grouptype: gtype, confirmLoading: confirmLoading, canWrite: canWrite, currentPolicy: currentPolicy
        }
        const editProps = {
            type: itype, modalVisible: isEdit, okHandle: this.handleEditGroup, cancelHandle: handleFinEditGroup,
            editGroup: editGroup, ports: ports, grouptype: gtype, confirmLoading: confirmLoading, canWrite: canWrite, currentPolicy: currentPolicy
        }
        return (
            <div className={styles.groups} ref={groupsRef}>
                <CreateGroup clickHandle={this.handleIsCreateGroup.bind(this)} type={itype} canWrite={canWrite} content={createContent}></CreateGroup>
                {
                    currentPolicy.length > 0 ? itype == "Igress" ? currentPolicy.map((per,index)=>{
                        return <IGroup 
                                    key={"I"+(index+1)} 
                                    itype={itype}
                                    ref={refsList[per.name]} 
                                    groupInfo={per}
                                    clickHandle={this.handleIsEditIGroup.bind(this,per)} 
                                    dltHandle={this.handleDeleteGroup.bind(this,per)}
                                    isCreateRuleGroup={handleIsCreateRuleGroup}
                                    deletePort={this.handleDeletePort}
                                    canWrite={canWrite}
                                />
                    }) : currentPolicy.map((per,index)=>{
                        let isCopy = per.copy && per.copy == 1 ? true : false
                        console.log(per)
                        return (
                                <EGroup 
                                    key={"E"+(index+1)}
                                    itype={itype} 
                                    isCopy={isCopy}
                                    ref={refsList[per.name]}
                                    groupInfo={per}
                                    clickHandle={this.props.handleIsEditEGroup.bind(this,per)} 
                                    dltHandle={this.handleDeleteGroup.bind(this,per)}
                                    deletePort={this.handleDeletePort}
                                    setCopy={this.handleCopyGroup}
                                    canWrite={canWrite}
                                /> 
                        )
                    }) : null
                }
                {
                    isCreate ? <CreateChoose {...createProps}></CreateChoose> : null
                }
                {
                    isCreateForm ? <CreateForm {...createFormProps}></CreateForm> : null
                }
                {
                    isEdit ? <EditForm {...editProps}></EditForm> : null
                }
            </div>
        )
    }
}