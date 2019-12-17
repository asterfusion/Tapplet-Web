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
                    speed: '',
                    type: '',
                    loopback: '',
                    force_tx: '',
                    pause: ''
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
                console.log("biao dan shu ju---------------------------------------------------------------->", fieldsvalue)
                if (err) {
                    return 
                }

                //回环和强发不允许同时配
                if ( (getFieldValue("loopback") == true) && (getFieldValue("force_tx") == true)){
                    message.info(formatMessage({id:"app.loopback.force_tx.err"}))
                    return
                }

                //Output和回环不能同时配
                if ( (getFieldValue("loopback") == true) && (getFieldValue("type") == "Output")){
                    message.info(formatMessage({id:"app.loopback.output.err"}))
                    return
                }

                //配置Input不能再配置回环和强发
                if ( (getFieldValue("type") == "Input") && ((getFieldValue("loopback") == true) || (getFieldValue("force_tx") == true) )){
                    message.info(formatMessage({id:"app.input.err"}))
                    return
                }

                //表单数据的处理
                portInfo.name = "X"+ portnumber
                if (fieldsvalue["speed"] == "10G"){
                    portInfo.config.speed = 10000
                }
                if (fieldsvalue["speed"] == "1G"){
                    portInfo.config.speed = 1000
                }
                if (fieldsvalue['speed'] == "100M"){
                    portInfo.config.speed = 100
                }

                if (fieldsvalue["type"] == "Normal"){
                    portInfo.config.type = 'normal'
                }
                if (fieldsvalue["type"] == "Input"){
                    portInfo.config.type = 'input'
                }
                if (fieldsvalue["type"] == 'Output'){
                    portInfo.config.type = 'output'
                }
                portInfo.config.loopback = fieldsvalue["loopback"] == undefined || fieldsvalue["loopback"] == false ? 0 : 1
                portInfo.config.force_tx = fieldsvalue["force_tx"] == undefined || fieldsvalue["force_tx"] == false ? 0 : 1
                portInfo.config.pause = fieldsvalue["pause"] == undefined || fieldsvalue["pause"] == false ? 0 : 1

                console.log("我是处理过的数据------------------------------------------------------>", portInfo)

                okHandle(portInfo)
            })
        }

        console.log('currentportinfo--------------------------------------------->',currentPort)
        console.log("权限----------------------------------------->", canWrite)

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
                                <Select disabled={!canWrite}>
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
                                initialValue: currentPort ? currentPort.config.type : "Normal"
                            })
                            (
                                <Select
                                    onChange = {this.loopbackOnchange}
                                    disabled = {!canWrite}
                                >
                                    <Select.Option key="1" value={"Normal"}>Normal</Select.Option>
                                    <Select.Option key="2" value={"Input"}>Input</Select.Option>
                                    <Select.Option key="3" value={"Output"}>Output</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({id:"app.policy.portloopback"})}
                            >
                            {getFieldDecorator("loopback",{
                                  initialValue: currentPort ? currentPort.config.loopback == 1 ? true : false : false
                            })(
                                <Switch 
                                    checkedChildren={formatMessage({id:"app.policy.loopbackon"})}
                                    unCheckedChildren={formatMessage({id:"app.policy.loopbackoff"})}
                                    checked={getFieldValue("loopback")}
                                    disabled={!canWrite}
                                    >
                                </Switch>               
                            )}
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({id:"app.policy.forcetx"})}
                            >
                            {getFieldDecorator("force_tx",{
                                  initialValue: currentPort ? currentPort.config.force_tx == 1 ? true : false : false
                            })(
                                <Switch 
                                    checkedChildren={formatMessage({id:"app.policy.forcetxon"})}
                                    unCheckedChildren={formatMessage({id:"app.policy.forcetxoff"})}
                                    checked={getFieldValue("force_tx")}
                                    disabled={!canWrite}
                                    >
                                </Switch>               
                            )}
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({id:"app.policy.pause"})}
                            >
                            {getFieldDecorator("pause",{
                                  initialValue: currentPort ? currentPort.config.pause == 1 ? true : false : false
                            })(
                                <Switch 
                                    checkedChildren={formatMessage({id:"app.policy.pauseon"})}
                                    unCheckedChildren={formatMessage({id:"app.policy.pauseoff"})}
                                    checked={getFieldValue("pause")}
                                    disabled={!canWrite}
                                    >
                                </Switch>               
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