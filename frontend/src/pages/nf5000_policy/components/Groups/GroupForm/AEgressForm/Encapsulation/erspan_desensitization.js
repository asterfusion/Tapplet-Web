import React, { Component } from 'react'
import { Form, Input, Switch, InputNumber, Select } from 'antd'
import { formatMessage } from 'umi/locale'
import { RegexPattern } from '../../../validatePattern'

const { pat_mac, pat_ip } = RegexPattern

export default class ErspanEncapsulation extends Component {
    constructor(props){
        super(props)
    }

    handleSwitchChange = (e) => {
        const { onErspanChange, form, value } = this.props
        const { getFieldValue } = form
        onErspanChange({
            switch: e ? 1 : 0,
            erspan_dmac: getFieldValue("erspan_dmac") || value.erspan_dmac,
            erspan_dip: getFieldValue("erspan_dip") || value.erspan_dip,
            erspan_session_id: getFieldValue("erspan_session_id") || value.erspan_session_id,
            erspan_type: getFieldValue("erspan_type") || value.erspan_type,
            erspan_dscp: getFieldValue("erspan_dscp") || value.erspan_dscp
        })
    }
    handleDMacChange = (e) => {
        const { onErspanChange, form } = this.props
        const { getFieldValue } = form
        onErspanChange({
            switch: getFieldValue("erspan_switch") ? 1 : 0,
            erspan_dmac: e.target.value,
            erspan_dip: getFieldValue("erspan_dip"),
            erspan_session_id: getFieldValue("erspan_session_id"),
            erspan_type: getFieldValue("erspan_type"),
            erspan_dscp: getFieldValue("erspan_dscp")
        })
    }
    handleDIpChange = (e) => {
        const { onErspanChange, form } = this.props
        const { getFieldValue } = form
        onErspanChange({
            switch: getFieldValue("erspan_switch") ? 1 : 0,
            erspan_dmac: getFieldValue("erspan_dmac"),
            erspan_dip: e.target.value,
            erspan_session_id: getFieldValue("erspan_session_id"),
            erspan_type: getFieldValue("erspan_type"),
            erspan_dscp: getFieldValue("erspan_dscp")
        })
    }
    handleSessionIdChange = (e) => {
        const { onErspanChange, form } = this.props
        const { getFieldValue } = form
        onErspanChange({
            switch: getFieldValue("erspan_switch") ? 1 : 0,
            erspan_dmac: getFieldValue("erspan_dmac"),
            erspan_dip: getFieldValue("erspan_dip"),
            erspan_session_id: e,
            erspan_type: getFieldValue("erspan_type"),
            erspan_dscp: getFieldValue("erspan_dscp")
        })
    }
    handleTypeChange = (e) => {
        const { onErspanChange, form } = this.props
        const { getFieldValue } = form
        onErspanChange({
            switch: getFieldValue("erspan_switch") ? 1 : 0,
            erspan_dmac: getFieldValue("erspan_dmac"),
            erspan_dip: getFieldValue("erspan_dip"),
            erspan_session_id: getFieldValue("erspan_session_id"),
            erspan_type: e,
            erspan_dscp: getFieldValue("erspan_dscp")
        })
    }
    handleDscpChange = (e) => {
        const { onErspanChange, form } = this.props
        const { getFieldValue } = form
        onErspanChange({
            switch: getFieldValue("erspan_switch") ? 1 : 0,
            erspan_dmac: getFieldValue("erspan_dmac"),
            erspan_dip: getFieldValue("erspan_dip"),
            erspan_session_id: getFieldValue("erspan_session_id"),
            erspan_type: getFieldValue("erspan_type"),
            erspan_dscp: e
        })
    }

    render(){
        const { Mode, canWrite, form, value } = this.props
        const { getFieldDecorator, getFieldValue } = form
        let isErspan = value.switch == 1 ? true : false
        return (
            <>
                <Form.Item
                    label={formatMessage({id:'app.policy.erspan_encapsulation.switch'})}
                    labelCol={{span: 6}} 
                    wrapperCol={{span: 15}}
                >
                    {
                        getFieldDecorator("erspan_switch",{
                            initialValue: isErspan
                        })(<Switch
                            id="erspanEncSwicth" 
                            checkedChildren={formatMessage({id:'app.policy.on'})} 
                            unCheckedChildren={formatMessage({id:'app.policy.off'})} 
                            checked={isErspan} 
                            disabled={!canWrite}
                            onChange={this.handleSwitchChange}
                        ></Switch>)
                    }
                </Form.Item>
                {
                    isErspan ? <><Form.Item
                        label={formatMessage({id:'app.policy.erspan_encapsulation.dmac'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("erspan_dmac",{
                                initialValue: value.erspan_dmac,
                                rules:[{
                                    required: true,
                                    validator: (rule, value, callback) => {
                                        try{
                                            if(value != undefined && value != ""){
                                                if(!pat_mac.test(value)){
                                                    throw new Error(formatMessage({id:"app.policy.msg.addform.encapsulation.format.mac"}))
                                                }
                                            }else{
                                                throw new Error(formatMessage({id:"app.policy.msg.addform.encapsulation.mac"}))
                                            }
                                        }catch(err){
                                            callback(err)
                                        }finally{
                                            callback()
                                        }      
                                    }
                                }]
                            })(<Input id="erspanDmac" placeholder="(e.g. 00:16:EA:AE:3C:40)" style={{width: "200px"}} disabled={!canWrite} onChange={this.handleDMacChange}/>)
                        }
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({id:'app.policy.erspan_encapsulation.dip'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("erspan_dip",{
                                initialValue: value.erspan_dip,
                                rules:[{
                                    required: true,
                                    validator: (rule, value, callback) => {
                                        try{
                                            if(value != undefined && value != ""){
                                                if(!pat_ip.test(value)){
                                                    throw new Error(formatMessage({id:"app.policy.msg.addform.encapsulation.format.ip"}))
                                                }
                                            }else{
                                                throw new Error(formatMessage({id:"app.policy.msg.addform.encapsulation.ip"}))
                                            }
                                        }catch(err){
                                            callback(err)
                                        }finally{
                                            callback()
                                        }
                                    }
                                }]
                            })(<Input id="erspanDip" placeholder="(e.g. 192.168.1.1)" style={{width: "200px"}} disabled={!canWrite} onChange={this.handleDIpChange}/>)
                        }
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({id:'app.policy.erspan_encapsulation.sessionid'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("erspan_session_id",{
                                initialValue: value.erspan_session_id,
                                rules:[{required:true, message: formatMessage({id:"app.policy.msg.addform.encapsulation.sessionid"})}]
                            })(<InputNumber 
                                id="erspanSessionId" 
                                placeholder="(0-1023, e.g. 20)" 
                                style={{width: "200px"}} 
                                max={1023}
                                min={0}
                                disabled={!canWrite} 
                                onChange={this.handleSessionIdChange}/>)
                        }
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({id:'app.policy.erspan_encapsulation.type'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("erspan_type",{
                                initialValue: value.erspan_type,
                                rules: [{required:true, message: formatMessage({id:"app.policy.msg.addform.encapsulation.type"})}]
                            })(<Select
                                onChange={this.handleTypeChange}
                                disabled={!canWrite}
                                style={{width: "200px"}} 
                            >
                                <Select.Option key="1" value="ERSPAN_I">ERSPAN_Ⅰ</Select.Option>
                                <Select.Option key="2" value="ERSPAN_II">ERSPAN_Ⅱ</Select.Option>
                                <Select.Option key="3" value="ERSPAN_III">ERSPAN_Ⅲ</Select.Option>
                            </Select>)
                        }
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({id:'app.policy.erspan_encapsulation.dscp'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("erspan_dscp",{
                                initialValue: value.erspan_dscp,
                                rules: [{required:true, message: formatMessage({id:"app.policy.msg.addform.encapsulation.dscp"})}]
                            })(<InputNumber 
                                id="erspanDscp" 
                                placeholder="(0-63, e.g. 20)" 
                                style={{width: "200px"}} 
                                max={63}
                                min={0}
                                disabled={!canWrite} 
                                onChange={this.handleDscpChange}/>)
                        }
                    </Form.Item></>: null
                }
            </>
        )
    }
}