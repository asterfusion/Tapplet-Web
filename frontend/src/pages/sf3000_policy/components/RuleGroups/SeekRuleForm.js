import React, { Component } from 'react'
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout'
import {Button, Card, Col, Row, Modal, Form, Input, List, Select, Switch, InputNumber, message} from 'antd'
import { connect } from 'dva'
import { Dispatch } from 'redux'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import styles from '@/pages/sf3000_policy/sf3000_policy.less'
import TextArea from 'antd/lib/input/TextArea'
import Tuple from './Forms/Tuple'
import Tuplev6 from './Forms/Tuplev6'
import Ipset from './Forms/Ipset'
import Ipsetv6 from './Forms/Ipsetv6'
import HardKeyword from './Forms/HardKeyword'
import EthType from './Forms/EthType'

export default class SeekRuleForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            visible:false
        }

    }

    render(){
        const {isscantuple, isscantuplev6, isscanipset, isscanipsetv6, isscankeyword, isscaneth_type, scanrules, handleSeekOk, form, isscan } = this.props 
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        const {visible} = this.state

        console.log("tuple------",isscantuple)
        console.log("tuplev6-----", isscantuplev6)
        console.log("ipset----",isscanipset)
        console.log("ipsetv6----", isscanipsetv6)
        console.log("keyword-----", isscankeyword)
        console.log("eth type-------", isscaneth_type)


        console.log("isscan is-------------------------------->", isscan)

        console.log("scanrules is ---------------------------->", scanrules)

        return(
            <div>
            <Modal
                destroyOnClose
                width={700}
                title={formatMessage({id:"app.policy.add.filter"})}
                visible={isscan}
                onOk={handleSeekOk}
                onCancel={handleSeekOk}
                footer={[
                    <Button onClick={handleSeekOk}> {formatMessage({id:"app.policy.button.on"})} </Button> 
                ]}
            >
             <Form 
                labelCol={{span:5}} 
                wrapperCol={{span:15}}
            >
                <Form.Item 
                    label={formatMessage({id:"app.policy.filter.type"})}
                    wrapperCol={{span:5}}
                    >
                    {getFieldDecorator("rule_type",{
                        initialValue: scanrules.rule_type,
                    })(<Input disabled />)}
                </Form.Item>
                <Form.Item
                    label={formatMessage({id:"app.policy.action"})}
                    >
                    {getFieldDecorator("action",{
                         initialValue: scanrules.rule_cfg.action == "0" ? false : true,
                    })
                    (<Switch 
                        checkedChildren={formatMessage({id:"app.policy.permit"})}
                        unCheckedChildren={formatMessage({id:"app.policy.deny"})}
                        checked={getFieldValue("action")}
                        disabled>
                    </Switch>)}

                </Form.Item>
                {isscantuple ? <Tuple Mode="scan" form={form} scanrules={scanrules}/> : null}

                {/*tuplev6 规则的表单渲染 */}
                {isscantuplev6 ? <Tuplev6 Mode="scan" form={form} scanrules={scanrules}/> : null}
                        
                {/* ipset规则的表单渲染*/}
                {isscanipset ? <Ipset Mode="scan" form={form} scanrules={scanrules}/> : null}

                {/* ipsetv6 规则的表单渲染*/}
                {isscanipsetv6 ? <Ipsetv6 Mode="scan" form={form} scanrules={scanrules}/> : null}

                {/* keyword 规则的表单渲染*/}
                {isscankeyword ? <HardKeyword Mode="scan" form={form} scanrules={scanrules}/> : null}

                {/* eth_type 规则的表单渲染*/}
                {isscaneth_type ? <EthType Mode="scan" form={form} scanrules={scanrules}/> : null}
            </Form>
            </Modal>
            </div>

        )
    }

}

