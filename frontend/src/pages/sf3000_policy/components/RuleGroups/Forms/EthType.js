import React, { Component } from 'react'
import { Form, Input, InputNumber } from 'antd'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { RegexPattern } from '../rule_validate'

export default class EthType extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const { Mode, form, scanrules } = this.props
        const { getFieldDecorator } = form
        return (
            <div>
                <Form.Item label={formatMessage({id:"app.policy.eth_type"})}>
                {getFieldDecorator("eth_type_proto",{
                    initialValue: Mode == "scan" ? scanrules.rule_cfg.eth_type_proto : undefined,
                    rules: [{required: true, message: formatMessage({id:"app.ethtype"})}, {pattern: RegexPattern.eth_pro, message:formatMessage({id:"app.err.eth_pro"})}],
                })(<Input disabled={Mode == "scan"} style={{width:300}} placeholder = {Mode !== "scan" ? "(e.g 0x2d)" : ""} />)}     
            </Form.Item> </div>
        )
    }
}