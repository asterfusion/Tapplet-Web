import React, { Component } from 'react'
import { Form, Input, Transfer, Select, message } from 'antd'
import styles from '../../groups.less'
import { formatMessage } from 'umi/locale'
import TextArea from 'antd/lib/input/TextArea'
import { bubbleSort } from '@/pages/nf5000_policy/utils/tools'
import { RegexPattern } from '../../validatePattern'
import LoadBalance from './LoadBalance'

const { pat_groupname, pat_wrr } = RegexPattern

//出接口组配置
export default class EgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetkeys: []
        }
    }

    componentDidMount(){
        this.setState({
            targetKeys: this.initTargetKeys()
        })
    }

    transHandler = (t) => {
        this.setState({
            targetkeys: bubbleSort(t),
        })
    }

    initTargetKeys = () => {
        const { groupInfo } = this.props
        let initKeys = groupInfo.interlist.map((i) => {
            let strToNum
            strToNum = parseInt(i.replace("G","").trim())-1;
            let res = strToNum.toString();
            return res
        })
        this.setState({
            targetkeys: initKeys
        })
    }

    render() {
        const { targetkeys } = this.state
        const { Mode, type, groupInfo, form, ports, canWrite, currentPolicy } = this.props
        const { getFieldDecorator, validateFields, getFieldValue } = form
        let modalValues =  groupInfo
        let loadBalance =  groupInfo.loadbalance
        let lbOptions = {}
        //多个端口必须LoadBalance
        const tlen = targetkeys.length

        lbOptions = tlen > 1 ? {
            initialValue: {
                mode: loadBalance.mode,
                weight: loadBalance.weight
            },
            rules: [{required:true, message: formatMessage({id:"app.policy.msg.loadbalance"})},
            {
                type: "object",
                validator: (rule, value, callback) => {
                    let wrrArr = value.weight.split(":")
                    let hasVoid = false
                    wrrArr.forEach((i)=>{
                        if(i==""){
                            hasVoid = true
                        }
                    })
                    if(value.mode == "" && value.weight == "") {   
                        callback(formatMessage({id:"app.policy.msg.loadbalance"})) 
                    }

                    /**
                     * 判断wrr模式下权重配置是否为空
                     */
                    if(value.mode == "wrr" && hasVoid) {
                        callback(formatMessage({id:"app.policy.msg.loadbalance.wrr"})) 
                    }

                    /**
                     * 判断权重配置的格式是否正确
                     */
                    wrrArr.forEach((i)=>{
                        if(value.mode == "wrr" && (parseInt(i) > 100000 || parseInt(i) < 1)){
                            callback(formatMessage({id:"app.policy.msg.loadbalance.wrr.format"}))
                        }
                    })
                    if(value.mode == "wrr" && !pat_wrr.test(value.weight)){
                        callback(formatMessage({id:"app.policy.msg.loadbalance.wrr.format"})) 
                    }
                    callback()
                } 
            }]
        } : null

        return (
            <>
                    <Form.Item
                      label={formatMessage({id:'app.policy.groupname'})}
                      wrapperCol={{span:5}}
                      >
                        {getFieldDecorator("name",{
                            initialValue: modalValues.name,
                             rules: [{
                                required: true,
                                validator: (rule, value, callback) => {
                                    try{
                                        if(value != undefined && value != "" ){
                                            let oname = []
                                            if(Mode == 'Add'){
                                                currentPolicy.map((i)=>{
                                                    oname.push(i["name"])
                                                })
                                                if(oname.indexOf(value) !== -1) {
                                                    throw new Error(formatMessage({id:"app.policy.msg.groupname.format.duplication"})) 
                                                }
                                            }
                                            if(!pat_groupname.test(value)){
                                                throw new Error(formatMessage({id:"app.policy.msg.groupname.format"}))
                                            }
                                            if(value.length > 15){
                                                throw new Error(formatMessage({id:"app.policy.msg.groupname.format.length"}))
                                            }
                                        }else{
                                            throw new Error(formatMessage({id:"app.policy.msg.groupname"}))
                                        }
                                    }catch(err){
                                        callback(err)
                                    }finally{
                                        callback()
                                    }
                                } 
                            }],
                        })(<Input disabled={Mode == 'Edit'}/>)}
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({id:'app.policy.description'})}
                      wrapperCol={{span:12}}
                      >
                        {getFieldDecorator("description",{
                            initialValue: modalValues.description,
                            rules:[{max: 100, message: formatMessage({id:"app.users.user.msg.description.format.length"})},]
                        })(<TextArea placeholder={formatMessage({id:"app.users.user.description.tip"})} autosize={{minRows: 3, maxRows: 6 }} disabled={!canWrite}/>)}
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({id:'app.policy.interfaces'})}
                      >
                        {getFieldDecorator("interlist",{
                            initialValue: targetkeys,
                            rules: [{required: true, message: formatMessage({id:"app.policy.msg.port"})}],
                        })(<Transfer
                            dataSource={ports}
                            render={item => item.title}
                            targetKeys={targetkeys}
                            listStyle={{
                                width: 200,
                                height: 200
                            }}
                            onChange={this.transHandler}
                            showSearch
                            disabled={!canWrite}
                        ></Transfer>)
                        }
                    </Form.Item>
                    {
                        tlen > 1? <Form.Item
                        label={formatMessage({id:'app.policy.loadbalance'})}
                        wrapperCol={{span:8}}
                        >
                            {getFieldDecorator("loadbalance",lbOptions)(<LoadBalance 
                                targetkeys={targetkeys}
                                canWrite={canWrite}
                            ></LoadBalance>)
                            }
                        </Form.Item> : null
                    }
                </>
        )
    }

    newMethod() {
        return true;
    }
}
function newFunction() {
    return true;
}

