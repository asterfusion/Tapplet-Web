import React, { Component } from 'react'
import { Form, Input, InputNumber } from 'antd'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { RegexPattern } from '../rule_validate'

export default class Tuplev6 extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const { Mode, form, scanrules } = this.props
        const { getFieldDecorator } = form
        return (
            <div>
            <Form.Item label={formatMessage({id:"app.policy.sip"})} wrapperCol={{span:15}}>
                <Form.Item style={{display:'inline-block', marginBottom:"0"}}>
                        {getFieldDecorator("start_sip",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.start_sip : undefined,
                            rules: [{pattern:RegexPattern.ipv6, message: formatMessage({id:"app.err.ipv6"}) }],
                        })(<Input disabled={Mode == "scan"} placeholder = {Mode !== "scan" ? "(e.g. X:X:X:X:X:X:X:X)" : ""} />)}     
                </Form.Item>
                <span style={{display:'inline-block',textAlign:'center', marginLeft:10}}> - </span>
                <Form.Item style={{display:'inline-block',marginLeft:10, marginBottom:"0"}}>
                        {getFieldDecorator("end_sip",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.end_sip : undefined,
                            rules: [{pattern:RegexPattern.ipv6, message: formatMessage({id:"app.err.ipv6"}) }],
                        })(<Input disabled={Mode == "scan"} placeholder = {Mode !== "scan" ? "(e.g. X:X:X:X:X:X:X:X)" : ""} />)}     
                </Form.Item>
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.sport"})} wrapper={{span:12}}>
                <Form.Item style={{display:"inline-block", marginBottom:"0"}}>
                        {getFieldDecorator("start_sport",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.start_sport : undefined,
                            rules:[{pattern:RegexPattern.port, message: formatMessage({id:"app.err.port"}) }],
                        })(<InputNumber disabled={Mode == "scan"} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)" : ""}/>)}
                </Form.Item>
                <span style={{display:'inline-block',textAlign:'center', marginLeft:10}}> - </span>
                <Form.Item style={{display:"inline-block", marginLeft:10, marginBottom:"0"}}>
                        {getFieldDecorator("end_sport",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.end_sport : undefined,
                            rules:[{pattern:RegexPattern.port, message: formatMessage({id:"app.err.port"}) }],
                        })(<InputNumber disabled={Mode == "scan"} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)" : ""}/>)}
                </Form.Item>
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.dip"})} wrapperCol={{span:15}}>
                <Form.Item style={{display:'inline-block', marginBottom:"0"}}>
                        {getFieldDecorator("start_dip",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.start_dip : undefined,
                            rules: [{pattern:RegexPattern.ipv6, message: formatMessage({id:"app.err.ipv6"}) }],
                        })(<Input disabled={Mode == "scan"} placeholder = {Mode !== "scan" ? "(e.g. X:X:X:X:X:X:X:X)" : ""} />)}     
                </Form.Item>
                <span style={{display:'inline-block',textAlign:'center', marginLeft:10}}> - </span>
                <Form.Item style={{display:'inline-block',marginLeft:10, marginBottom:"0"}}>
                        {getFieldDecorator("end_dip",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.end_dip : undefined,
                            rules: [{pattern:RegexPattern.ipv6, message: formatMessage({id:"app.err.ipv6"}) }],
                        })(<Input disabled={Mode == "scan"} placeholder = {Mode !== "scan" ? "(e.g. X:X:X:X:X:X:X:X)" : ""} />)}     
                </Form.Item>
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.dport"})} wrapper={{span:12}}>
                <Form.Item style={{display:"inline-block", marginBottom:"0"}}>
                        {getFieldDecorator("start_dport",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.start_dport : undefined,
                            rules:[{pattern:RegexPattern.port, message:  formatMessage({id:"app.err.port"}) }],
                        })(<InputNumber disabled={Mode == "scan"} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)" : ""}/>)}
                </Form.Item>
                <span style={{display:'inline-block',textAlign:'center', marginLeft:10}}> - </span>
                <Form.Item style={{display:"inline-block", marginLeft:10, marginBottom:"0"}}>
                        {getFieldDecorator("end_dport",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.end_dport : undefined,
                            rules:[{pattern:RegexPattern.port, message:  formatMessage({id:"app.err.port"}) }],
                        })(<InputNumber disabled={Mode == "scan"} min={0} max={65535} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-65535, e.g. 80)" : ""}/>)}
                </Form.Item>
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.protocol"})} wrapper={{span:5}}>
                <Form.Item style={{display:"inline-block", marginBottom:"0"}}>
                        {getFieldDecorator("start_proto",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.start_proto : undefined,
                            rules:[{pattern:RegexPattern.pro, message: formatMessage({id:"app.err.pro"}) }],
                        })(<InputNumber disabled={Mode == "scan"} min={0} max={255} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-255, e.g. 21)" : ""}/>)}
                </Form.Item>
                <span style={{display:'inline-block',textAlign:'center', marginLeft:10}}> - </span>
                <Form.Item style={{display:"inline-block", marginLeft:10, marginBottom:"0"}}>
                        {getFieldDecorator("end_proto",{
                            initialValue: Mode == "scan" ? scanrules.rule_cfg.end_proto : undefined,
                            rules:[{pattern:RegexPattern.pro, message: formatMessage({id:"app.err.pro"}) }],
                        })(<InputNumber disabled={Mode == "scan"} min={0} max={255} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-255, e.g. 21)" : ""}/>)}
                </Form.Item>
            </Form.Item> 
            
            <Form.Item label={"VLAN"} wrapper={{span:5}}>
                    <Form.Item style={{display:"inline-block", marginBottom:"0"}}>
                            {getFieldDecorator("start_vid",{
                                initialValue: Mode == "scan" ? scanrules.rule_cfg.start_vid : undefined,
                                rules:[{pattern:RegexPattern.vlan, message: formatMessage({id:"app.err.vlan"}) }],
                            })(<InputNumber disabled={Mode == "scan"} min={0} max={4095} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-4095, e.g. 101)" : ""}/>)}
                    </Form.Item>
                    <span style={{display:'inline-block',textAlign:'center', marginLeft:10}}> - </span>
                    <Form.Item style={{display:"inline-block", marginLeft:10, marginBottom:"0"}}>
                            {getFieldDecorator("end_vid",{
                                initialValue: Mode == "scan" ? scanrules.rule_cfg.end_vid : undefined,
                                rules:[{pattern:RegexPattern.vlan, message: formatMessage({id:"app.err.vlan"}) }],
                            })(<InputNumber disabled={Mode == "scan"} min={0} max={4095} style={{width:142}} placeholder = {Mode !== "scan" ? "(0-4095, e.g. 101)" : ""}/>)}
                    </Form.Item>
                </Form.Item>
            
            </div>
        )
    }
}