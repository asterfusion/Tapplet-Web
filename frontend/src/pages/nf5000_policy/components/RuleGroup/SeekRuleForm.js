import React, { Component } from 'react'
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout'
import {Button, Card, Col, Row, Modal, Form, Input, List, Select, Switch, InputNumber, message} from 'antd'
import { connect } from 'dva'
import { Dispatch } from 'redux'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import styles from '@/pages/nf5000_policy/nf5000_policy.less'
import TextArea from 'antd/lib/input/TextArea'
import Tuple from './RuleForm/Tuple'
import Tuplev6 from './RuleForm/Tuplev6'


export default class SeekRuleForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            visible:false
        }
    }

    render(){
        const {isscantuple, isscantuplev6, scanrules, handleSeekOk, form, isscan } = this.props 
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        const {visible} = this.state
        
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
                         initialValue: scanrules.action == "0" ? false : true,
                    })
                    (<Switch 
                        checkedChildren={formatMessage({id:"app.policy.permit"})}
                        unCheckedChildren={formatMessage({id:"app.policy.deny"})}
                        checked={getFieldValue("action")}
                        disabled>
                    </Switch>)}

                </Form.Item>
                {isscantuple ? <Tuple Mode="scan" form={form} scanrules={scanrules}/> : null}
                {isscantuplev6 ? <Tuplev6 Mode="scan" form={form} scanrules={scanrules}/> : null}
            </Form>
            </Modal>
            </div>

        )
    }

}

export {SeekRuleForm}