import {Button, Card, message, Spin,Modal} from 'antd'
import React, { Component} from 'react'
import { connect } from "dva"
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { tsConstructSignatureDeclaration } from '@babel/types';
import styles from './nf5000_setting.less'

@connect(({nf5000_global, nf5000_user, loading})=>{
    return {
        currentVppstatus: nf5000_global.currentVppstatus,
        currentPerm: nf5000_user.currentPerm,
    }
})
export default class GlobalConfig extends Component{
    constructor(props){
        super(props)
        this.state = {
            startloading: false,
            stoploading: false,
            modalStartVisible:false,
            modalStopVisible:false,
            
        }
    }

    componentDidMount() {
        const {dispatch} = this.props
        dispatch({
            type: "nf5000_global/fetchVppstatus"
        })
    }

    buttonStart = () => {
        const { dispatch } = this.props
        this.setState({
            startloading: true,
            modalStartVisible:false
        })
        dispatch({
            type: 'nf5000_global/setVppstatus',
            payload: {"op": "start"}
        }).then((res)=>{
            message.info(formatMessage({id:"app.start.successfully"}))
        }).catch((res)=>{
            message.info(formatMessage({id:"app.start.failed"}))
        }).finally(()=>{
            dispatch({
                type: "nf5000_global/fetchVppstatus"
            })
            this.setState({
                startloading: false
            })
        })
    }

    buttonStop = () => {
        const { dispatch } = this.props
        this.setState({
            stoploading: true,
            modalStopVisible:false
        })
        dispatch({
            type: 'nf5000_global/setVppstatus',
            payload: {"op": "stop"}
        }).then((res)=>{
            message.info(formatMessage({id:"app.stop.successfully"}))
        }).catch((res)=>{
            message.info(formatMessage({id:"app.stop.failed"}))
        }).finally(()=>{
            dispatch({
                type: "nf5000_global/fetchVppstatus"
            })
            this.setState({
                stoploading: false
            })
        })
    }

    changeModalStatus = (type,status,obj) =>{
        if(type=='stop'){
            this.setState({
            modalStopVisible:status
        })
        }else{
            this.setState({
            modalStartVisible:status
        }) 
        }
        
    }
    
    render(){
        const {currentVppstatus, currentPerm} = this.props
        const {startloading, stoploading,modalStopVisible,modalStartVisible} = this.state

        let showStatus = currentVppstatus == "RUNNING" ? "app.vpp.up" : "app.vpp.down"
        const button_status =  this.props.currentPerm.setting_write === true ? false : true;
        const routes = [
            {
              path: '/',
              breadcrumbName: formatMessage({id:"menu.home"}),
            },
            {
              path: 'business',
              breadcrumbName: formatMessage({id:"app.bussiness.breadcrumb"}),
            },
            {
              path: '/setting',
              breadcrumbName: formatMessage({id:"app.bussiness.setting.breadcrumb"}),
            }
          ];

        return(
            <PageHeaderWrapper breadcrumb={{ routes }}>
                <Spin spinning={startloading || stoploading}>
                <Card>
                    <div>
                        <div style={{ display: 'inline', fontWeight: 'bold' }}>
                            {formatMessage({id:"app.vpp.status"})}
                        </div>
                        <div style={{ display: 'inline', marginLeft: 10, fontWeight: 'bold' }}>
                            {formatMessage({id:showStatus})}
                        </div>
                        <Button
                            type="primary"
                            className={styles.button1}
                            // onClick={this.buttonStart}
                            onClick={this.changeModalStatus.bind(this,'start',true)}
                            disabled={button_status}
                        >
                            {formatMessage({ id: 'app.button.start' })}
                        </Button>
                        <Button
                            type="primary"
                            className={styles.button2}
                            // onClick={this.buttonStop}changeModalStatus
                             onClick={this.changeModalStatus.bind(this,'stop',true)}
                            disabled={button_status}
                        >
                            {formatMessage({ id: 'app.button.stop' })}
                        </Button>
                    </div>
                </Card>
                <Modal 
                title={formatMessage({'id':'app.bussiness.vpp.config'})}
                visible={modalStartVisible}
                onCancel={this.changeModalStatus.bind(this,'start',false)}
                onOk = {this.buttonStart}
                >
                {formatMessage({'id':'app.bussiness.vpp.start.confirm'})}
                </Modal>
                <Modal 
                title={formatMessage({'id':'app.bussiness.vpp.config'})}
                visible={modalStopVisible}
                onCancel={this.changeModalStatus.bind(this,'stop',false)}
                onOk = {this.buttonStop}
                >
                {formatMessage({'id':'app.bussiness.vpp.confirm'})}
                </Modal>
                </Spin>
            </PageHeaderWrapper>
        )

    }
}

