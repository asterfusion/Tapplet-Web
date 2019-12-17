import React, { Component } from 'react'
import { Form, Input, Switch, InputNumber } from 'antd'
import { formatMessage } from 'umi/locale'
import { RegexPattern } from '../../../validatePattern'

const { pat_mac, pat_ip } = RegexPattern

export default class GreEncapsulation extends Component {
    constructor(props){
        super(props)
    }
    handleSwitchChange = (e) => {
        const { onGreChange, form, value } = this.props
        const { getFieldValue } = form
        onGreChange({
            switch: e ? 1 : 0,
            gre_dmac: getFieldValue("gre_dmac") || value.gre_dmac,
            gre_dip: getFieldValue("gre_dip") || value.gre_dip,
            gre_dscp: getFieldValue("gre_dscp") || value.gre_dscp
        })
    }
    
    handleDMacChange = (e) => {
        const { onGreChange, form } = this.props
        const { getFieldValue } = form
        onGreChange({
            switch: getFieldValue("gre_switch") ? 1 : 0,
            gre_dmac: e.target.value,
            gre_dip: getFieldValue("gre_dip"),
            gre_dscp: getFieldValue("gre_dscp")
        })
    }

    handleDIpChange = (e) => {
        const { onGreChange, form } = this.props
        const { getFieldValue } = form
        onGreChange({
            switch: getFieldValue("gre_switch") ? 1 : 0,
            gre_dmac: getFieldValue("gre_dmac"),
            gre_dip: e.target.value,
            gre_dscp: getFieldValue("gre_dscp")
        })
    }

    handleDscpChange = (e) => {
        const { onGreChange, form } = this.props
        const { getFieldValue } = form
        onGreChange({
            switch: getFieldValue("gre_switch") ? 1 : 0,
            gre_dmac: getFieldValue("gre_dmac"),
            gre_dip: getFieldValue("gre_dip"),
            gre_dscp: e
        })
    }

    render(){
        const { Mode, canWrite, form, value } = this.props
        const { getFieldDecorator, getFieldValue } = form
        let isGre = value.switch == 1 ? true : false
        return (
            <>
                <Form.Item 
                    label={formatMessage({id:'app.policy.gre_encapsulation.switch'})}
                    labelCol={{span: 6}} 
                    wrapperCol={{span: 15}}
                >{
                    getFieldDecorator("gre_switch",{
                        initialValue: isGre
                    })(<Switch 
                        id="greEncSwicth" 
                        checkedChildren={formatMessage({id:'app.policy.on'})} 
                        unCheckedChildren={formatMessage({id:'app.policy.off'})} 
                        checked={isGre} 
                        disabled={!canWrite}
                        onChange={this.handleSwitchChange}
                    ></Switch>)}
                </Form.Item>
                {
                    isGre ? <>
                        <Form.Item 
                            label={formatMessage({id:'app.policy.gre_encapsulation.dmac'})}
                            labelCol={{span: 6}} 
                            wrapperCol={{span: 15}}
                        >{
                            getFieldDecorator("gre_dmac",{
                                initialValue: value.gre_dmac,
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
                            })(<Input id="greDmac" placeholder="(e.g. 00:16:EA:AE:3C:40)" style={{width: "200px"}} disabled={!canWrite} onChange={this.handleDMacChange}/>)}
                        </Form.Item>
                        <Form.Item 
                            label={formatMessage({id:'app.policy.gre_encapsulation.dip'})}
                            labelCol={{span: 6}} 
                            wrapperCol={{span: 15}}
                        >{
                            getFieldDecorator("gre_dip",{
                                initialValue: value.gre_dip,
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
                            })(<Input id="greIp" placeholder="(e.g. 192.168.1.1)" style={{width: "200px"}} disabled={!canWrite} onChange={this.handleDIpChange}/>)}
                        </Form.Item>
                        <Form.Item 
                            label={formatMessage({id:'app.policy.gre_encapsulation.dscp'})}
                            labelCol={{span: 6}} 
                            wrapperCol={{span: 15}}
                        >{
                            getFieldDecorator("gre_dscp",{
                                initialValue: value.gre_dscp,
                                rules:[{required: true, message: formatMessage({id:"app.policy.msg.addform.encapsulation.dscp"})}]
                            })(<InputNumber 
                                    id="greDscp" 
                                    placeholder="(0-63, e.g. 20)" 
                                    style={{width: "200px"}} 
                                    max={63}
                                    min={0}
                                    disabled={!canWrite} 
                                    onChange={this.handleDscpChange}/>)}
                        </Form.Item>
                    </> : null
                }
            </>
        )
    }
}