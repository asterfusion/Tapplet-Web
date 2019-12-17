import React, { Component } from 'react'
import { formatMessage } from 'umi/locale'
import { Card, Button, Form, Modal, List, Spin } from 'antd'
import IgressForm from './IgressForm'
import EgressForm from './EgressForm'
import AEgressForm from './AEgressForm'
import cloneDeep from 'lodash/cloneDeep'

export default class ConfigForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabKey: 'Basic',
            igroupInfo: {
                interlist: [],
            },
            egroupInfo: {
                interlist: [],
                loadbalance: {
                    mode: "",
                    weight: ""
                },
                additional_actions: {
                    gre_encapsulation: {
                        switch: 0,
                        gre_dmac: undefined,
                        gre_dip: undefined,
                        gre_dscp: 0
                    },
                    erspan_encapsulation: {
                        switch: 0,
                        erspan_dmac: undefined,
                        erspan_dip: undefined,
                        erspan_type: undefined,
                        erspan_dscp: 0,
                        erspan_session_id: undefined
                    },
                    vxlan_encapsulation: {
                        switch: 0,
                        vxlan_dmac: undefined,
                        vxlan_dip: undefined,
                        vxlan_dport: undefined,
                        vxlan_vni: undefined,
                        vxlan_dscp: 0
                    },
                }
            },
        }
    }

    componentDidMount() {
        const { Mode, type, editGroup, grouptype } = this.props
        let editGroupInfo = cloneDeep(editGroup)
        if (Mode == "Edit") {
            if (type == "Igress") {
                this.setState({
                    igroupInfo: editGroupInfo
                })
            } else if (type == "Egress") {
                this.setState({
                    egroupInfo: editGroupInfo,
                })
            }
        } 
    }

    onTabChange = (key) => {
        //在这做表单验证
        //在这保存当前表单内容
        const { igroupInfo, egroupInfo } = this.state
        const { type } = this.props
        const { getFieldsValue, getFieldValue, validateFields } = this.props.form

        validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            if (type == "Igress") {
                if (key == "Advanced") {
                    let t = fieldsValue["interlist"];
                    let newt = t.map((i) => {
                        let newi = "G" + (parseInt(i) + 1)
                        return newi
                    })
                    igroupInfo.name = fieldsValue["name"]
                    igroupInfo.description = fieldsValue["description"]
                    igroupInfo.interlist = newt
                } else if (key == "Basic") {
                    /* 目前还没有 */
                }
                this.setState({
                    igroupInfo: igroupInfo
                })
            }
            if (type == "Egress") {
                if (key == "Advanced") {

                    let t = fieldsValue["interlist"];
                    let newt = t.map((i) => {
                        let newi
                        newi = "G" + (parseInt(i) + 1)  
                        return newi
                    })
                    egroupInfo.name = fieldsValue["name"]
                    egroupInfo.description = fieldsValue["description"]
                    egroupInfo.interlist = newt
                    egroupInfo.loadbalance = fieldsValue["loadbalance"] ? fieldsValue["loadbalance"] : {mode: "",weight: ""}
                } else if (key == "Basic") {
                    let ad = {}
                    ad.gre_encapsulation = fieldsValue["encapsulation"].gre_encapsulation
                    ad.erspan_encapsulation = fieldsValue["encapsulation"].erspan_encapsulation
                    ad.vxlan_encapsulation = fieldsValue["encapsulation"].vxlan_encapsulation
                    egroupInfo.additional_actions = ad
                }
                this.setState({
                    egroupInfo: egroupInfo
                })
            }
            this.setState({
                tabKey: key
            })
        });
    }

    render() {
        const { Mode, type, grouptype, modalVisible, okHandle, cancelHandle, form, editGroup, confirmLoading, canWrite, currentPolicy } = this.props
        const { validateFields, getFieldsValue } = form

        const { tabKey, igroupInfo, egroupInfo } = this.state

        let isIgress = type == "Igress" ? true : false
        let title = isIgress ? formatMessage({ id: 'app.policy.iconfig' }) : formatMessage({ id: 'app.policy.econfig' })
        let width = 700
        let bodyStyle = { padding: 0 }
        const handleOk = () => {////////////////////////如果没有切换tab就直接提交了
            validateFields((err, fieldsValue) => {
                if (err) {
                    return;
                }
                if (type == "Igress") {
                    if (tabKey == "Basic") {
                        let t = fieldsValue["interlist"];
                        let newt = t.map((i) => {
                            let newi = "G" + (parseInt(i) + 1)
                            return newi
                        })

                        igroupInfo.name = fieldsValue["name"]
                        igroupInfo.description = fieldsValue["description"]
                        igroupInfo.interlist = newt
                    } else if (tabKey == "Advanced") {
                        /* 目前还没有 */
                    }
                    okHandle(igroupInfo)
                }
                if (type == "Egress") {
                        if (tabKey == "Basic") {
                            let t = fieldsValue["interlist"]
                            let newt = t.map((i) => {
                                let newi = "G" + (parseInt(i) + 1)
                                return newi
                            })
                            egroupInfo.name = fieldsValue["name"]
                            egroupInfo.description = fieldsValue["description"]
                            egroupInfo.interlist = newt
                            egroupInfo.loadbalance = fieldsValue["loadbalance"] ? fieldsValue["loadbalance"] : {mode: "",weight: ""}
                        } else if (tabKey == "Advanced") {
                            let ad = {}
                            ad.gre_encapsulation = fieldsValue["encapsulation"].gre_encapsulation.switch == 1 ? fieldsValue["encapsulation"].gre_encapsulation : {switch: 0}
                            ad.erspan_encapsulation = fieldsValue["encapsulation"].erspan_encapsulation.switch == 1 ? fieldsValue["encapsulation"].erspan_encapsulation : {switch: 0}
                            ad.vxlan_encapsulation = fieldsValue["encapsulation"].vxlan_encapsulation.switch == 1 ? fieldsValue["encapsulation"].vxlan_encapsulation : {switch: 0}
                            egroupInfo.additional_actions = ad
                        }
                        okHandle(egroupInfo)
                }
            });
        };
        let tabList = [
            {
                key: 'Basic',
                tab: formatMessage({ id: 'app.policy.config.basic' }),
            },
            //高级功能暂不开放
            {
                key: 'Advanced',
                tab: formatMessage({ id: 'app.policy.config.advanced' }),
            }
        ]
        let tabiList = [
            {
                key: 'Basic',
                tab: formatMessage({ id: 'app.policy.config.basic' }),
            }
            //高级功能暂不开放
        ]
        const contentIList = {
            Basic: <IgressForm {...this.props} groupInfo={igroupInfo}></IgressForm>,
            Advanced: <p></p>
        }
        const contentEList = {
            Basic: <EgressForm {...this.props} groupInfo={egroupInfo}></EgressForm>,
            Advanced: <AEgressForm {...this.props} groupInfo={egroupInfo}></AEgressForm>
        }
        return (

            <Modal
                maskClosable={false}
                destroyOnClose
                width={width}
                title={title}
                visible={modalVisible}
                // onOk={handleOk}
                onCancel={cancelHandle}
                bodyStyle={bodyStyle}
                footer={canWrite ? [
                    <Button key="cancel" onClick={cancelHandle} style={{ width: '63.84px', textAlign: "center", padding: "0 8px" }} >{formatMessage({ id: 'app.policy.modal.cancel' })}</Button>,
                    <Button key="ok" onClick={handleOk} style={{ backgroundColor: '#3d6cad', color: '#fff', width: '63.84px', marginLeft: '5px' }}>
                        {formatMessage({ id: 'app.policy.modal.ok' })}
                    </Button>
                ] : null}
            >
                <Spin spinning={confirmLoading}>
                    <Card
                        bordered={false}
                        tabList={isIgress?tabiList:tabList}
                        activeTabKey={tabKey}
                        onTabChange={this.onTabChange}
                    >
                        <Form
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 18 }}
                        >
                            {
                                isIgress ? contentIList[tabKey] : contentEList[tabKey]
                            }
                        </Form>
                    </Card>
                </Spin>
            </Modal>
        )
    }
}