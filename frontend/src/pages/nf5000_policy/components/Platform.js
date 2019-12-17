import React, { Component } from 'react'
import { Modal, Card, Button, Icon, Upload, Spin, Form, message } from 'antd'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import Port from './Interfaces/Port'
import Panel from './Panel'
import styles from '../nf5000_policy.less'
import { connect } from 'dva';
import FileDown from './download'

@connect(({nf5000_home, nf5000_user, nf5000_policy, nf5000_global,loading})=>{
    return {
        currentPerm: nf5000_user.currentPerm,
        currentPort: nf5000_policy.currentPort,
        currentVppstatus: nf5000_global.currentVppstatus
    }
})
export default class Platform extends Component {

    constructor(props){
        super(props)
        this.state={
            isUpload: false,
            isUploading: false,
            importLoading: false,
        }
    }

    componentDidMount() {
        const {dispatch} = this.props
        dispatch({
            type: "nf5000_user/queryPermiss"
        })
        dispatch({
            type: "nf5000_home/fetchPortinformation"
        })
        dispatch({
            type: "nf5000_home/fetchPortNumber"
        })
        dispatch({
            type: "nf5000_global/fetchVppstatus"
        })
    }
    /**
     * 拖拽添加端口
     */
    handleAddPort = (iteminfo) => {
        const { dispatch, refreshGroups, pageLoadingChange } = this.props
        pageLoadingChange(true)
        dispatch({
            type: 'nf5000_policy/addPort',
            payload: iteminfo
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.addport.success'}))
            pageLoadingChange(false)
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.addport.fail'}))
            pageLoadingChange(false)
        }).finally(()=>{
            refreshGroups()
        })
    }

    /**
     * 是否导入配置
     */
    handleIsUpload = (flag) => {
        this.setState({
            isUpload: flag
        })
    }
    /**
     * 清空配置
     */
    handleDeleteAllPolicy = () => {
        const { dispatch, refreshGroups, refreshRuleConnect, pageLoadingChange } = this.props
        pageLoadingChange(true)
        dispatch({
            type: 'nf5000_policy/deleteAllPolicy'
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.clear.success'}))
            pageLoadingChange(false)
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.clear.fail'}))
            pageLoadingChange(false)
        }).finally(()=>{
            refreshGroups()
            refreshRuleConnect()
        })
    }

    render(){
        const { currentPortinformation, currentPerm, currentPort, handleIsEditEGroup, pageLoadingChange,
                clearContent, importContent, exportContent,
                refreshGroups, refreshRuleConnect, currentVppstatus} = this.props
        const canWrite = (currentPerm["policy_write"] && currentVppstatus === "RUNNING")
        const { isUpload, isUploading, importLoading } = this.state

        const portProps = {
            isAddPort: this.handleAddPort, isEditEGroup: handleIsEditEGroup, canWrite: (currentPerm["policy_write"] && currentVppstatus === "RUNNING"),
            currentVppstatus: currentVppstatus
        }
        //导入配置
        const uploadProps = {
            name: 'file', action:'/api/policy/SystemConfigHandler', accept: '.gz', name: 'shm_config', showUploadList: false,
            onChange: (file) => {
                if(file.file.status == 'uploading'){
                    this.setState({
                        isUploading: true,
                        importLoading: true
                    })
                }
                if(file.file.status == 'error'){
                    message.error(formatMessage({id:'app.policy.msg.import.fail'}))
                    this.setState({
                        isUpload: false,
                        isUploading: false,
                        importLoading: false
                    })
                }
                if(file.file.status == 'done'){
                    message.success(formatMessage({id:'app.policy.msg.import.success'}))
                    refreshGroups()
                    refreshRuleConnect()
                    this.setState({
                        isUpload: false,
                        isUploading: false,
                        importLoading: false
                    })
                }
            }
        }
        const isUploadProps = {
            modalVisible: isUpload, cancelHandle: this.handleIsUpload.bind(this,false), uploadProps: uploadProps, 
            canWrite: (currentPerm["policy_write"] && currentVppstatus === "RUNNING"), isUploading: isUploading, importLoading: importLoading
        }
        const policyButtonProp = {
            handleDeleteAllPolicy: this.handleDeleteAllPolicy, handleIsUpload: this.handleIsUpload, 
            clearContent, importContent, exportContent, canWrite: (currentPerm["policy_write"] && currentVppstatus === "RUNNING")
        }

        return (
            <>
            <Card >
                    <div className={styles.container}>
                        <div className={styles.platwrapper}>
                            <Panel  portProps={portProps} />
                        </div>
                        <div className={styles.icons}>
                            <Legend />
                        </div>
                        <div >
                            <PolicyButton {...policyButtonProp}/>
                        </div>
                    </div> 
                </Card>
                {
                    isUpload ? <IsUpload {...isUploadProps}></IsUpload> : null
                }
                </>
        )
    }
}


//Platform内小组件
class IsUpload extends Component {

    render(){
        const { modalVisible, cancelHandle, uploadProps, canWrite, isUploading, importLoading } = this.props
        return (
            <Modal
                title={formatMessage({id:'app.policy.import.title'})}
                visible={modalVisible}
                onCancel={cancelHandle}
                maskClosable={false}
                closable={isUploading ? false : true}
                footer={[
                    <Button key="cancel" onClick={cancelHandle} disabled={isUploading} style={{marginRight: '5px'}} >{formatMessage({id:'app.policy.import.cancel'})}</Button>,
                    <Upload key="upload" {...uploadProps} disabled={!canWrite || isUploading}>
                        <Button disabled={!canWrite || isUploading} style={isUploading ? {backgroundColor: '#ccc',color:'#fff', marginLeft: '5px'} : {backgroundColor: '#5c7cb3',color:'#fff', marginLeft: '5px'}}>
                            {formatMessage({id:'app.policy.import.upload'})}
                        </Button>
                    </Upload>
                ]}
            >
                <Spin spinning={importLoading}>{formatMessage({id:'app.policy.import.content'})}</Spin>   
            </Modal>
        )
    }
}

class Legend extends Component {
    render(){
        return (
            <>
            <div className={styles.icon_left}></div>
            <div className={styles.word_left}>{formatMessage({id:'app.policy.icon.up'})}</div>
            <div className={styles.icon_right}></div>
            <div className={styles.word_right}>{formatMessage({id:'app.policy.icon.down'})}</div>
            </>
        )
    }
}

class PolicyButton extends Component {

    render(){
        const { handleDeleteAllPolicy, handleIsUpload, clearContent, importContent, exportContent, canWrite } = this.props
        return (
            <>
            <div className={styles.inoutwrapper}>
                <Button className={styles.inout} onClick={ handleDeleteAllPolicy } style={canWrite ? {} : {backgroundColor: "white", border:".5px solid #ccc", color:"#aeaeae"}} disabled={!canWrite}>{clearContent}</Button>
                <Button className={styles.inout} onClick={ handleIsUpload.bind(this,true) } style={canWrite ? {} : {backgroundColor: "white", border:".5px solid #ccc", color:"#aeaeae"}} disabled={!canWrite}>
                        <Icon type="upload" />
                        {importContent}
                </Button>
                <FileDown  api_url={'/api/policy/SystemConfigHandler'} text={exportContent} style={canWrite ? {} : {backgroundColor: "white", border:".5px solid #ccc", color:"#aeaeae"}} disabled={!canWrite}></FileDown>
            </div>
            </>
        )
    }
}