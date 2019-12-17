import React, { Component } from 'react'
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout'
import {Button, Card, Col, Row, Modal, Form, Input, List, Select, Switch, InputNumber, message, Spin, Icon} from 'antd'
import { connect } from 'dva'
import { dispatch } from 'redux'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import TextArea from 'antd/lib/input/TextArea'
import {RegexPattern} from './rule_validate.js'
import RuleForm from './RuleForms'
import SeekRuleForm from './SeekRuleForm'
import styles from './RuleGroup.less'
import isEqual from 'lodash/isEqual'
/////////////////////////////import精简

const { pat_groupname } = RegexPattern
const CreateForm = Form.create()(
    props=>{
        return (
            <RuleForm {...props}></RuleForm>
        )
    }
)

const SeekRule_form = Form.create()(
    props => {
        return (
            <SeekRuleForm {...props}></SeekRuleForm>
        )
    }
)

@connect()
export default class RuleGroup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ModalVisible:false,
            rules: [],
            editRules: [],
            isEditRuleGroup: false,
            scanrulesform: {},
            isscan: false,
            isscantuple:false, isscantuplev6:false, isscanipset:false, isscanipsetv6:false, isscankeyword:false, isscaneth_type:false,
            //rule_group包含的所有信息
            data: {
                ingroupname:"",
                outgroupname:"",
                rulegroupname:"",
                description:"",
                rule:[]
            },
            //
            deleteRuleLoading: false,
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
        if(groupinfo.rule[index].rule_type == "tuple"){
            this.setState({
                isscantuple: true
            })
        }

        if(groupinfo.rule[index].rule_type == "tuplev6"){
            this.setState({
                isscantuplev6: true
            })
        }

        if(groupinfo.rule[index].rule_type == "ipset"){
            this.setState({
                isscanipset: true
            })
        }

        if(groupinfo.rule[index].rule_type == "ipsetv6"){
            this.setState({
                isscanipsetv6: true
            })
        }

        if(groupinfo.rule[index].rule_type == "keyword"){
            this.setState({
                isscankeyword: true
            })
        }

        if(groupinfo.rule[index].rule_type == "eth_type"){
            this.setState({
                isscaneth_type: true
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
            isscanipset: false,
            isscanipsetv6: false,
            isscankeyword: false,
            isscaneth_type: false
        })
    }
    /**
     * 判断规则组的入接口组中是否存在已配置default的端口
     */
    checkHasDefaultOrNot = (groupinfo, defaultRuleInterface, ingroupInterfaces, dltIndex) => {
        let drLength = Object.keys(defaultRuleInterface).length
        let igroupInterLength = Object.keys(ingroupInterfaces).length
        let permitcount = 0, allDrop = false, lastPermit = false
        groupinfo.rule.map((i) => {
            if(i.rule_cfg["action"] == "1"){
                permitcount++
            }
        })
        lastPermit = permitcount <= 1 ? true : false
        if(groupinfo.rule[dltIndex].rule_cfg["action"] == "1"&&lastPermit){
            allDrop = true
        }
        if ( igroupInterLength == 0 || drLength == 0 || (groupinfo.rule.length > 1 && !allDrop)){
            return true
        }

        let drValues = Object.keys(defaultRuleInterface)
        let inRuleArr = []
        ingroupInterfaces[groupinfo.ingroupname].map((i) => {
            if(defaultRuleInterface[i]){
                inRuleArr.push(i)
            }
        })

        if(inRuleArr.length > 0){
            this.setState({
            haveDefaultRuleInterface: inRuleArr.join(),
            },function (){
                message.error(formatMessage({id:'app.policy.interface'})
                +this.state.haveDefaultRuleInterface+
                formatMessage({id:'app.policy.updateToDefaultRuleExist'}))
            });
            return false;
        }
        return true;
    }
    /**
     * 删除规则
     */
    delerules = (groupinfo, index) =>{
        const { dispatch, currentRuleGroupInfo, handleEditRuleGroup, defaultRuleInterface, ingroupInterfaces } = this.props
        if (groupinfo.rule[index] == undefined){
            message.info(formatMessage({id:"app.policy.delete_fail"}))
        }
        else {
            if(this.checkHasDefaultOrNot(currentRuleGroupInfo, defaultRuleInterface, ingroupInterfaces, index)){
                this.setState({
                    deleteRuleLoading: true //删除规则也需要将loading状态置为true
                })
                dispatch({
                    type: `sf3000_policy/deleteRuleGroup`,
                    payload: {'rulegroupname': groupinfo.rulegroupname, 'ruleid':groupinfo.rule[index].ruleid}
                }).then((res)=>{
                    message.info(formatMessage({id:"app.policy.delete.successfully"}))
                }).finally(()=>{
                    this.setState({
                        deleteRuleLoading: false
                })
                })
                //删除某条规则后需刷新modal
                handleEditRuleGroup(groupinfo.rulegroupname)
            }
        }       
    }

    render() {
        const { Mode, form, modalVisible, handleOk, confirmLoading, 
                currentRuleConnects, currentRuleGroupInfo, curRGroupConnect, closeModal, defaultRuleInterface, igroupInterfaces} = this.props;
        const { ModalVisible, data, isEditRuleGroup, rules, editRules } = this.state;
        const { isscantuple, isscantuplev6, isscanipset, isscanipsetv6, isscaneth_type, isscankeyword, 
            isscan, scanrulesform, deleteRuleLoading} = this.state;
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

                handleOk(data)
            })    
        }

        return (        
            <div>

                <Modal
                    maskClosable={false}
                    destroyOnClose
                    width={700}
                    title={formatMessage({id:"app.policy.configuring.grouprule"})}
                    visible={modalVisible}
                    onOk={Okhandle}
                    onCancel={closeModal}
                >
                <Spin spinning={confirmLoading || deleteRuleLoading} >
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
                            })(<Input disabled={Mode == "Edit"}/>)}
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({id:"app.policy.description"})}
                            wrapperCol={{span:10}}
                            >
                            {getFieldDecorator("description",{
                                initialValue: currentRuleGroupInfo ? currentRuleGroupInfo.description : "",
                                rules: [{max:100, message: formatMessage({id:"app.users.user.msg.description.format.length"})}]
                            })(<TextArea placeholder={formatMessage({id:"app.users.user.description.tip"})} autosize={{minRows:3,maxRows:5}}/>)}
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
                                                            {Mode == "Edit" ? <Button onClick={()=>{this.scanrules(currentRuleGroupInfo, index)}} style={{border:"0"}}>{formatMessage({id:'app.policy.rulegroup.rule.view'})}</Button> : null}
                                                            {Mode == "Edit" ? <Button onClick={()=>{this.delerules(currentRuleGroupInfo, index)}} style={{border:"0"}}><Icon type="close" /></Button> : null}
                                                        </div>
                                                    }> 
                                                        <List.Item.Meta title={(JSON.stringify(item)).replace(/\"/g,"")} style={{textAlign:"left"}} />
                                                    </List.Item>
                                                )}
                                            >
                                            </List>
                                    </div>
                                    <div>
                                        <Button onClick={this.addrules} style={{backgroundColor:"#d01218", padding:"0 10px"}}>
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
                    ModalVisible ? <CreateForm ModalVisible={ModalVisible} handleCancel={this.subformhandleCancel} handleOk={this.subformhandleOk} handleAdd1={this.subformhandleAdd}
                                subrules={this.getFormRules}></CreateForm> : null
                }
                {
                    isscan ? <SeekRule_form isscantuple={isscantuple} isscantuplev6={isscantuplev6} isscanipset={isscanipset} isscanipsetv6={isscanipsetv6}
                            isscaneth_type={isscaneth_type} isscankeyword={isscankeyword} scanrules={scanrulesform} handleSeekOk={this.handleSeekOk}
                            isscan={isscan} ></SeekRule_form> :null 
                }
            </div>
        );
    }
}
