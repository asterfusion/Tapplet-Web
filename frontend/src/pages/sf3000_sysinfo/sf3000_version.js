import React, {Component} from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { formatMessage } from 'umi/locale'
import { Card } from 'antd'

export default class Version extends Component {
    
    render(){
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
          path: '/version',
          breadcrumbName: formatMessage({id:"app.system.version.breadcrumb"}),
        }
    ];
        return (
            <PageHeaderWrapper
                breadcrumb = {{routes}}
            >
                <Card>
                    <div>
                        <div style={{display: "inline", fontWeight: "bold"}}>{formatMessage({id:"app.version.title"})}</div>
                        <div style={{display: "inline"}}>V1.1.9(date: 2019/12/02, git version:dc8afd55d6c)</div>
                    </div>
                </Card>
            </PageHeaderWrapper>
        )
    }
} 