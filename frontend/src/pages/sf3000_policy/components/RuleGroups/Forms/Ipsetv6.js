import React, { Component } from 'react'
import { Form, Input, InputNumber } from 'antd'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { RegexPattern } from '../rule_validate'

export default class Ipsetv6 extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const { Mode, form, scanrules } = this.props
        const { getFieldDecorator } = form
        return(
            <div>
                <Form.Item label={formatMessage({id:"app.policy.sip"})}>
                {getFieldDecorator("sip",{
                    initialValue: Mode == "scan" ? scanrules.rule_cfg.sip : undefined,
                    rules: [{pattern:RegexPattern.ipv6, message: formatMessage({id:'app.err.ipv6'})}],
                })(<Input disabled={Mode == "scan"} style={{width:170}} placeholder = {Mode !== "scan" ? "(e.g. X:X:X:X:X:X:X:X)" : ""} />)}     
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.sport"})}>
                {getFieldDecorator("sport",{
                    initialValue: Mode == "scan" ? scanrules.rule_cfg.sport : undefined,
                    rules:[{pattern:RegexPattern.port, message: formatMessage({id:'app.err.port'})}],
                })(<InputNumber disabled={Mode == "scan"} style={{width:137}} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)" : ""}/>)}
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.dip"})}>
                {getFieldDecorator("dip",{
                    initialValue: Mode == "scan" ? scanrules.rule_cfg.dip : undefined,
                    rules: [{pattern:RegexPattern.ipv6, message: formatMessage({id:'app.err.ipv6'})}],
                })(<Input disabled={Mode == "scan"} style={{width:170}} placeholder = {Mode !== "scan" ? "(e.g. X:X:X:X:X:X:X:X)" : ""}/>)}     
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.dport"})} wrapper={{span:12}}>
                {getFieldDecorator("dport",{
                    initialValue: Mode == "scan" ? scanrules.rule_cfg.dport : undefined,
                    rules:[{pattern:RegexPattern.port, message: formatMessage({id:'app.err.port'})}],
                })(<InputNumber disabled={Mode == "scan"} style={{width:137}} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)" : ""}/>)}
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.protocol"})} wrapper={{span:5}}>
                {getFieldDecorator("proto",{
                    initialValue: Mode == "scan" ? scanrules.rule_cfg.proto : undefined,
                    rules:[{pattern:RegexPattern.pro, message: formatMessage({id:'app.err.pro'})}],
                })(<InputNumber disabled={Mode == "scan"} min={0} max={255} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-255, e.g. 21)" : ""}/>)}
            </Form.Item> </div>
        )
    }
}