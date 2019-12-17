import React, { Component } from 'react'
import { Form, Input, Switch, Select, message, InputNumber } from 'antd';
import { formatMessage } from 'umi/locale';
import { RegexPattern } from '../../validatePattern'
import Encapsulation from './Encapsulation'

const { pat_mac, pat_ip } = RegexPattern
const enArr = ["gre_encapsulation", "erspan_encapsulation", "vxlan_encapsulation"]

//出接口组高级配置
export default class AEgressForm extends Component {
    constructor(props){
        super(props)
    }

    render(){
        const { form, Mode, groupInfo, canWrite } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        let adActionValues = groupInfo.additional_actions;
        let remHeaderValues = [], encapsulationValue = {}, encapSelected = ""

        Object.keys(adActionValues).map((i) => {
            if(enArr.indexOf(i) != -1){
                encapsulationValue[i] = adActionValues[i]
                if(adActionValues[i].switch == 1){
                    encapSelected = i.split("_")[0]
                }
            }
        })
        return (
            <>
                <Form.Item>    
                    {getFieldDecorator("encapsulation",{
                        initialValue: encapsulationValue
                    })(<Encapsulation canWrite={canWrite} form={form} Mode={Mode} encapSelected={encapSelected}/>)}
                </Form.Item>  

            </> 
        )
    }
}




