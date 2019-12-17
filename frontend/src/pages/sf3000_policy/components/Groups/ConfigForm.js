import React, { Component } from 'react'
import { formatMessage } from 'umi/locale'
import { Card, Button, Form, Modal, Divider, Input, Transfer, Switch, Tabs, Select, message, List, Spin } from 'antd'
import { IgressForm, EgressForm, AEgressForm } from './GroupForms'
import cloneDeep from 'lodash/cloneDeep'

export default class ConfigForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            tabKey: 'Basic',
            isCopy: false,
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
                        gre_dmac: "",
                        gre_dip: ""
                    },
                    time_stamping: {
                        switch: 0
                    },
                    slice: {
                        switch: 0,
                        slice_bytes: null,
                        slice_flag_update: 1
                    },
                    remove_tunnel_header_vlan: {
                        switch: 0,
                        vlan_layers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
                    },
                    remove_tunnel_header_mpls: {
                        switch: 0,
                        mpls_layers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
                    },
                    remove_tunnel_header_vxlan: {
                        switch: 0,
                    },
                    remove_tunnel_header_gre: {
                        switch: 0,
                        remove_tunnel_header_gre_update_crc: 0 
                    }
                }
            },
            cgroupInfo:{
                interlist: [],
                copyFrom: "",
            },
        }
    }

    componentDidMount(){
        const { Mode, type, grouptype, editGroup } = this.props
        let editGroupInfo = cloneDeep(editGroup)
        if(Mode == "Edit") {
            if(type == "Igress") {
                this.setState({
                    igroupInfo: editGroupInfo
                })
            }else if(type == "Egress") {
                let isC = editGroupInfo.copy && editGroupInfo.copy == 1 ? true : false
                if(isC){
                    this.setState({
                        isCopy: isC,
                        cgroupInfo: editGroupInfo
                    })
                }else {
                    this.setState({
                        egroupInfo: editGroupInfo,
                    })
                }
            }
        }else if(Mode == "Add"){
            //grouptype是为了创建组的时候显示不同的表单
            let isC = grouptype == "Cgress" ? true : false
            if(isC){
                this.setState({
                    isCopy: isC,
                })
            }
        }
    }
    /**
     * 切换Tab的时候对当前表单进行验证并保存
     * @param {string} key
     */
    onTabChange = (key) => {
        const { tabKey, igroupInfo, egroupInfo } = this.state
        const { type } = this.props
        const { getFieldsValue, getFieldValue, validateFields } = this.props.form
        validateFields((err, fieldsValue) => {
            if(err) {
              return;
            }
            if(type == "Igress"){
                if(key == "Advanced") {
                    let t = fieldsValue["interlist"];
                    let newt = t.map((i) => {
                        let newi = "X"+(parseInt(i)+1)
                        return newi
                    })
                    igroupInfo.name = fieldsValue["name"]
                    igroupInfo.description = fieldsValue["description"]
                    igroupInfo.interlist = newt
                    igroupInfo.deduplication = fieldsValue["deduplication"]
                    igroupInfo.tuple_mode = fieldsValue["tuple_mode"]
                }else if(key == "Basic") {
                  /* 目前还没有 */
                }
                this.setState({
                    igroupInfo
                })
            }
            if(type == "Egress"){
                if(key == "Advanced"){
                    let t = fieldsValue["interlist"];
                    let newt = t.map((i) => {
                        let newi = "X"+(parseInt(i)+1)
                        return newi
                    })
                    egroupInfo.name = fieldsValue["name"]
                    egroupInfo.description = fieldsValue["description"]
                    egroupInfo.interlist = newt
                    egroupInfo.loadbalance = fieldsValue["loadbalance"] ? fieldsValue["loadbalance"] : {mode: "",weight: ""}
                }else if(key == "Basic") {
                    let ad = {}
                    ad.gre_encapsulation = fieldsValue["gre_encapsulation"]
                    ad.time_stamping = fieldsValue["time_stamping"]
                    ad.slice = fieldsValue["slicing"]
                    ad.remove_tunnel_header_vlan = fieldsValue["remove"][0].vlan
                    ad.remove_tunnel_header_mpls = fieldsValue["remove"][1].mpls
                    ad.remove_tunnel_header_vxlan = fieldsValue["remove"][2].vxlan
                    ad.remove_tunnel_header_gre = fieldsValue["remove"][3].gre
                    egroupInfo.additional_actions = ad
                }
                this.setState({
                    egroupInfo
                })
            }
            this.setState({
                tabKey: key
            })
        });
    }

    render(){
        const { Mode, type, grouptype, modalVisible, okHandle, cancelHandle, form, editGroup, confirmLoading, canWrite, currentPolicy } = this.props
        const { validateFields, getFieldsValue } = form
        const { tabKey, isCopy, igroupInfo, egroupInfo, cgroupInfo } = this.state

        let isIgress = type == "Igress" ? true : false
        
        let title = isIgress ? formatMessage({id:'app.policy.iconfig'}) : formatMessage({id:'app.policy.econfig'})
        let width = isCopy ? 650 : 700
        let bodyStyle = isCopy || isIgress ? {} : {padding: 0}

        const handleOk = () => {
            validateFields((err, fieldsValue) => {
                if(err) {
                    return;
                }
                if(type == "Igress"){
                    if(tabKey == "Basic") {
                        let t = fieldsValue["interlist"];
                        let newt = t.map((i) => {
                            let newi = "X"+(parseInt(i)+1)
                            return newi
                        })
                        igroupInfo.name = fieldsValue["name"]
                        igroupInfo.description = fieldsValue["description"]
                        igroupInfo.interlist = newt
                        igroupInfo.deduplication = fieldsValue["deduplication"]
                        igroupInfo.tuple_mode = fieldsValue["tuple_mode"]
                    }else if(tabKey == "Advanced") {
                        /* 目前还没有 */
                    }
                    okHandle(igroupInfo)
                }
                if(type == "Egress"){
                    if(isCopy){
                        let t = fieldsValue["interlist"];
                        let newt = t.map((i) => {
                            let newi = "X"+(parseInt(i)+1)
                            return newi
                        })
                        cgroupInfo.name = fieldsValue["name"]
                        cgroupInfo.description = fieldsValue["description"]
                        cgroupInfo.interlist = newt
                        cgroupInfo.copyFrom = fieldsValue["copyFrom"]
                        cgroupInfo.copy = 1
                        okHandle(cgroupInfo)
                    }else{
                        if(tabKey == "Basic"){
                            let t = fieldsValue["interlist"]
                            let newt = t.map((i) => {
                                let newi = "X"+(parseInt(i)+1)
                                return newi
                            })
                            egroupInfo.name = fieldsValue["name"]
                            egroupInfo.description = fieldsValue["description"]
                            egroupInfo.interlist = newt
                            egroupInfo.loadbalance = fieldsValue["loadbalance"] ? fieldsValue["loadbalance"] : {mode: "",weight: ""}
                        }else if(tabKey == "Advanced") {
                            let ad = {}
                            ad.gre_encapsulation = fieldsValue["gre_encapsulation"]
                            ad.time_stamping = fieldsValue["time_stamping"]
                            ad.slice = fieldsValue["slicing"]
                            ad.remove_tunnel_header_vlan = fieldsValue["remove"][0].vlan
                            ad.remove_tunnel_header_mpls = fieldsValue["remove"][1].mpls
                            ad.remove_tunnel_header_vxlan = fieldsValue["remove"][2].vxlan
                            ad.remove_tunnel_header_gre = fieldsValue["remove"][3].gre
                            egroupInfo.additional_actions = ad
                        }
                        egroupInfo.copy = 0
                        okHandle(egroupInfo)
                    }     
                }
            });
        };
        
        let tabList = [
            {
                key: 'Basic',
                tab: formatMessage({id:'app.policy.config.basic'}),
            },
            {
                key: 'Advanced',
                tab: formatMessage({id:'app.policy.config.advanced'}),
            }
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
                        <Button key="cancel" onClick={cancelHandle} style={{ width:'63.84px', textAlign: "center", padding: "0 8px"}} >{formatMessage({id:'app.policy.modal.cancel'})}</Button>,
                        <Button key="ok" onClick={handleOk} style={{backgroundColor: '#d0121b', color:'#fff', width:'63.84px', marginLeft: '5px'}}>
                            {formatMessage({id:'app.policy.modal.ok'})}
                        </Button>
                    ] : null}
                >
                    <Spin spinning={confirmLoading}>
                    {
                        isCopy ? 
                        <Form
                            labelCol={{span:4}} 
                            wrapperCol={{span:18}}
                        >
                            <EgressForm {...this.props} groupInfo={cgroupInfo} isCopy={isCopy}></EgressForm>
                        </Form> : 
                            isIgress ? <Form
                                labelCol={{span:4}} 
                                wrapperCol={{span:18}}
                            >
                                <IgressForm {...this.props} groupInfo={igroupInfo}></IgressForm>
                            </Form> : <Card
                                bordered={false}
                                tabList={tabList}
                                activeTabKey={tabKey}
                                onTabChange={this.onTabChange}
                            >
                                <Form
                                    labelCol={{span:5}} 
                                    wrapperCol={{span:18}}
                                >
                                {/* { 
                                    isIgress ? contentIList[tabKey] : contentEList[tabKey]//入接口组暂时没有高级配置
                                } */}
                                    {contentEList[tabKey]}
                                </Form>
                            </Card>
                    }
                    </Spin>
                </Modal>
        )
    }
}