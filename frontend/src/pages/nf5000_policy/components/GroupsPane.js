import react, { Component } from 'react'
import { PageHeaderWrapper, GridContent } from "@ant-design/pro-layout"
import { Card, Row, Col } from 'antd'

export default class GroupsPane extends Component {
    constructor(props){
        super(props)
    }
    render(){
        const { ruleConnectProps } = this.props
        return (
            <Card>
                <GridContent>
                    <Row>
                        <Col span={4}></Col>
                        <Col span={5}>{this.props.igroups}</Col>
                        <Col span={5}>{this.props.ruleconnect}</Col>
                        <Col span={5}>{this.props.egroups}</Col>
                    </Row>
                </GridContent>
            </Card>
        ) 
    }
    
}