import React, { Component } from 'react'
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout'
import {Button, Card, Col, Row, Modal, Form, Input, List, Select, Switch, InputNumber, message} from 'antd'
import { connect } from 'dva'
import { Dispatch } from 'redux'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import styles from '@/pages/sf3000_policy/sf3000_policy.less'
import TextArea from 'antd/lib/input/TextArea'
import { RegexPattern } from './rule_validate.js'
import { extend } from 'umi-request';
import Tuple from './Forms/Tuple'
import Tuplev6 from './Forms/Tuplev6'
import Ipset from './Forms/Ipset'
import Ipsetv6 from './Forms/Ipsetv6'
import HardKeyword from './Forms/HardKeyword'
import EthType from './Forms/EthType'

@connect()
export default class RuleForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false, istuple:true, istuplev6:false, isipset:false, isipsetv6:false, ishard_keyword:false, iseth_type:false, 
            objdata: {},
        }
    }

    componentDidMount() {
        const { ModalVisible } = this.props;
        this.setState({
            visible: ModalVisible
        })
    }

    handleSelect = (v) => {
        const { form } = this.props
        form.resetFields()
        if (v == "tuple"){
            this.setState({
                istuple:true, istuplev6:false, isipset:false, isipsetv6:false, ishard_keyword:false, iseth_type:false
            })
        }
        else if (v == "tuplev6"){
            this.setState({
                istuplev6:true, istuple:false, isipset:false, isipsetv6:false, ishard_keyword:false, iseth_type:false
            })
        }
        else if (v == "ipset"){
            this.setState({
                isipset:true, istuple:false, istuplev6:false, isipsetv6:false, ishard_keyword:false, iseth_type:false
            })
        }
        else if (v == "ipsetv6"){
            this.setState({
                isipsetv6:true, istuple:false, istuplev6:false, isipset:false, ishard_keyword:false, iseth_type:false
            })
        }
        else if (v == "keyword"){
            this.setState({
                ishard_keyword:true, istuple:false, istuplev6:false, isipset:false, isipsetv6:false, iseth_type:false
            })
        }
        else if (v == "eth_type"){
            this.setState({
                iseth_type:true, istuple:false, istuplev6:false, isipset:false, isipsetv6:false, ishard_keyword:false
            })
        }

    }

    render() {
        const {form, ModalVisible, handleOk, handleCancel, handleAdd1, value, subrules} = this.props;
        const { visible, istuple, istuplev6, isipset, isipsetv6, iseth_type, ishard_keyword, objdata} = this.state;
        const {getFieldDecorator, validateFields, getFieldValue, getFieldsValue} = form;

        const subformhandleAdd = () => {
            validateFields((err, fieldsValue) => {
                if(err) {
                    return;
                }
                //判断是否填了
                if((getFieldValue("rule_type") == "ipset" || getFieldValue("rule_type") == "ipsetv6") && !getFieldValue("sip") && !getFieldValue("dip") 
                    && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) 
                    && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) 
                    && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null)){
                        message.info(formatMessage({id:"app.policy.least.rule"}))
                        return 
                }
                if( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6" ) 
                    && !getFieldValue("start_sip") && !getFieldValue("end_sip") && !getFieldValue("start_dip") && !getFieldValue("end_dip")
                    && (typeof getFieldValue("start_sport") == "undefined" || getFieldValue("start_sport") == null) 
                    && (typeof getFieldValue("end_sport") == "undefined" || getFieldValue("end_sport") == null)
                    && (typeof getFieldValue("start_dport") == "undefined" || getFieldValue("start_dport") == null) 
                    && (typeof getFieldValue("end_dport") == "undefined" || getFieldValue("end_dport") == null)
                    && (typeof getFieldValue("start_proto") == "undefined" || getFieldValue("start_proto") == null) 
                    && (typeof getFieldValue("end_proto") == "undefined" || getFieldValue("end_proto") == null)
                    && (typeof getFieldValue("start_vid") == "undefined" || getFieldValue("start_vid") == null) 
                    && (typeof getFieldValue("end_vid") == "undefined" || getFieldValue("end_vid") == null)){
                        message.info(formatMessage({id:"app.policy.least.rule"}))
                        return
                    }
                //判断范围
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (typeof getFieldValue("start_sport") != "undefined" && getFieldValue("start_sport") != null 
                    && typeof getFieldValue("end_sport") != "undefined" && getFieldValue("end_sport") != null 
                    && getFieldValue("start_sport") > getFieldValue("end_sport"))){
                       message.info(formatMessage({id:"app.policy.rule.sport.order"}))
                       return
                }
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") &&
                    (typeof getFieldValue("start_dport") != "undefined" && getFieldValue("start_dport") != null 
                    && typeof getFieldValue("end_dport") != "undefined" && getFieldValue("end_dport") != null 
                    && getFieldValue("start_dport") > getFieldValue("end_dport"))){
                       message.info(formatMessage({id:"app.policy.rule.dport.order"}))
                       return
                }
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") &&
                    (typeof getFieldValue("start_proto") != "undefined" && getFieldValue("start_proto") != null 
                    && typeof getFieldValue("end_proto") != "undefined" && getFieldValue("end_proto") != null
                    && getFieldValue("start_proto") > getFieldValue("end_proto"))){
                       message.info(formatMessage({id:"app.policy.rule.proto.order"}))
                       return
                }
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") &&
                    (typeof getFieldValue("start_vid") != "undefined" && getFieldValue("start_vid") != null 
                    && typeof getFieldValue("end_vid") != "undefined" && getFieldValue("end_vid") != null 
                    && getFieldValue("start_vid") > getFieldValue("end_vid"))){
                       message.info(formatMessage({id:"app.policy.rule.vid.order"}))
                       return
                }
                //判断是否填写完整
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && ((getFieldValue("start_sip") && !getFieldValue("end_sip")) || (!getFieldValue("start_sip") && getFieldValue("end_sip")))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && ((getFieldValue("start_dip") && !getFieldValue("end_dip")) || (!getFieldValue("start_dip") && getFieldValue("end_dip")))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (((typeof getFieldValue("start_sport") != "undefined" && getFieldValue("start_sport") != null)
                    && (typeof getFieldValue("end_sport") == "undefined" || getFieldValue("end_sport") == null))  || 
                    ((typeof getFieldValue("start_sport") == "undefined" || getFieldValue("start_sport") == null) 
                    && (typeof getFieldValue("end_sport") != "undefined" && getFieldValue("end_sport") != null)))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (((typeof getFieldValue("start_dport") != "undefined" && getFieldValue("start_dport") != null) 
                    && (typeof getFieldValue("end_dport") == "undefined" || getFieldValue("end_dport") == null)) || 
                    ((typeof getFieldValue("start_dport") == "undefined" || getFieldValue("start_dport") == null) 
                    && (typeof getFieldValue("end_dport") != "undefined" && getFieldValue("end_dport") != null)))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (((typeof getFieldValue("start_proto") != "undefined" && getFieldValue("start_proto") != null) 
                    && (typeof getFieldValue("end_proto") == "undefined" || getFieldValue("end_proto") == null)) || 
                    ((typeof getFieldValue("start_proto") == "undedined" || getFieldValue("start_proto") == null) 
                    && (typeof getFieldValue("end_proto") != "undefined" && getFieldValue("end_proto") != null)))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (((typeof getFieldValue("start_vid") != "undefined" && getFieldValue("start_vid") != null) 
                    && (typeof getFieldValue("end_vid") == "undefined" || getFieldValue("end_vid") == null)) || 
                    ((typeof getFieldValue("start_vid") == "undefined" || getFieldValue("start_vid") == null) 
                    && (typeof getFieldValue("end_vid") != "undefined" && getFieldValue("end_vid") != null)))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                //ipset和ipset6的11种组合情况
                if ( (  getFieldValue("rule_type") == "ipset" || getFieldValue("rule_type") == "ipsetv6") && 
                        !(getFieldValue("sip") && !getFieldValue("dip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null)) &&
                        !(getFieldValue("dip") && !getFieldValue("sip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null)) && 
                        !(getFieldValue("sip") && getFieldValue("dip") && (typeof getFieldValue("sport") != "undefined" && getFieldValue("sport") != null) && (typeof getFieldValue("dport") != "undefined" && getFieldValue("dport") != null) && (typeof getFieldValue("proto") != "undefined" && getFieldValue("proto") != null)) && 
                        !((typeof getFieldValue("proto") != "undefined" && getFieldValue("proto") != null) && (getFieldValue("sip") && !getFieldValue("dip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && typeof getFieldValue("dport") == "undefined"|| 
                                                    getFieldValue("dip") && !getFieldValue("sip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) || 
                                                    (typeof getFieldValue("sport") != "undefined" && getFieldValue("sport") != null) && !getFieldValue("sip") && !getFieldValue("dip") && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) || 
                                                    (typeof getFieldValue("dport") != "undefined" && getFieldValue("dport") != null) && !getFieldValue("sip") && !getFieldValue("dip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) || 
                                                    (getFieldValue("sip") && (typeof getFieldValue("sport") != "undefined" && getFieldValue("sport") != null) && !getFieldValue("dip") && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null)) || 
                                                    (getFieldValue("dip") && (typeof getFieldValue("dport") != "undefined" && getFieldValue("dport") != null) && !getFieldValue("sip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null)) )
                        ) &&
                        !(getFieldValue("sip") && (typeof getFieldValue("dport") != "undefined" && getFieldValue("dport") != null) && !getFieldValue("dip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null)) && 
                        !(getFieldValue("dip") && (typeof getFieldValue("sport") != "undefined" && getFieldValue("sport") != null) && !getFieldValue("sip") && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null))){
                        message.info(formatMessage({id: "app.policy.msg.combination"}))
                        return
                    }

                Object.keys(fieldsValue).forEach(key=>{
                    typeof fieldsValue[key] != "undefined" && fieldsValue[key] != null && 
                    ((typeof fieldsValue[key] == "string" && fieldsValue[key] != "") || (typeof fieldsValue[key] != "string")) && Object.assign(objdata, {[key]:fieldsValue[key]})
                })

                if (!objdata.action){
                    objdata.action = 0
                }
                subrules(objdata)
                message.info(formatMessage({id:"app.policy.add.rule.successfully"}))
                form.resetFields()
                this.setState({
                    istuple:true, istuplev6:false, isipset:false, isipsetv6:false, ishard_keyword:false, iseth_type:false,
                    objdata:{}
                })
            });
        }

        const subformhandleSubmit = () =>{
            validateFields((err, fieldsValue) => {
                if(err){
                    return
                }
                //判断是否填了
                if((getFieldValue("rule_type") == "ipset" || getFieldValue("rule_type") == "ipsetv6") && !getFieldValue("sip") && !getFieldValue("dip") 
                    && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) 
                    && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) 
                    && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null)){
                        message.info(formatMessage({id:"app.policy.least.rule"}))
                        return 
                }
                if( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6" ) 
                    && !getFieldValue("start_sip") && !getFieldValue("end_sip") && !getFieldValue("start_dip") && !getFieldValue("end_dip")
                    && (typeof getFieldValue("start_sport") == "undefined" || getFieldValue("start_sport") == null) 
                    && (typeof getFieldValue("end_sport") == "undefined" || getFieldValue("end_sport") == null)
                    && (typeof getFieldValue("start_dport") == "undefined" || getFieldValue("start_dport") == null) 
                    && (typeof getFieldValue("end_dport") == "undefined" || getFieldValue("end_dport") == null)
                    && (typeof getFieldValue("start_proto") == "undefined" || getFieldValue("start_proto") == null) 
                    && (typeof getFieldValue("end_proto") == "undefined" || getFieldValue("end_proto") == null)
                    && (typeof getFieldValue("start_vid") == "undefined" || getFieldValue("start_vid") == null) 
                    && (typeof getFieldValue("end_vid") == "undefined" || getFieldValue("end_vid") == null)){
                        message.info(formatMessage({id:"app.policy.least.rule"}))
                        return
                    }
                //判断范围
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (typeof getFieldValue("start_sport") != "undefined" && getFieldValue("start_sport") != null 
                    && typeof getFieldValue("end_sport") != "undefined" && getFieldValue("end_sport") != null 
                    && getFieldValue("start_sport") > getFieldValue("end_sport"))){
                       message.info(formatMessage({id:"app.policy.rule.sport.order"}))
                       return
                }
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") &&
                    (typeof getFieldValue("start_dport") != "undefined" && getFieldValue("start_dport") != null 
                    && typeof getFieldValue("end_dport") != "undefined" && getFieldValue("end_dport") != null 
                    && getFieldValue("start_dport") > getFieldValue("end_dport"))){
                       message.info(formatMessage({id:"app.policy.rule.dport.order"}))
                       return
                }
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") &&
                    (typeof getFieldValue("start_proto") != "undefined" && getFieldValue("start_proto") != null 
                    && typeof getFieldValue("end_proto") != "undefined" && getFieldValue("end_proto") != null
                    && getFieldValue("start_proto") > getFieldValue("end_proto"))){
                       message.info(formatMessage({id:"app.policy.rule.proto.order"}))
                       return
                }
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") &&
                    (typeof getFieldValue("start_vid") != "undefined" && getFieldValue("start_vid") != null 
                    && typeof getFieldValue("end_vid") != "undefined" && getFieldValue("end_vid") != null 
                    && getFieldValue("start_vid") > getFieldValue("end_vid"))){
                       message.info(formatMessage({id:"app.policy.rule.vid.order"}))
                       return
                }
                //判断是否填写完整
                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && ((getFieldValue("start_sip") && !getFieldValue("end_sip")) || (!getFieldValue("start_sip") && getFieldValue("end_sip")))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && ((getFieldValue("start_dip") && !getFieldValue("end_dip")) || (!getFieldValue("start_dip") && getFieldValue("end_dip")))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (((typeof getFieldValue("start_sport") != "undefined" && getFieldValue("start_sport") != null)
                    && (typeof getFieldValue("end_sport") == "undefined" || getFieldValue("end_sport") == null))  || 
                    ((typeof getFieldValue("start_sport") == "undefined" || getFieldValue("start_sport") == null) 
                    && (typeof getFieldValue("end_sport") != "undefined" && getFieldValue("end_sport") != null)))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (((typeof getFieldValue("start_dport") != "undefined" && getFieldValue("start_dport") != null) 
                    && (typeof getFieldValue("end_dport") == "undefined" || getFieldValue("end_dport") == null)) || 
                    ((typeof getFieldValue("start_dport") == "undefined" || getFieldValue("start_dport") == null) 
                    && (typeof getFieldValue("end_dport") != "undefined" && getFieldValue("end_dport") != null)))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (((typeof getFieldValue("start_proto") != "undefined" && getFieldValue("start_proto") != null) 
                    && (typeof getFieldValue("end_proto") == "undefined" || getFieldValue("end_proto") == null)) || 
                    ((typeof getFieldValue("start_proto") == "undedined" || getFieldValue("start_proto") == null) 
                    && (typeof getFieldValue("end_proto") != "undefined" && getFieldValue("end_proto") != null)))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                if ( (getFieldValue("rule_type") == "tuple" || getFieldValue("rule_type") == "tuplev6") && 
                    (((typeof getFieldValue("start_vid") != "undefined" && getFieldValue("start_vid") != null) 
                    && (typeof getFieldValue("end_vid") == "undefined" || getFieldValue("end_vid") == null)) || 
                    ((typeof getFieldValue("start_vid") == "undefined" || getFieldValue("start_vid") == null) 
                    && (typeof getFieldValue("end_vid") != "undefined" && getFieldValue("end_vid") != null)))){
                    message.info(formatMessage({id:"app.policy.rule.supplement"}))
                    return
                }

                //ipset和ipset6的11种组合情况
                if ( (  getFieldValue("rule_type") == "ipset" || getFieldValue("rule_type") == "ipsetv6") && 
                        !(getFieldValue("sip") && !getFieldValue("dip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null)) &&
                        !(getFieldValue("dip") && !getFieldValue("sip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null)) && 
                        !(getFieldValue("sip") && getFieldValue("dip") && (typeof getFieldValue("sport") != "undefined" && getFieldValue("sport") != null) && (typeof getFieldValue("dport") != "undefined" && getFieldValue("dport") != null) && (typeof getFieldValue("proto") != "undefined" && getFieldValue("proto") != null)) && 
                        !((typeof getFieldValue("proto") != "undefined" && getFieldValue("proto") != null) && (getFieldValue("sip") && !getFieldValue("dip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && typeof getFieldValue("dport") == "undefined"|| 
                                                    getFieldValue("dip") && !getFieldValue("sip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) || 
                                                    (typeof getFieldValue("sport") != "undefined" && getFieldValue("sport") != null) && !getFieldValue("sip") && !getFieldValue("dip") && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) || 
                                                    (typeof getFieldValue("dport") != "undefined" && getFieldValue("dport") != null) && !getFieldValue("sip") && !getFieldValue("dip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) || 
                                                    (getFieldValue("sip") && (typeof getFieldValue("sport") != "undefined" && getFieldValue("sport") != null) && !getFieldValue("dip") && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null)) || 
                                                    (getFieldValue("dip") && (typeof getFieldValue("dport") != "undefined" && getFieldValue("dport") != null) && !getFieldValue("sip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null)) )
                        ) &&
                        !(getFieldValue("sip") && (typeof getFieldValue("dport") != "undefined" && getFieldValue("dport") != null) && !getFieldValue("dip") && (typeof getFieldValue("sport") == "undefined" || getFieldValue("sport") == null) && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null)) && 
                        !(getFieldValue("dip") && (typeof getFieldValue("sport") != "undefined" && getFieldValue("sport") != null) && !getFieldValue("sip") && (typeof getFieldValue("dport") == "undefined" || getFieldValue("dport") == null) && (typeof getFieldValue("proto") == "undefined" || getFieldValue("proto") == null))){
                        message.info(formatMessage({id: "app.policy.msg.combination"}))
                        return
                    }

                Object.keys(fieldsValue).forEach(key=>{
                    typeof fieldsValue[key] != "undefined" && fieldsValue[key] != null && 
                    ((typeof fieldsValue[key] == "string" && fieldsValue[key] != "") || (typeof fieldsValue[key] != "string")) && Object.assign(objdata, {[key]:fieldsValue[key]})
                })

                if (!objdata.action){
                    objdata.action = 0
                }

                subrules(objdata)
                handleOk()
                message.info(formatMessage({id:"app.policy.add.rule.successfully"}))
                this.setState({
                    objdata:{}
                })
            })
        }

        return (
            <div>
            <Modal
                maskClosable={false}
                destroyOnClose
                width={700}
                title={formatMessage({id:"app.policy.add.filter"})}
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel} style={{ width:'63.84px', textAlign: "center", padding: "0 8px"}}> {formatMessage({id:"app.policy.button.cancel"})} </Button>,
                    <Button key="add" type="primary" onClick={subformhandleAdd} style={{ width:'63.84px', textAlign: "center", padding: "0 8px"}}> {formatMessage({id:"app.policy.button.add"})} </Button>,
                    <Button key="ok" type="primary" onClick={subformhandleSubmit} style={{ width:'63.84px', textAlign: "center", padding: "0 8px"}}> {formatMessage({id:"app.policy.button.on"})} </Button>,         
                ]}
            >
                <Form 
                    labelCol={{span:5}} 
                    wrapperCol={{span:15}}
                >
                    <Form.Item 
                        label={formatMessage({id:"app.policy.filter.type"})}
                        wrapperCol={{span:10}}
                        >
                        {getFieldDecorator("rule_type",{
                            initialValue: "tuple",
                        })
                        (
                            <Select placeholder={formatMessage({id:"app.policy.select.rule_type"})}
                                onChange={this.handleSelect}
                            >
                                <Select.Option key="1" value={"tuple"}>Tuple</Select.Option>
                                <Select.Option key="2" value={"tuplev6"}>Tuplev6</Select.Option>
                                <Select.Option key="3" value={"ipset"}>Ipset</Select.Option>
                                <Select.Option key="4" value={"ipsetv6"}>Ipsetv6</Select.Option>
                                <Select.Option key="5" value={"keyword"}>Keyword</Select.Option>
                                <Select.Option key="6" value={"eth_type"}>Eth_type</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({id:"app.policy.action"})}
                        >
                        {getFieldDecorator("action",{
                            initialValue:true,
                        })(
                            <Switch 
                                checkedChildren={formatMessage({id:"app.policy.permit"})}
                                unCheckedChildren={formatMessage({id:"app.policy.deny"})}
                                checked={getFieldValue("action")}>
                            </Switch>               
                        )}
                    </Form.Item>
                    {istuple ?  <Tuple form={form} />: null}
                    {istuplev6 ? <Tuplev6 form={form} />: null}
                    {isipset ?  <Ipset form={form} />: null}
                    {isipsetv6 ? <Ipsetv6 form={form} /> : null}
                    {ishard_keyword ?  <HardKeyword form={form} /> : null}
                    {iseth_type ?  <EthType form={form} />: null}
                </Form>
            </Modal>
            </div>
        );
    }
}







