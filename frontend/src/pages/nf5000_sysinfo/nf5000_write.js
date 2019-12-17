import React, {Component} from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { formatMessage } from 'umi/locale'
import { Card, Button, message, Spin } from 'antd'
import { connect } from 'dva'
import nf5000_system from '@/models/nf5000_system';

@connect(({nf5000_user})=>{
    return {
        currentPerm: nf5000_user.currentPerm,
      };
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
            type:  `nf5000_system/saveConfig`
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
        const { currentPerm } = this.props;
        let button_status = currentPerm.configwrite_write === true ? false : true;
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
        return (
            <PageHeaderWrapper
                breadcrumb={{routes}}
            >
                <Spin spinning={loading}>
                <Card>
                    <div>
                        <Button disabled={button_status} type='primary' onClick={this.configWrite}>{formatMessage({id:"app.system.configwrite"})}</Button>
                    </div>
                </Card>
                </Spin>
            </PageHeaderWrapper>
        )
    }
}