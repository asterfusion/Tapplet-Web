import React, { Component } from 'react'
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout'
import {Icon , Button, Card, Col, Row, Modal, Form, Input, List, Select, Switch, InputNumber, message, Spin} from 'antd'
import { connect } from 'dva'
import { dispatch } from 'redux'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import TextArea from 'antd/lib/input/TextArea'
import { RegexPattern } from './rule_validate.js'
import RuleForm from './RuleForm'
import InfiniteScroll from 'react-infinite-scroller'
import styles from './RuleGroup.less'
import { SeekRuleForm } from './SeekRuleForm'
import isEqual from 'lodash/isEqual'

const { pat_groupname } = RegexPattern

const CreateForm = Form.create()(
    props=>{
        return (
            <RuleForm {...props} Mode="create"></RuleForm>
        )
    }
)

const SeekRule_form = Form.create()(
    props => {
        return (
            <SeekRuleForm {...props} Mode="scan"></SeekRuleForm>
        )
    }
)

@connect()
export default class RuleGroup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            ModalVisible:false,
            rules: [],
            editRules: [],
            isEditRuleGroup: false,
            scanrulesform: {},
            isscan: false,
            isscantuple:false, isscantuplev6:false,
            //rule_group包含的所有信息
            data: {
                ingroupname:"",
                outgroupname:"",
                rulegroupname:"",
                description:"",
                rule:[]
            },
            haveDefaultRuleInterface: '',
            refreshKey:0

        };
    }

    componentDidUpdate(prevProps){
        const { currentRuleGroupInfo } = this.props
        const { refreshKey } = this.state
        if((refreshKey == 0 && currentRuleGroupInfo) || !isEqual(prevProps.currentRuleGroupInfo,currentRuleGroupInfo)){
            let rules = []
            currentRuleGroupInfo.rule.map((i) => {
                let rule = {}
                rule.action = i.action
                rule.rule_type = i.rule_type
                Object.keys(i.rule_cfg).map((j) => {
                    rule[j] = i.rule_cfg[j]
                })
                rules.push(rule)
            })
            this.setState({
                rules: rules,
                refreshKey: refreshKey + 1
            })
        }
    }

    addrules = () =>{
        this.setState({
            ModalVisible: true,
        })
    }

    subformhandleOk = () => {
        this.setState({
            ModalVisible: false,
        });
      };
    
    subformhandleCancel = () => {
        this.setState({
            ModalVisible: false,
        });
      };

    subformhandleAdd = () => {
        this.setState({
            ModalVisible: true,
        });
    };

    deleteRules(key){
        let rules = this.state.rules
        rules.splice(key,1)
        this.setState({
            rules:rules
        })
    }

    getFormRules = (rule) =>{
        const { Mode } = this.props
        this.setState({
            rules: [...this.state.rules, rule]
        })
        if(Mode == "Edit"){
            this.setState({
                editRules: [...this.state.editRules, rule]
            })
        }
    }

    //此函数用于查找规则组中的具体规则
    scanrules = (groupinfo, index) =>{
        if (groupinfo.rule[index] == undefined){
            message.info(formatMessage({id:"app.policy.view.err"}))
        }
        else{
        if(groupinfo.rule[index].rule_type == "tuple4"){
            this.setState({
                isscantuple: true
            })
        }

        if(groupinfo.rule[index].rule_type == "tuple6"){
            this.setState({
                isscantuplev6: true
            })
        }

        this.setState({
            isscan: true,
            scanrulesform: groupinfo.rule[index]
        })
    }
}

    handleSeekOk = () =>{
        this.setState({
            isscan: false,
            isscantuple: false,
            isscantuplev6: false,
        })
    }
     //删除规则组时验证端口是否已存在default rule
    checkDefaultRuleInterface = (groupinfo, defaultRuleInterface, currentIPolicy) => {
        let drLength = Object.keys(defaultRuleInterface)
        if (currentIPolicy.length == 0 || drLength.length == 0 || groupinfo.rule.length>1){
            return true
        };
        let interlist = []
        currentIPolicy.map(item => {
            if (item.name == groupinfo.ingroupname) {
                interlist = item.interlist
            }
        }
        )
        let drValues = Object.keys(defaultRuleInterface)
        let inRlueString = ''
        interlist.map(item => {
            if (drValues.indexOf(item) != -1) {
                inRlueString = inRlueString + item +','
            }
        }
        )
        if(inRlueString){
            this.setState({
            haveDefaultRuleInterface: inRlueString,
            },function (){
            message.error(formatMessage({'id':'app.policy.interface'})
            +this.state.haveDefaultRuleInterface+
            formatMessage({'id':'app.policy.updateToDefaultRuleExist'}))
            });
            return false;
        }
        return true;
    }

    delerules = (groupinfo, index) =>{
        const { dispatch, currentRuleGroupInfo, handleEditRuleGroup,defaultRuleInterface,currentIPolicy, refreshRuleConnect} = this.props
        const currentIPolicyName = groupinfo.ingroupname

        if (groupinfo.rule[index] == undefined){
            message.info(formatMessage({id:"app.policy.delete_fail"}))
        }
        
        else {
            if(this.checkDefaultRuleInterface(groupinfo,defaultRuleInterface,currentIPolicy)){
            this.setState({
                loading: true, //删除规则也需要将loading状态置为true
            })
            dispatch({
                type: `nf5000_policy/deleteRuleGroup`,
                payload: {'rulegroupname': groupinfo.rulegroupname, 'ruleid':groupinfo.rule[index].ruleid}
            }).then((res)=>{
                 //删除某条规则后需刷新modal
                handleEditRuleGroup(groupinfo.rulegroupname)
                message.info(formatMessage({id:"app.policy.delete.successfully"}))
            }).finally(()=>{
                refreshRuleConnect()
                this.setState({
                    loading: false,
                })
                })
            }   
        }       
    }

    render() {
        const { Mode, form, modalVisible, handleOk, dispatch, confirmLoading, currentRuleConnects, currentRuleGroupInfo, closeModal, footerVisible, canWrite} = this.props;
        const { ModalVisible, data, isEditRuleGroup, rules, editRules } = this.state;
        const { isscantuple, isscantuplev6, isscan, scanrulesform, loading} = this.state;
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        let showdata = [];
        //将规则组中的规则类型取出来存放在showdata数组中
        rules.map((item,index) =>{
            if (rules[index] && rules[index].rule_type){
                showdata.push("rule_type:  " + rules[index].rule_type)
            }
        })

        const Okhandle = ()=>{
            validateFields((err, fieldsvalue) =>{
                if(err){
                    return
                }
                data.ingroupname = fieldsvalue["ingroupname"]
                data.outgroupname = fieldsvalue["outgroupname"]
                data.rulegroupname = fieldsvalue["rulegroupname"]
                data.description = fieldsvalue["description"]
                if(Mode == "Add"){
                    rules.map((item,index)=>{
                        if (rules[index].action){
                            rules[index].action = "1"
                        }
                        else if(!rules[index].action){
                            rules[index].action = "0"
                        }
                    })
                    data.rule = rules
                }else if(Mode == "Edit"){
                    editRules.map((item,index)=>{
                        if (editRules[index].action){
                            editRules[index].action = "1"
                        }
                        else if(!editRules[index].action){
                            editRules[index].action = "0"
                        }
                    })
                    data.rule = editRules
                }
                
                JSON.stringify(data)
                handleOk(data)
            })
        }

        const createProps = {
            ModalVisible: ModalVisible, handleCancel: this.subformhandleCancel, handleOk: this.subformhandleOk, 
            handleAdd1: this.subformhandleAdd, subrules: this.getFormRules, handleSeekOk: this.handleSeekOk,
        }
        const scanProps = {
            isscantuple, isscantuplev6, scanrules: scanrulesform, handleSeekOk: this.handleSeekOk, isscan: isscan
        }


        return (        
            <div>
                <Modal
                    maskClosable={false}
                    destroyOnClose
                    width={700}
                    title={formatMessage({id:"app.policy.configuring.grouprule"})}
                    visible={modalVisible}
                    onCancel={closeModal}
                    footer={ (footerVisible && canWrite) ? [
                        <Button key="cancel" onClick={closeModal}> {formatMessage({id:"app.policy.button.cancel"})} </Button>,
                        <Button type="primary" key="ok" onClick={Okhandle}> {formatMessage({id:"app.policy.button.on"})} </Button>,         
                    ] : false}
                >
                <Spin spinning={confirmLoading || loading} >
                    <Form 
                        labelCol={{span:5}} 
                        wrapperCol={{span:15}}
                    >
                        <Form.Item 
                            label={formatMessage({id:"app.policy.groupname"})}
                            wrapperCol={{span:5}}
                            >
                            {getFieldDecorator("rulegroupname",{
                            initialValue: currentRuleGroupInfo ? currentRuleGroupInfo.rulegroupname : "",
                            rules: [{
                                required: true,
                                validator: (rule,value,callback) => {
                                    try{
                                        if(value != undefined && value != ""){
                                            let rulegroupnameArr = []
                                            if(Mode == "Add"){
                                                currentRuleConnects.map((i) => {
                                                    rulegroupnameArr.push(i.rulegroupname)
                                                })
                                                if(rulegroupnameArr.indexOf(value) !== -1){
                                                    throw new Error(formatMessage({id:"app.policy.msg.rulegroupname.format.duplication"}))
                                                }
                                            }
                                            if(!pat_groupname.test(value)){
                                                throw new Error(formatMessage({id:"app.policy.msg.groupname.format"}))
                                            }
                                            if(value.length > 15){
                                                throw new Error(formatMessage({id:"app.policy.msg.groupname.format.length"}))
                                            }
                                        }else{
                                            throw new Error(formatMessage({id:"app.policy.msg.rulegroupname"}))
                                        }
                                    }catch(err){
                                        callback(err)
                                    }finally{
                                        callback()
                                    }
                                }
                            }],
                            })(<Input disabled={Mode == "Edit" || !canWrite} />)}
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({id:"app.policy.description"})}
                            wrapperCol={{span:10}}
                            >
                            {getFieldDecorator("description",{
                                initialValue: currentRuleGroupInfo ? currentRuleGroupInfo.description : "",
                                rules: [{max:100, message: formatMessage({id:"app.users.user.msg.description.format.length"})}]
                            })(<TextArea placeholder={formatMessage({id:"app.users.user.description.tip"})} autosize={{minRows:3,maxRows:5}} disabled={!canWrite}/>)}
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({id:"app.policy.current.filter"})}
                            wrapperCol={{span:14}}
                            >
                            {getFieldDecorator("rule_cfg",{})(
                                <>
                                    <div className={styles.demo_infinite_container}>
                                            <List 
                                            style={{marginLeft:"12px"}}
                                                dataSource={showdata}
                                                renderItem={(item, index)=>(
                                                    <List.Item key={item.id} extra={
                                                        <div>
                                                            {Mode == "Edit" ? <Button onClick={()=>{this.scanrules(currentRuleGroupInfo, index)}} style={{border:"0"}}>{formatMessage({'id':'app.policy.view'})}</Button> : null}
                                                            {Mode == "Edit" ? <Button onClick={()=>{this.delerules(currentRuleGroupInfo, index)}} style={{border:"0"}} disabled={!canWrite}><Icon type="close" /></Button> : null}
                                                        </div>
                                                    }> 
                                                        <List.Item.Meta title={(JSON.stringify(item)).replace(/\"/g,"")} style={{textAlign:"left"}} />
                                                    </List.Item>
                                                )}
                                            >
                                            </List>
                                    </div>
                                    <div>
                                        <Button onClick={this.addrules} style={{backgroundColor:"#5c7cb3", padding:"0 10px"}} disabled={!canWrite}>
                                            ➕
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form.Item>
                    </Form>
                </Spin>
                </Modal>
                {
                    ModalVisible ? <CreateForm {...createProps}></CreateForm> : null
                }
                {
                    isscan ? <SeekRule_form {...scanProps}></SeekRule_form> :null 
                }
            </div>
        );
    }
}
