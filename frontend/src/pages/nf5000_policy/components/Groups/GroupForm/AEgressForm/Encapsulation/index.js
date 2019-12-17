import React, { Component } from 'react'
import { Form, Input, Switch, Select, message, InputNumber } from 'antd'
import { formatMessage } from 'umi/locale'
import GreEncapsulation from './gre_desensitization'
import ErspanEncapsulation from './erspan_desensitization'
import VxlanEncapsulation from './vxlan_encapsulation'
import isEqual from 'lodash/isEqual' 
import cloneDeep from 'lodash/cloneDeep'
import styles from '../../groupforms.less'


export default class Encapsulation extends Component {
    constructor(props){
        super(props)
        this.state = {
            content: {
                gre_encapsulation: {},
                erspan_encapsulation: {},
                vxlan_encapsulation: {}
            },
            isGre: false,
            isErspan: false,
            isVxlan: false,
            selected: ""
        }
    }

    componentDidMount(){
        const { value, encapSelected } = this.props
        let encapContent = cloneDeep(value)
        this.setState({
            content: encapContent
        })
        this.switchChange(encapSelected)
    }
    componentDidUpdate(prevProps){
        if(!isEqual(prevProps.value,this.props.value)){
            let encapContent = cloneDeep(this.props.value)
            this.setState({
                content: encapContent
            })
        }    
        if(prevProps.encapSelected != this.props.encapSelected){
            this.setState({
                selected: this.props.encapSelected
            })
        }
    }

    switchChange = (v) => {
        switch(v){
            case "": {
                this.setState({
                    isGre: false, isErspan: false, isVxlan:false, selected: v
                })
                break
            }
            case "gre": {
                this.setState({
                    isGre: true, isErspan: false, isVxlan:false, selected: v
                })
                break
            }
            case "erspan": {
                this.setState({
                    isGre: false, isErspan: true, isVxlan:false, selected: v
                })
                break
            }
            case "vxlan": {
                this.setState({
                    isGre: false, isErspan: false, isVxlan:true, selected: v
                })
                break
            }
            default: break
        }
    }

    selectChange = (v) => {
        const { onChange, value, form } = this.props
        const { content, isGre, isErspan, isVxlan, selected } = this.state
        const { getFieldValue, validateFields } = this.props.form

        if(v == ""){
            content.gre_encapsulation.switch = 0
            content.erspan_encapsulation.switch = 0
            content.vxlan_encapsulation.switch = 0
            onChange({
                gre_encapsulation: content.gre_encapsulation,
                erspan_encapsulation: content.erspan_encapsulation,
                vxlan_encapsulation: content.vxlan_encapsulation,
            })
            this.switchChange(v)
        }else if(isGre && v != "gre"){
            validateFields(["gre_dmac","gre_dip","gre_dscp"],(err,fieldsValue) => {
                if(err){
                    return
                }
                this.switchChange(v)
            })
        }
        else if(isErspan && v != "erspan"){
            validateFields(["erspan_dmac","erspan_dip","erspan_session_id","erspan_type","erspan_dscp"],(err,fieldsValue) => {
                if(err){
                    return
                }
                this.switchChange(v)
            })
        }
        else if(isVxlan && v != "vxlan"){
            validateFields(["vxlan_dmac","vxlan_dip","vxlan_dport","vxlan_vni","vxlan_dscp"],(err,fieldsValue) => {
                if(err){
                    return
                }
                this.switchChange(v)
            })
        }
        else {
            this.switchChange(v)
        } 
    }

    onGreChange = (info) => {
        const { onChange, value } = this.props   
        const { content } = this.state
        if(info.switch == 1){
            content.erspan_encapsulation.switch = 0
            content.vxlan_encapsulation.switch = 0
            onChange({
                gre_encapsulation: info,
                erspan_encapsulation: content.erspan_encapsulation,
                vxlan_encapsulation: content.vxlan_encapsulation,
            })
        }else if(info.switch == 0){
            onChange({
                gre_encapsulation: info,
                erspan_encapsulation: content.erspan_encapsulation,
                vxlan_encapsulation: content.vxlan_encapsulation,
            })
        }
    }
    onErspanChange = (info) => {
        const { onChange, value } = this.props   
        const { content } = this.state
        if(info.switch == 1){
            content.gre_encapsulation.switch = 0
            content.vxlan_encapsulation.switch = 0
            onChange({
                gre_encapsulation: content.gre_encapsulation,
                erspan_encapsulation: info,
                vxlan_encapsulation: content.vxlan_encapsulation,
            })
        }else if(info.switch == 0){
            onChange({
                gre_encapsulation: content.gre_encapsulation,
                erspan_encapsulation: info,
                vxlan_encapsulation: content.vxlan_encapsulation,
            })
        }    
    }
    onVxlanChange = (info) => {
        const { onChange, value } = this.props   
        const { content } = this.state
        if(info.switch == 1){
            content.gre_encapsulation.switch = 0
            content.erspan_encapsulation.switch = 0
            onChange({
                gre_encapsulation: content.gre_encapsulation,
                erspan_encapsulation: content.erspan_encapsulation,
                vxlan_encapsulation: info,
            })
        }else if(info.switch == 0){
            onChange({
                gre_encapsulation: content.gre_encapsulation,
                erspan_encapsulation: content.erspan_encapsulation,
                vxlan_encapsulation: info,
            })
        }
    }

    render(){
        const { canWrite, form, value, Mode, onChange, encapSelected } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const { isGre, isErspan, isVxlan, selected } = this.state

        return (
            <fieldset className={styles.fieldset}>
                <legend style={{width: "fit-content", border: 0}}>{formatMessage({id:'app.policy.encapsulation'})}</legend>
                <div>
                    <Form.Item
                        label={formatMessage({id:'app.policy.encapsulation_select'})}
                        labelCol={{span:6}}
                        wrapperCol={{span:15}}
                    >
                        <Select
                            value={selected}
                            onChange={this.selectChange}
                            style={{width: '180px'}}
                        >
                            <Select.Option key="1" value="">{formatMessage({id: "app.policy.encapsulation.null"})}</Select.Option>
                            <Select.Option key="2" value="gre">GRE</Select.Option>
                            <Select.Option key="3" value="erspan">ERSPAN</Select.Option>
                            <Select.Option key="4" value="vxlan">VXLAN</Select.Option>
                        </Select>
                    </Form.Item>
                    {
                        isGre ? <Form.Item>
                            {
                                getFieldDecorator("gre_encapsulation",{
                                    initialValue: value.gre_encapsulation
                                })(<GreEncapsulation form={form} canWrite={canWrite} Mode={Mode} onGreChange={this.onGreChange} />)
                            }
                        </Form.Item> : null
                    }
                    {
                        isErspan ? <Form.Item>
                            {
                                getFieldDecorator("erspan_encapsulation",{
                                    initialValue: value.erspan_encapsulation
                                })(<ErspanEncapsulation form={form} canWrite={canWrite} Mode={Mode} onErspanChange={this.onErspanChange} />)
                            }
                        </Form.Item> : null 
                    }
                    {
                        isVxlan ? <Form.Item>
                            {
                                getFieldDecorator("vxlan_encapsulation",{
                                    initialValue: value.vxlan_encapsulation
                                })(<VxlanEncapsulation form={form} canWrite={canWrite} Mode={Mode} onVxlanChange={this.onVxlanChange} />)
                            }
                        </Form.Item> : null 
                    }
                </div>
            </fieldset>
        )       
    }
}