import React, { Component } from 'react'
import { Form, Input, InputNumber } from 'antd'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { RegexPattern } from '../rule_validate'

export default class Tuple extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const { Mode, form, scanrules } = this.props
        const { getFieldDecorator } = form
        return (
            <div>
                <Form.Item label={formatMessage({id:"app.policy.sip"})} wrapperCol={{span:12}}>
                    {getFieldDecorator("sip",{
                        initialValue: Mode == "scan" ? (scanrules.rule_cfg.rule_cfg1 ? scanrules.rule_cfg.rule_cfg1.sip : scanrules.rule_cfg.sip) : "",
                        rules: [{pattern:RegexPattern.ipv4_tuple, message: formatMessage({id:'app.err.ipv4'}) }],
                    })(<Input disabled={Mode == "scan"} placeholder = {Mode !== "scan" ? "e.g. 192.168.1.1/24" : ""} />)}     
                </Form.Item>

                <Form.Item label={formatMessage({id:"app.policy.sport"})} wrapper={{span:12}}>
                    <Form.Item style={{display:"inline-block", marginBottom:"0"}}>
                            {getFieldDecorator("sport_min",{
                                initialValue: Mode == "scan" ? (scanrules.rule_cfg.rule_cfg1 ? scanrules.rule_cfg.rule_cfg1.sport_min : scanrules.rule_cfg.sport_min) : "",
                                rules:[{pattern:RegexPattern.port, message: formatMessage({id:"app.err.port"}) }],
                            })(<InputNumber disabled={Mode == "scan"} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)" : ""}/>)}
                    </Form.Item>
                    <span style={{display:'inline-block',textAlign:'center', marginLeft:10}}> - </span>
                    <Form.Item style={{display:"inline-block", marginLeft:10, marginBottom:"0"}}>
                            {getFieldDecorator("sport_max",{
                                initialValue: Mode == "scan" ? (scanrules.rule_cfg.rule_cfg1 ? scanrules.rule_cfg.rule_cfg1.sport_max : scanrules.rule_cfg.sport_max) : "",
                                rules:[{pattern:RegexPattern.port, message: formatMessage({id:"app.err.port"}) }],
                            })(<InputNumber disabled={Mode == "scan"} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)" : ""}/>)}
                    </Form.Item>
                </Form.Item>

                <Form.Item label={formatMessage({id:"app.policy.dip"})} wrapperCol={{span:12}}>
                    {getFieldDecorator("dip",{
                        initialValue: Mode == "scan" ? (scanrules.rule_cfg.rule_cfg1 ? scanrules.rule_cfg.rule_cfg1.dip : scanrules.rule_cfg.dip) : "",
                        rules: [{pattern:RegexPattern.ipv4_tuple, message: formatMessage({id:'app.err.ipv4'}) }],
                    })(<Input disabled={Mode == "scan"} placeholder = {Mode !== "scan" ? "e.g. 192.168.2.1/24":""} />)}     
                </Form.Item>

                <Form.Item label={formatMessage({id:"app.policy.dport"})} wrapper={{span:12}}>
                    <Form.Item style={{display:"inline-block", marginBottom:"0"}}>
                            {getFieldDecorator("dport_min",{
                                initialValue: Mode == "scan" ? (scanrules.rule_cfg.rule_cfg1 ? scanrules.rule_cfg.rule_cfg1.dport_min : scanrules.rule_cfg.dport_min) : "",
                                rules:[{pattern:RegexPattern.port, message: formatMessage({id:"app.err.port"}) }],
                            })(<InputNumber disabled={Mode == "scan"} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)":""}/>)}
                    </Form.Item>
                    <span style={{display:'inline-block',textAlign:'center', marginLeft:10}}> - </span>
                    <Form.Item style={{display:"inline-block", marginLeft:10, marginBottom:"0"}}>
                            {getFieldDecorator("dport_max",{
                                initialValue: Mode == "scan" ? (scanrules.rule_cfg.rule_cfg1 ? scanrules.rule_cfg.rule_cfg1.dport_max : scanrules.rule_cfg.dport_max) : "",
                                rules:[{pattern:RegexPattern.port, message: formatMessage({id:"app.err.port"}) }],
                            })(<InputNumber disabled={Mode == "scan"} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)" : ""}/>)}
                    </Form.Item>
                </Form.Item>

                <Form.Item label={formatMessage({id:"app.policy.protocol"})} wrapper={{span:5}}>
                    <Form.Item style={{display:"inline-block", marginBottom:"0"}}>
                            {getFieldDecorator("proto_min",{
                                initialValue: Mode == "scan" ? (scanrules.rule_cfg.rule_cfg1 ? scanrules.rule_cfg.rule_cfg1.proto_min : scanrules.rule_cfg.proto_min) : "",
                                rules:[{pattern:RegexPattern.pro, message: formatMessage({id:"app.err.pro"}) }],
                            })(<InputNumber disabled={Mode == "scan"} min={0} max={255} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-255, e.g. 21)" : ""}/>)}
                    </Form.Item>
                    <span style={{display:'inline-block',textAlign:'center', marginLeft:10}}> - </span>
                    <Form.Item style={{display:"inline-block", marginLeft:10, marginBottom:"0"}}>
                            {getFieldDecorator("proto_max",{
                                initialValue: Mode == "scan" ? (scanrules.rule_cfg.rule_cfg1 ? scanrules.rule_cfg.rule_cfg1.proto_max : scanrules.rule_cfg.proto_max) : "",
                                rules:[{pattern:RegexPattern.pro, message: formatMessage({id:"app.err.pro"}) }],
                            })(<InputNumber disabled={Mode == "scan"} min={0} max={255} style={{width:142}} placeholder = {Mode !== "scan" ?  "(0-255, e.g. 21)" : ""}/>)}
                    </Form.Item>
                </Form.Item>

            </div>
        )
    }
}