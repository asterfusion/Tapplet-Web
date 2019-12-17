import React, { Component } from 'react'
import { Form, Input, InputNumber } from 'antd'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { RegexPattern } from '../rule_validate'

export default class HardKeyword extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const { Mode, form, scanrules } = this.props
        const { getFieldDecorator } = form
        return (
            <div>
                <Form.Item label={formatMessage({id:"app.policy.regex"})}>
                {getFieldDecorator("regex",{
                    initialValue: Mode == "scan" ? scanrules.rule_cfg.regex : undefined,
                    rules: [{required: true, message: formatMessage({id:"app.regex"})}],
                })(<Input disabled={Mode == "scan"} style={{width:300}} placeholder = {Mode !== "scan" ? "(string)" : ""}/>)}     
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.sposition"})}>
                {getFieldDecorator("keyword_from",{
                    initialValue: Mode == "scan" ? scanrules.rule_cfg.keyword_from : undefined,
                    rules:[{required: true, message: formatMessage({id:"app.regex.s"})}],
                })(<Input disabled={Mode == "scan"} style={{width:300}} placeholder = {Mode !== "scan" ? "(integer)" : ""}/>)}
            </Form.Item>

            <Form.Item label={formatMessage({id:"app.policy.dposition"})}>
                {getFieldDecorator("keyword_to",{
                    initialValue: Mode == "scan" ? scanrules.rule_cfg.keyword_to : undefined,
                    rules: [{required: true, message: formatMessage({id:"app.regex.d"})}],
                })(<Input disabled={Mode == "scan"} style={{width:300}} placeholder = {Mode !== "scan" ? "(integer)" : ""} />)}     
            </Form.Item> </div>
        )
    }
}