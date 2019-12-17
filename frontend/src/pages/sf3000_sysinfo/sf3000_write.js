import React, {Component} from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { formatMessage } from 'umi/locale'
import { Card, Button, message, Spin } from 'antd'
import { connect } from 'dva'
import sf3000_system from '@/models/sf3000_system';

@connect(({sf3000_system, sf3000_user})=>{
    return {
        currentPerm: sf3000_user.currentPerm
    }
})
export default class ConfigWrite extends Component{
    constructor(props){
        super(props)
        this.state = {
            loading: false
        }
    }

    configWrite = () =>{
        const {dispatch} = this.props
        this.setState({
            loading: true
        })
        dispatch({
            type:  `sf3000_system/saveConfig`
        }).then(()=>{
            message.info(formatMessage({id:"app.system.wcsuccessful"}))
        }).catch(()=>{
            message.info(formatMessage({id:"app.system.wcfail"}))
        }).finally(()=>{
            this.setState({
                loading: false
            })
        })
    }

    render(){
        const {loading} = this.state
        const {currentPerm} = this.props
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
                path: '/configwrite',
                breadcrumbName: formatMessage({id:"app.system.configwrite.breadcrumb"}),
            }
        ];
        let button_status =  currentPerm.configwrite_write === true ? false : true;
        return (
            <PageHeaderWrapper
                breadcrumb={{routes}}
            >
                <Spin spinning={loading}>
                <Card>
                    <div>
                        <Button type='primary' disabled={button_status} onClick={this.configWrite}>{formatMessage({id:"app.system.configwrite"})}</Button>
                    </div>
                </Card>
                </Spin>
            </PageHeaderWrapper>
        )
    }
}