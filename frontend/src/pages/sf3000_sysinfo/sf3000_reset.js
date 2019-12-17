import React, {Component} from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { formatMessage } from 'umi/locale'
import { Card, Button, Modal, Spin, message} from 'antd'
import {connect} from 'dva'
import sf3000_system from '@/models/sf3000_system';


@connect(({sf3000_system,sf3000_user})=>{
    return {
        currentPerm: sf3000_user.currentPerm
    }
})
export default class ConfigWrite extends Component{
    constructor(props){
        super(props)
        this.state = { 
            ModalVisible: false,
            loading: false
        }

    }

    showModal = () =>{
        console.log("zzzzzzzzzzzzzzzzzzzzzzzz")
        this.setState({
            ModalVisible: true
        })
    }

    okCancel = () => {
        this.setState({
            ModalVisible: false
        })
    }

    okHandle = () => {
        const {dispatch} = this.props
        this.setState({
            loading: true
        })
        dispatch({
            type: `sf3000_system/resetConfig`
        }).then(()=>{
            message.info(formatMessage({id:"app.system.resetsuccessful"}))
        }).catch(()=>{
            message.info(formatMessage({id:"app.system.resetfail"}))
        }).finally(()=>{
            this.setState({
                ModalVisible: false,
                loading: false
            })
        })
    } 


    render(){
        const {ModalVisible, loading} = this.state
        const {currentPerm} = this.props
        let button_status =  currentPerm.configreset_write === true ? false : true;
        const routes = [
            {
                path: '/',
                breadcrumbName: formatMessage({id:"menu.home"}),
            },
            {
                path: 'system',
                breadcrumbName: formatMessage({id:"app.system.breadcrumb"}),
            },
            {
                path: '/configreset',
                breadcrumbName: formatMessage({id:"app.system.configreset.breadcrumb"}),
            }
        ];
        return (
            <PageHeaderWrapper
                breadcrumb={{routes}}
            >
                <Spin spinning={loading}>
                <Card>
                    <div>
                        <Button type='primary' disabled={button_status}  onClick={this.showModal}>{formatMessage({id:"app.system.configreset"})}</Button>
                    </div>
                    <Modal 
                        title={formatMessage({id:"app.system.resetnotice"})}
                        visible={ModalVisible}
                        onCancel={this.okCancel}
                        onOk={this.okHandle}
                    >
                    <Spin spinning={loading}>
                        {formatMessage({id:"app.system.configresetinfo"})}
                    </Spin>
                    </Modal> 
                </Card>
                </Spin>
            </PageHeaderWrapper>
        )
    }
}