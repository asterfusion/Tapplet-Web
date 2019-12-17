import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Button, Form, Table, Icon, Modal, Pagination, message,Spin } from 'antd'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import styles from '../nf5000_statistics.less'
import Trend from './Trend'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

@connect(({nf5000_statistics, loading})=>{
    return {
        currentTrendData: nf5000_statistics.currentTrendData,
        queryingTrend: loading.effects['nf5000_statistics/queryTrendData'],
    }
})
export default class StatisticsTable extends Component {
    constructor(props){
        super(props)
        this.hourRowTitle = ["time","drop_packets", "in_packets", "out_packets", "in_pps", "out_pps", "in_bps", "out_bps",  
                "in_octets", "out_octets"]
        this.dayRowTitle = ["time","max_in_pps", "ave_in_pps", "min_in_pps",  "max_out_pps","ave_out_pps", "min_out_pps",  
                "max_in_bps","ave_in_bps", "min_in_bps", "max_out_bps", "ave_out_bps", "min_out_bps"]
        this.state = {
            columns: [],
            tableData: [],
            trendData: [],
            isTrend: false,
            trendLoading: false,
            refreshKey: 0
        }
    }
    componentDidMount(){
        const { scale, dataSource } = this.props
        const { columns } = this.state
        if(scale == "hour"){
            this.hourRowTitle.map((i,index)=>{
                if(i=="time"){
                    columns.push({
                        align: 'left',
                        title: i,
                        dataIndex: i,
                        key: "time",
                        width: 150,
                        fixed: 'left'
                    })
                }else{
                    columns.push({
                        align: 'left',
                        title: i,
                        dataIndex: i,
                        key: index,
                    })
                }
                
            })  
        }else if(scale == "day"){
            this.dayRowTitle.map((i,index)=>{
                if(i=="time"){
                    columns.push({
                        align: 'left',
                        title: i,
                        dataIndex: i,
                        key: "time",
                        width: 100,
                        fixed: 'left'
                    })
                }else if(index == this.dayRowTitle.length - 1){
                    columns.push({
                        align: 'left',
                        title: i,
                        dataIndex: i,
                        key: index,
                    })
                }else{
                    columns.push({
                        align: 'left',
                        title: i,
                        dataIndex: i,
                        key: index,
                        width: 120
                    })
                }
                
            })
        }
        this.setState({
            columns: columns
        })
        if(Object.keys(dataSource).length !== 0){
            dataSource["data"].map((i,index)=>{
                i["key"] = index
            })
            this.setState({
                tableData: dataSource["data"]
            })
        }
    }

    componentDidUpdate(prevProps){
        const { scale, dataSource, currentTrendData } = this.props
        const { isTrend } = this.state
        let columns = []
        if(prevProps.scale !== scale){
            if(scale == "hour"){
                this.hourRowTitle.map((i,index)=>{
                    if(i=="time"){
                        columns.push({
                            align: 'left',
                            title: i,
                            dataIndex: i,
                            key: "time",
                            width: 150,
                            fixed: 'left'
                        })
                    }else{
                        columns.push({
                            align: 'left',
                            title: i,
                            dataIndex: i,
                            key: index,
                        })
                    }
                })  
            }else if(scale == "day"){
                this.dayRowTitle.map((i,index)=>{
                    if(i=="time"){
                        columns.push({
                            align: 'left',
                            title: i,
                            dataIndex: i,
                            key: "time",
                            width: 100,
                            fixed: 'left'
                        })
                    }else if(index == this.dayRowTitle.length - 1){
                        columns.push({
                            align: 'left',
                            title: i,
                            key: index,
                            dataIndex: i
                        })
                    }else{
                        columns.push({
                            align: 'left',
                            title: i,
                            dataIndex: i,
                            key: index,
                            width: 120
                        })
                    }
                })
            }
            this.setState({
                columns: columns
            })
        }

       /**
         * 获取表格数据tableData
        *////////////////////////////////////////////////////////////
        if((this.state.refreshKey == 0 && !isEmpty(dataSource)) || !isEqual(prevProps.dataSource, dataSource)){
            dataSource["data"].map((i,index)=>{
                i["key"] = index
            })
            this.setState({
                tableData: dataSource["data"],
                refreshKey: this.state.refreshKey + 1
            })
        }
        /**
         * 获取趋势数据trendData
         */
        if(isTrend){
            if(!isEqual(prevProps.currentTrendData,currentTrendData)){
                this.setState({
                    trendData: currentTrendData["data"]
                })
            }
        }
    }
    /**
     * 查询趋势回调函数
     */
    handleTrendQuery = (flag,scale) => {
        const { dispatch, queryPayload, currentPage } = this.props
        this.setState({
            trendLoading: true
        })
        queryPayload["page"] = currentPage
        dispatch({
            type: "nf5000_statistics/queryTrendData",
            payload: queryPayload
        }).then((res)=>{
            this.setState({
                trendLoading: false
            })
        }).catch((err)=>{
            this.setState({
                trendLoading: false
            })
        })
        
        this.setState({
            isTrend: flag
        })
    }
    /**
     * 改变趋势Loading状态
     */
    handleChangeTrendLoading = (flag) => {
        this.setState({
            trendLoading: flag
        })
    }


    render(){
        const { currentTrendData, queryingTrend , scale, object, dataSource, currentPage, changePage, totalData, queryPayload } = this.props
        const { columns, tableData, trendData, isTrend, trendLoading } = this.state
        const pageSize = scale == "day" ? 30 : 24
        const paginationProps = {
            onChange: changePage, current: currentPage, pageSize: pageSize, total: totalData
        } 
        const trendProps = {
            dataSource: trendData, scale: scale, currentPage: currentPage, totalData: totalData, queryPayload: queryPayload, handleChangeTrendLoading: this.handleChangeTrendLoading
        }
        return (
            <>
                <Card>
                    <Button className={styles.trendbtn} onClick={this.handleTrendQuery.bind(this,true,scale)}><Icon type="line-chart" /></Button>
                    <Table
                        scroll={{ x: 1500 }}
                        className={styles.datatable}
                        columns={columns}
                        dataSource={tableData}
                        bordered={true}
                        pagination={false}
                        size="small"
                    ></Table>
                    <Pagination className={styles.pagination} {...paginationProps} hideOnSinglePage/>
                </Card>
                {
                    isTrend  ? 
                    <Modal 
                        width={1270}
                        title={object}
                        visible={isTrend}
                        footer={null}
                        onCancel={this.handleTrendQuery.bind(this,false)}
                    ><Spin spinning={trendLoading}><Trend {...trendProps}/></Spin></Modal> : null
                }
            </>
        )
    }
}