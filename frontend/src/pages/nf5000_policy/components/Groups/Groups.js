import React, {Component} from 'react'
import { Card, Button, Form, Modal, Popover, Divider, Input, Transfer, Switch, Tabs, Select, message, List } from 'antd'
import styles from './groups.less'
import { formatMessage } from 'umi/locale'
import { connect } from 'dva'
import TextArea from 'antd/lib/input/TextArea'
import ConfigForm from './GroupForm'
import IGroup from './Group/IGroup'
import EGroup from './Group/EGroup'

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

@connect(({nf5000_home, loading})=>{
    return {
        currentPortNumber: nf5000_home.currentPortNumber,
    }
})
export default class Groups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCreateForm: false,
            isEditIGroup: false,
            editIGroup: [],
            refsList: {},
            grouptype: "",
            groupsRef: null
        }
    }

    componentDidMount(){
        const {dispatch} = this.props
        dispatch({
            type: "nf5000_home/fetchPortNumber"
        });
        this.setState({
            groupsRef: React.createRef()
        })
    }

    componentDidUpdate(prevProps, prevState){
        const { forwardingRefs, currentPolicy } = this.props
        const { refsList, groupsRef } = this.state

        if(prevProps.currentPolicy !== currentPolicy){
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
     * 创建接口组
     */
    handleIsCreateGroup = () => {
        this.setState({
            isCreateForm: true
        })
    }
    handleCreateGroup = (config) => {
        const { dispatch, itype, refreshGroups, refreshRuleConnect, loadingChange } = this.props
        const { grouptype } = this.state
        let t = itype == 'Igress' ? 'I' : 'E';
        loadingChange(true)
        dispatch({
            type: `nf5000_policy/create${t}Group`,
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
            refreshGroups()
            refreshRuleConnect()
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
        const { dispatch, itype, refreshGroups, refreshRuleConnect, handleFinEditEGroup, loadingChange } = this.props;
        let t = itype == 'Igress' ? 'I' : 'E';
        loadingChange(true)
        dispatch({
            type:`nf5000_policy/edit${t}Group`,
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
            refreshGroups()
            refreshRuleConnect()
        })
    }
    /**
     * 删除接口组
     */
    handleDeleteGroup = (groupInfo) => {
        const { dispatch, itype, refreshGroups, refreshRuleConnect, loadingChange } = this.props;
        let t = itype == 'Igress' ? 'I' : 'E';
        loadingChange(true)
        dispatch({
            type: `nf5000_policy/delete${t}Group`,
            payload: {name: groupInfo.name}
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.delete.success'}))
            loadingChange(false)
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.delete.fail'}))
            loadingChange(false)
        }).finally(()=>{
            refreshGroups()
            refreshRuleConnect()
        })
    }
    /**
     * 拖拽删除端口
     */
    handleDeletePort = (iteminfo) => {
        const { dispatch, itype, refreshGroups, refreshRuleConnect, loadingChange } = this.props;
        loadingChange(true)
        dispatch({
            type: 'nf5000_policy/deletePort',
            payload: iteminfo
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.delete.success'}))
            loadingChange(false)
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.delete.fail'}))
            loadingChange(false)
        }).finally(()=>{
            refreshGroups()
        })
    }

    render() {
        const { isCreateForm, refsList, isEditIGroup, editIGroup, grouptype, groupsRef } = this.state;
        const { itype, currentPolicy, handleIsCreateRuleGroup, canWrite, confirmLoading, loadingChange, createContent, currentPortNumber } = this.props;
        //穿梭框sourse
        const ports = [];
        for(let i = 0; i<currentPortNumber; i++) {
            ports.push({
                key: i.toString(),
                title: `G${i+1}`,
            })
        }
        let isEdit = itype == "Igress" ? isEditIGroup : this.props.isEditEGroup
        let editGroup = itype == "Igress" ? editIGroup : this.props.editEGroup
        let handleFinEditGroup = itype == "Igress" ? this.handleFinEditIGroup : this.props.handleFinEditEGroup
        let gtype = grouptype == "" ? "Igress" : grouptype
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
                    itype == "Igress" ? currentPolicy.map((per,index)=>{
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
                        return (
                                <EGroup 
                                    key={"E"+(index+1)}
                                    itype={itype} 
                                    ref={refsList[per.name]}
                                    groupInfo={per}
                                    clickHandle={this.props.handleIsEditEGroup.bind(this,per)} 
                                    dltHandle={this.handleDeleteGroup.bind(this,per)}
                                    deletePort={this.handleDeletePort}
                                    canWrite={canWrite}
                                /> 
                        )
                    })
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