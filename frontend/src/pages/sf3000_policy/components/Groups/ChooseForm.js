import React, { Component } from 'react'
import { formatMessage } from 'umi/locale'
import { Card, Button, Form, Modal, Divider, Input, Transfer, Switch, Tabs, Select, message, List, Radio } from 'antd'

export default class ChooseForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            grouptype: "",
        }
    }

    render(){
        const { form , modalVisible, cancelHandle, okHandle } = this.props
        const { getFieldsValue, getFieldDecorator, validateFields } = form
        let title = formatMessage({id:'app.policy.choosetype'})
        const handleOk = () => {
            validateFields((err, FieldsValue) => {
                if(err){
                    return
                }
                okHandle(FieldsValue["type"])
            })
        }
        return (
            <Modal
                maskClosable={false}
                destroyOnClose
                width={700}
                title={title}
                visible={modalVisible}
                onOk={handleOk}
                onCancel={cancelHandle}
            >
                <Form
                    labelCol={{span:5}} 
                    wrapperCol={{span:18}}
                >
                    <Form.Item
                        label={formatMessage({id:'app.policy.choosetype.type'})}
                        wrapperCol={{span:5}}
                    >
                        {getFieldDecorator("type",{
                            initialValue: "Egress",
                            rules: [{required: true, message: 'Please choose the type!'}],
                        })(
                            <Radio.Group>
                                <Radio value="Egress">{formatMessage({id:'app.policy.choosetype.egress'})}</Radio>
                                <Radio value="Cgress">{formatMessage({id :'app.policy.choosetype.cgress'})}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}