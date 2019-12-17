import React, { Component } from 'react'
import { Form, Input, Switch, InputNumber, Select } from 'antd'
import { formatMessage } from 'umi/locale'
import { RegexPattern } from '../../../validatePattern'

const { pat_mac, pat_ip } = RegexPattern

export default class VxlanEncapsulation extends Component {
    constructor(props){
        super(props)
    }

    handleSwitchChange = (e) => {
        const { onVxlanChange, form, value } = this.props
        const { getFieldValue } = form
        onVxlanChange({
            switch: e ? 1 : 0,
            vxlan_dmac: getFieldValue("vxlan_dmac") || value.vxlan_dmac,
            vxlan_dip: getFieldValue("vxlan_dip") || value.vxlan_dip,
            vxlan_dport: getFieldValue("vxlan_dport") || value.vxlan_dport,
            vxlan_vni: getFieldValue("vxlan_vni") || value.vxlan_vni,
            vxlan_dscp: getFieldValue("vxlan_dscp") || value.vxlan_dscp
        })
    }
    handleDMacChange = (e) => {
        const { onVxlanChange, form } = this.props
        const { getFieldValue } = form
        onVxlanChange({
            switch: getFieldValue("vxlan_switch"),
            vxlan_dmac: e.target.value,
            vxlan_dip: getFieldValue("vxlan_dip"),
            vxlan_dport: getFieldValue("vxlan_dport"),
            vxlan_vni: getFieldValue("vxlan_vni"),
            vxlan_dscp: getFieldValue("vxlan_dscp")
        })
    }
    handleDIpChange = (e) => {
        const { onVxlanChange, form } = this.props
        const { getFieldValue } = form
        onVxlanChange({
            switch: getFieldValue("vxlan_switch"),
            vxlan_dmac: getFieldValue("vxlan_dmac"),
            vxlan_dip: e.target.value,
            vxlan_dport: getFieldValue("vxlan_dport"),
            vxlan_vni: getFieldValue("vxlan_vni"),
            vxlan_dscp: getFieldValue("vxlan_dscp")
        })
    }
    handlePortChange = (e) => {
        const { onVxlanChange, form } = this.props
        const { getFieldValue } = form
        onVxlanChange({
            switch: getFieldValue("vxlan_switch"),
            vxlan_dmac: getFieldValue("vxlan_dmac"),
            vxlan_dip: getFieldValue("vxlan_dip"),
            vxlan_dport: e,
            vxlan_vni: getFieldValue("vxlan_vni"),
            vxlan_dscp: getFieldValue("vxlan_dscp")
        })
    }
    handleVniChange = (e) => {
        const { onVxlanChange, form } = this.props
        const { getFieldValue } = form
        onVxlanChange({
            switch: getFieldValue("vxlan_switch"),
            vxlan_dmac: getFieldValue("vxlan_dmac"),
            vxlan_dip: getFieldValue("vxlan_dip"),
            vxlan_dport: getFieldValue("vxlan_dport"),
            vxlan_vni: e,
            vxlan_dscp: getFieldValue("vxlan_dscp")
        })
    }
    handleDscpChange = (e) => {
        const { onVxlanChange, form } = this.props
        const { getFieldValue } = form
        onVxlanChange({
            switch: getFieldValue("vxlan_switch"),
            vxlan_dmac: getFieldValue("vxlan_dmac"),
            vxlan_dip: getFieldValue("vxlan_dip"),
            vxlan_dport: getFieldValue("vxlan_dport"),
            vxlan_vni: getFieldValue("vxlan_vni"),
            vxlan_dscp: e
        })
    }

    render(){
        const { Mode, canWrite, form, value } = this.props
        const { getFieldDecorator, getFieldValue } = form
        let isVxlan = value.switch == 1 ? true : false
        return (
            <>
                <Form.Item
                    label={formatMessage({id:'app.policy.vxlan_encapsulation.switch'})}
                    labelCol={{span: 6}} 
                    wrapperCol={{span: 15}}
                >
                    {
                        getFieldDecorator("vxlan_switch",{
                            initialValue: isVxlan
                        })(<Switch
                            id="vxlanEncSwicth" 
                            checkedChildren={formatMessage({id:'app.policy.on'})} 
                            unCheckedChildren={formatMessage({id:'app.policy.off'})} 
                            checked={isVxlan} 
                            disabled={!canWrite}
                            onChange={this.handleSwitchChange}
                        ></Switch>)
                    }
                </Form.Item>
                {
                    isVxlan ? <><Form.Item
                        label={formatMessage({id:'app.policy.vxlan_encapsulation.dmac'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("vxlan_dmac",{
                                initialValue: value.vxlan_dmac,
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
                        label={formatMessage({id:'app.policy.vxlan_encapsulation.dip'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("vxlan_dip",{
                                initialValue: value.vxlan_dip,
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
                        label={formatMessage({id:'app.policy.vxlan_encapsulation.dport'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("vxlan_dport",{
                                initialValue: value.vxlan_dport,
                                rules:[{required:true, message: formatMessage({id:"app.policy.msg.addform.encapsulation.vxlan.dport"})}]
                            })(<InputNumber 
                                id="vxlanDport" 
                                placeholder="(0-65535, e.g. 20)" 
                                style={{width: "200px"}} 
                                max={65535}
                                min={0}
                                disabled={!canWrite} 
                                onChange={this.handlePortChange}/>)
                        }
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({id:'app.policy.vxlan_encapsulation.vni'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("vxlan_vni",{
                                initialValue: value.vxlan_vni,
                                rules: [{required:true, message: formatMessage({id:"app.policy.msg.addform.encapsulation.vxlan.vni"})}]
                            })(<InputNumber 
                                id="vxlanVni" 
                                placeholder="(0-16777215, e.g. 20)" 
                                style={{width: "200px"}} 
                                max={16777215}
                                min={0}
                                disabled={!canWrite} 
                                onChange={this.handleVniChange}/>)
                        }
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({id:'app.policy.vxlan_encapsulation.dscp'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >
                        {
                            getFieldDecorator("vxlan_dscp",{
                                initialValue: value.vxlan_dscp,
                                rules: [{required:true, message: formatMessage({id:"app.policy.msg.addform.encapsulation.dscp"})}]
                            })(<InputNumber 
                                id="vxlanDscp" 
                                placeholder="(0-63, e.g. 20)" 
                                style={{width: "200px"}} 
                                max={63}
                                min={0}
                                disabled={!canWrite} 
                                onChange={this.handleDscpChange}/>)
                        }
                    </Form.Item></> : null
                }
            </>
        )
    }
}