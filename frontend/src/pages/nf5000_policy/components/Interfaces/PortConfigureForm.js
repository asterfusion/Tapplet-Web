import React, { Component } from 'react'
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout'
import {Button, Card, Col, Row, Modal, Form, Select, Switch, InputNumber, message, Input, Spin} from 'antd'
import { connect } from 'dva'
import { dispatch } from 'redux'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import component from '@/locales/zh-CN/component';

export default class PortConfigureForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            portInfo: {
                name: '',
                config: {
                    type: ''
                },
            },
        }
    }

    render(){
        const { portname, portnumber, isportConfigure, okHandle, handleCancel, form, currentPort, portqueryloading, portconfigloading, canWrite} = this.props
        const { getFieldsValue, getFieldDecorator, validateFields, getFieldValue } = form
        const { portInfo, loopbackdisable, force_txdisable } = this.state
        const HandleOk = () => {
            validateFields((err, fieldsvalue) => {
                if (err) {
                    return 
                }
                //表单数据的处理
                portInfo.name = portnumber
                portInfo.config.type = fieldsvalue["type"]
                okHandle(portInfo)
            })
        }
        return(
            <div>
                <Modal
                    destroyOnClose
                    width = {700}
                    visible = {isportConfigure}
                    // onOk = {HandleOk}
                    onCancel = {handleCancel}
                    footer={canWrite ? [
                        <Button key="cancel" onClick={handleCancel}> {formatMessage({id:"app.policy.button.cancel"})} </Button>,
                        <Button key="ok" type="primary" onClick={HandleOk}> {formatMessage({id:"app.policy.button.on"})} </Button>,         
                    ] : null}
                    title = {portname}
                >
                <Spin spinning={portqueryloading}>
                <Spin spinning={portconfigloading}>
                    <Form
                        labelCol={{span:5}} 
                        wrapperCol={{span:15}}
                    >
                        <Form.Item 
                            label={formatMessage({id:"app.policy.portspeed"})}
                            wrapperCol={{span:5}}
                            >
                            {getFieldDecorator("speed",{
                                 initialValue: currentPort ? currentPort.config.speed : "10G"
                            })
                            (
                                <Select disabled>
                                    <Select.Option key="1" value={"10G"}>10G</Select.Option>
                                    <Select.Option key="2" value={"1G"}>1G</Select.Option>
                                    <Select.Option key="3" value={"100M"}>100M</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item 
                            label={formatMessage({id:"app.policy.porttype"})}
                            wrapperCol={{span:5}}
                            >
                            {getFieldDecorator("type",{
                                initialValue: currentPort ? currentPort.config.type : "normal"
                            })
                            (
                                <Select
                                    disabled = {!canWrite}
                                >
                                    <Select.Option key="1" value={"normal"}>Normal</Select.Option>
                                    <Select.Option key="2" value={"tunnel"}>Tunnel</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                    </Spin>
                    </Spin>
                </Modal>
            </div>

        )
    }

}