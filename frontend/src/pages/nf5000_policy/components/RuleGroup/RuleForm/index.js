import React, { Component } from 'react'
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout'
import {Button, Card, Col, Row, Modal, Form, Input, List, Select, Switch, InputNumber, message} from 'antd'
import { connect } from 'dva'
import { Dispatch } from 'redux'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import styles from '@/pages/nf5000_policy/nf5000_policy.less'
import TextArea from 'antd/lib/input/TextArea'
import { RegexPattern } from '../rule_validate.js'
import { extend } from 'umi-request';
import Tuple from './Tuple'
import Tuplev6 from './Tuplev6'

@connect()
export default class RuleForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false, istuple:true, istuplev6:false,
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
        if (v == "tuple4"){
            this.setState({
                istuple:true, istuplev6:false
            })
        }
        else if (v == "tuple6"){
            this.setState({
                istuplev6:true, istuple:false
            })
        }
    }

    render() {
        const {Mode, form, ModalVisible, handleOk, handleCancel, handleAdd1, value, subrules, handleSeekOk} = this.props;
        const { visible, istuple, istuplev6, objdata} = this.state;
        const {getFieldDecorator, validateFields, getFieldValue, getFieldsValue} = form;

        const subformhandleAdd = () => {
            validateFields((err, fieldsValue) => {
                if(err) {
                    return;
                }
                
                //tuple、tuple6规则为一组
                if( (getFieldValue("rule_type") == "tuple4" || getFieldValue("rule_type") == "tuple6") && !getFieldValue("sip") && 
                    !getFieldValue("sport_min") && getFieldValue("sport_min") !== 0 && !getFieldValue("dip") && !getFieldValue("dport_min") && getFieldValue("dport_min") !== 0 &&
                    !getFieldValue("proto_min") && getFieldValue("proto_min") !== 0 && !getFieldValue("proto_max") && getFieldValue("proto_max") !== 0 &&
                    !getFieldValue("sport_max") && getFieldValue("sport_max") !== 0 && !getFieldValue("dport_max") && getFieldValue("sport_max") !== 0 ){
                        message.info(formatMessage({id:"app.policy.least.rule"}))
                        return
                    }

                if ( (getFieldValue("sport_min") || getFieldValue("port_min") === 0) && (getFieldValue("sport_max") || getFieldValue("sport_max") === 0)){
                    if (getFieldValue("sport_min") > getFieldValue("sport_max")){
                        message.info(formatMessage({id: "app.policy.sportlimit"}))
                        return
                    }
                }
                
                if ( (getFieldValue("dport_min") || getFieldValue("dort_min") === 0) && (getFieldValue("dport_max") || getFieldValue("dport_max") === 0)){
                    if (getFieldValue("dport_min") > getFieldValue("dport_max")){
                        message.info(formatMessage({id: "app.policy.dportlimit"}))
                        return
                    }
                }
                
                if ( (getFieldValue("proto_min") || getFieldValue("proto_min") === 0) && (getFieldValue("proto_max") || getFieldValue("proto_max") === 0)){
                    if (getFieldValue("proto_min") > getFieldValue("proto_max")){
                        message.info(formatMessage({id: "app.policy.protolimit"}))
                        return
                    }
                }

                //将表单中没有填的数据赋予默认值传给后端
                if ( fieldsValue["rule_type"] == "tuple4" || fieldsValue["rule_type"] == "tuple6" || fieldsValue["rule_type"] == "combined" ){
                    fieldsValue["sip"] = (fieldsValue["sip"] == "" ? 0 : fieldsValue["sip"])
                    fieldsValue["dip"] = (fieldsValue["dip"] == "" ? 0 : fieldsValue["dip"])
                    fieldsValue["sport_min"] = ((fieldsValue["sport_min"] === "" || fieldsValue["sport_min"] == null ) ? 0 : fieldsValue["sport_min"])
                    fieldsValue["sport_max"] = ((fieldsValue["sport_max"] === "" || fieldsValue["sport_max"] == null ) ? 65535 : fieldsValue["sport_max"])
                    fieldsValue["dport_min"] = ((fieldsValue["dport_min"] === "" || fieldsValue["dport_min"] == null ) ? 0 : fieldsValue["dport_min"])
                    fieldsValue["dport_max"] = ((fieldsValue["dport_max"] === "" || fieldsValue["dport_max"] == null ) ? 65535 : fieldsValue["dport_max"])
                    fieldsValue["proto_min"] = ((fieldsValue["proto_min"] === "" || fieldsValue["proto_min"] == null ) ? 0 : fieldsValue["proto_min"])
                    fieldsValue["proto_max"] = ((fieldsValue["proto_max"] === "" || fieldsValue["proto_max"] == null ) ? 255 : fieldsValue["proto_max"])
                }

                Object.keys(fieldsValue).forEach(key=>{
                    fieldsValue[key] !== null && fieldsValue[key] !== undefined && fieldsValue[key] !== "" && Object.assign(objdata, {[key]:fieldsValue[key]})
                })

                if (!objdata.action){
                    objdata.action = 0
                }

                subrules(objdata)

                message.info(formatMessage({id:"app.policy.add.rule.successfully"}))
                form.resetFields()
                this.setState({
                    istuple:true, istuplev6:false,
                    objdata: {},
                })
            });
        }

        const subformhandleSubmit = () =>{
            validateFields((err, fieldsValue) => {
                if(err){
                    return
                }

                //tuple、tuple6规则为一组
                if( (getFieldValue("rule_type") == "tuple4" || getFieldValue("rule_type") == "tuple6") && !getFieldValue("sip") && 
                    !getFieldValue("sport_min") && getFieldValue("sport_min") !== 0 && !getFieldValue("dip") && !getFieldValue("dport_min") && getFieldValue("dport_min") !== 0 &&
                    !getFieldValue("proto_min") && getFieldValue("proto_min") !== 0 && !getFieldValue("proto_max") && getFieldValue("proto_max") !== 0 &&
                    !getFieldValue("sport_max") && getFieldValue("sport_max") !== 0 && !getFieldValue("dport_max") && getFieldValue("sport_max") !== 0 ){
                        message.info(formatMessage({id:"app.policy.least.rule"}))
                        return
                    }

                if ( (getFieldValue("sport_min") || getFieldValue("port_min") === 0) && (getFieldValue("sport_max") || getFieldValue("sport_max") === 0)){
                    if (getFieldValue("sport_min") > getFieldValue("sport_max")){
                        message.info(formatMessage({id: "app.policy.sportlimit"}))
                        return
                    }
                }
                
                if ( (getFieldValue("dport_min") || getFieldValue("dort_min") === 0) && (getFieldValue("dport_max") || getFieldValue("dport_max") === 0)){
                    if (getFieldValue("dport_min") > getFieldValue("dport_max")){
                        message.info(formatMessage({id: "app.policy.dportlimit"}))
                        return
                    }
                }
                
                if ( (getFieldValue("proto_min") || getFieldValue("proto_min") === 0) && (getFieldValue("proto_max") || getFieldValue("proto_max") === 0)){
                    if (getFieldValue("proto_min") > getFieldValue("proto_max")){
                        message.info(formatMessage({id: "app.policy.protolimit"}))
                        return
                    }
                }

                //将表单中没有填的数据赋予默认值传给后端
                if ( fieldsValue["rule_type"] == "tuple4" || fieldsValue["rule_type"] == "tuple6" || fieldsValue["rule_type"] == "combined" ){
                    fieldsValue["sip"] = (fieldsValue["sip"] == "" ? 0 : fieldsValue["sip"])
                    fieldsValue["dip"] = (fieldsValue["dip"] == "" ? 0 : fieldsValue["dip"])
                    fieldsValue["sport_min"] = ((fieldsValue["sport_min"] === "" || fieldsValue["sport_min"] == null ) ? 0 : fieldsValue["sport_min"])
                    fieldsValue["sport_max"] = ((fieldsValue["sport_max"] === "" || fieldsValue["sport_max"] == null ) ? 65535 : fieldsValue["sport_max"])
                    fieldsValue["dport_min"] = ((fieldsValue["dport_min"] === "" || fieldsValue["dport_min"] == null ) ? 0 : fieldsValue["dport_min"])
                    fieldsValue["dport_max"] = ((fieldsValue["dport_max"] === "" || fieldsValue["dport_max"] == null ) ? 65535 : fieldsValue["dport_max"])
                    fieldsValue["proto_min"] = ((fieldsValue["proto_min"] === "" || fieldsValue["proto_min"] == null ) ? 0 : fieldsValue["proto_min"])
                    fieldsValue["proto_max"] = ((fieldsValue["proto_max"] === "" || fieldsValue["proto_max"] == null ) ? 255 : fieldsValue["proto_max"])
                }
                
                Object.keys(fieldsValue).forEach(key=>{
                    fieldsValue[key] !== null && fieldsValue[key] !== undefined && fieldsValue[key] !== "" && Object.assign(objdata, {[key]:fieldsValue[key]})
                })

                if (!objdata.action){
                    objdata.action = 0
                }

                subrules(objdata)
                handleOk()
                message.info(formatMessage({id:"app.policy.add.rule.successfully"}))
                this.setState({
                    objdata:{},
                })
            })
        }

        return (
            <div>
            <Modal
                maskClosable={true}
                destroyOnClose
                width={700}
                title={formatMessage({id:"app.policy.add.filter"})}
                visible={visible}
                onCancel={handleCancel}
                footer={Mode == "create" ? [
                    <Button key="cancel" onClick={handleCancel} style={{ width:'63.84px', textAlign: "center", padding: "0 8px"}}> {formatMessage({id:"app.policy.button.cancel"})} </Button>,
                    <Button key="add" type="primary" onClick={subformhandleAdd} style={{ width:'63.84px', textAlign: "center", padding: "0 8px"}}> {formatMessage({id:"app.policy.button.add"})} </Button>,
                    <Button key="ok" type="primary" onClick={subformhandleSubmit} style={{ width:'63.84px', textAlign: "center", padding: "0 8px"}}> {formatMessage({id:"app.policy.button.on"})} </Button>,               
                ] : [
                    <Button onClick={handleSeekOk}> {formatMessage({id:"app.policy.button.on"})} </Button> 
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
                    initialValue: "tuple4",
                })
                (
                    <Select placeholder={formatMessage({id:"app.policy.select.rule_type"})}
                        onChange={this.handleSelect}
                    >
                        <Select.Option key="1" value={"tuple4"}>Tuple</Select.Option>
                        <Select.Option key="2" value={"tuple6"}>Tuplev6</Select.Option>
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
                    {istuple ? <Tuple form={form} />: null}
                    {istuplev6 ? <Tuplev6 form={form} />: null}
                </Form>
            </Modal>
            </div>
        );
    }
}