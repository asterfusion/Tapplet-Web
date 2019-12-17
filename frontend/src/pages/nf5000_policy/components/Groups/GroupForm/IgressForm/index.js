import React, { Component } from 'react'
import { Form, Input, Transfer, Switch, message, Checkbox } from 'antd'
import styles from '../../groups.less'
import { formatMessage } from 'umi/locale'
import TextArea from 'antd/lib/input/TextArea'
import { bubbleSort } from '@/pages/nf5000_policy/utils/tools'
import { RegexPattern } from '../../validatePattern'

const { pat_groupname } = RegexPattern
//入接口组配置
export default class IgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetkeys: [],
        }
    }

    componentDidMount() {
        const { Mode } = this.props;
        if(Mode == "Edit") this.initTargetKeys()
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
        const { targetkeys } = this.state;
        const { Mode, modalVisible, type, groupInfo, form, ports, canWrite, currentPolicy } = this.props;
        const { getFieldDecorator, validateFields, getFieldValue } = form;

        let modalValues = groupInfo;
        let isDedup = modalValues.deduplication_enable == 0 || modalValues.deduplication_enable == undefined ? false : true
        const isConnect = groupInfo.connect//有规则组的时候不能添加删除端口

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
                                        if(value != undefined && value != ""){
                                            let iname = []
                                            if(Mode == 'Add'){
                                                currentPolicy.map((i)=>{
                                                    iname.push(i["name"])
                                                })
                                                if(iname.indexOf(value) !== -1) {
                                                    throw new Error(formatMessage({id:"app.policy.msg.groupname.format.duplication"})) 
                                                }
                                            }
                                            if(value != "" && !pat_groupname.test(value)){
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
                            disabled={!canWrite || isConnect}
                        ></Transfer>)}
                    </Form.Item>
                </>
        )
    }
}