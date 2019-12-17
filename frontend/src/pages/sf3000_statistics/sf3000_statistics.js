import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, TreeSelect, DatePicker, Button, Switch, Form, Table, Icon, Modal, Pagination, message, Spin, Col } from 'antd'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import styles from './sf3000_statistics.less'
import StatisticsTable from './components/StatisticsTable'
import moment from 'moment'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
const { TreeNode } = TreeSelect
const { RangePicker } = DatePicker


/**
 * 获取系统当前时间，及24小时前的时间
 * @param {string} str 
 */
function getTime(str){
    let date = new Date()
    let year, month, day, hours, minutes, seconds
    let endDate
    year = date.getFullYear()
    month = date.getMonth()+1
    day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate()
    hours = date.getHours() < 10 ? "0"+date.getHours() : date.getHours()
    minutes = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()
    endDate = year + "-" + month + "-" + day + "T" + hours + ":" + minutes 
    if(str == "end"){
        return endDate.replace("T"," ")
    }else if(str == "start"){
        let s = Date.parse(endDate) - 24*60*60*1000
        let sd = new Date(s)
        let dateArr = sd.toLocaleDateString('zh-CN').split("/"), d = ""
        dateArr.map((i,index)=>{
            if(parseInt(i)<10) i = "0"+i
            if(index!==dateArr.length-1){
                d += i
                d += "-"
            }else{
                d += i
            }
        })
        let time = sd.toLocaleTimeString('en-US').split(" ")[0], t = ""
        let aorp = sd.toLocaleTimeString('en-US').split(" ")[1]
        let timeArr = time.split(":")
        timeArr.pop()
        if(aorp == "AM"){
            if(timeArr[0]<10){
                timeArr[0] = "0" + timeArr[0]
            }
        }else if(aorp == "PM"){
            if(parseInt(timeArr[0]) !== 12){
                timeArr[0] = (parseInt(timeArr[0]) + 12).toString()
            }else {
            }
        }
        timeArr.map((i,index)=>{
            if(index!==timeArr.length-1){
                t += i
                t += ":"
            }else{
                t += i
            }
        })
        return d + " " + t
    }   
}


@connect(({sf3000_user, sf3000_statistics, loading})=>{
    return {
        currentGroupName: sf3000_statistics.currentGroupName,
        currentPerm: sf3000_user.currentPerm,
        currentStatisticsData: sf3000_statistics.currentStatisticsData,
        queryingGroupName: loading.effects['sf3000_statistics/queryGroupName'],
    }
})
export default class InterfaceStatisticsPage extends Component {
    constructor(props){
        super(props)
        this.interfaces = []
        this.ingroup = []
        this.outgroup = []
        this.state = {
            queryPayload: {
                object: "",
                otype: "",
                time: [],
                scale: "hour"
            },
            starttime: null,
            endtime: null,
            defaultTimeRange: [],
            defaultTimeRangeSend: [],
            isQuery: false,
            isRealTime: false,
            currentPage: 1,
            totalData: 0,
            loading: false,
            refreshKey: 0
        }
    }
    componentDidMount(){
        const { dispatch } = this.props
        dispatch({
            type: 'sf3000_statistics/queryGroupName'
        })
        /**
         * 获取默认时间间隔
         */
        let endDateSend = getTime("end")
        let startDateSend = getTime("start")
        let endDate = moment(endDateSend)
        let startDate = moment(startDateSend)
        this.setState({
            defaultTimeRange: [startDate, endDate],
            defaultTimeRangeSend: [startDateSend, endDateSend]
        })//默认当前时间往前的24条数据
        for(let i = 1 ; i <= 48 ; i++){
            this.interfaces.push({title:"X"+i,value:"p_X"+i})
        }
    }
    componentDidUpdate(prevProps, prevState){
        const { currentGroupName, currentStatisticsData } = this.props
        const { defaultTimeRange, defaultTimeRangeSend, queryPayload, refreshKey } = this.state
        const { object, otype, time, scale } = queryPayload
        if((refreshKey == 0 && !isEmpty(currentGroupName)) || (!isEqual(prevProps.currentGroupName, currentGroupName) && currentGroupName.status_code == 200)){
            currentGroupName.data["ingroup"].map((i)=>{
                this.ingroup.push({title:i,value:"i_"+i})
            })
            currentGroupName.data["outgroup"].map((i)=>{
                this.outgroup.push({title:i,value:"e_"+i})
            })
            this.setState({
                refreshKey: refreshKey + 1
            })
        }
        if(!isEqual(prevProps.currentStatisticsData, currentStatisticsData)){
            this.setState({
                totalData: this.props.currentStatisticsData["dataNum"]
            })
        }
        /**
         * 更新默认时间间隔
         */
        if(!isEqual(prevState.defaultTimeRange, defaultTimeRange)){
            this.setState({
                starttime: defaultTimeRange[0],
                endtime: defaultTimeRange[1]
            })
            this.setState({
                queryPayload: {
                    object,
                    otype,
                    time: defaultTimeRangeSend,
                    scale,
                }
            })
        }
    }
    /**
     * 选择器变化
     */
    handleObjectSelect = (value, label, extra) => {
        const { object, otype, time, scale } = this.state.queryPayload
        let t = value.split("_")[0]
        let v = value.split("_")[1]
        if(t=="p"){
            t = "port"
        }else if(t=="i"){
            t = "ingroup"
        }else if(t=="e"){
            t = "outgroup"
        }
        this.setState({
            queryPayload: {
                object: v,
                otype: t,
                time,
                scale,
            }
        })
    }
    /**
     * 时间选择器变化
     */
    handleStartTimeSelect = (dates, dateStrings) => {
        const { object, otype, time, scale } = this.state.queryPayload
        if(dateStrings == ""){
            message.info(formatMessage({id:'app.statistics.msg.queryall.warning'}))
        }
        time[0] = dateStrings
        this.setState({
            queryPayload: {
                object,
                otype,
                time,
                scale,
            },
            starttime: dates
        })
    }
    handleEndTimeSelect = (dates, dateStrings) => {
        const { object, otype, time, scale } = this.state.queryPayload
        if(dateStrings == ""){
            message.info(formatMessage({id:'app.statistics.msg.queryall.warning'}))
        }
        time[1] = dateStrings
        this.setState({
            queryPayload: {
                object,
                otype,
                time,
                scale,
            },
            endtime: dates
        })
    }
    /**
     * 单位变化
     */
    handleScaleSelect = (checked, e) => {
        const { object, otype, time, scale } = this.state.queryPayload
        const { dispatch } = this.props
        const { isQuery, currentPage } = this.state
        let s = checked ? "day" : "hour"
        this.setState({
            queryPayload: {
                object,
                otype,
                time,
                scale: s,
            }
        })
        if(isQuery){
            this.setState({
                loading: true
            })
            dispatch({
                type: "sf3000_statistics/queryStatistics",
                payload: {object:object,otype:otype,time:time,scale:s,page:currentPage,real_time:0}
            }).then((res)=>{
                this.setState({
                    loading: false
                })
            }).catch((err)=>{
                this.setState({
                    loading: false
                })
            })
        }
    }
    /**
     * 查询回调函数
     */
    handleQuery = () => {
        const { dispatch } = this.props
        const { queryPayload, currentPage } = this.state
        const { object, otype, time, scale } = queryPayload

        if(time[0] == "" || time[1] == ""){
            queryPayload["time"]=[]
        }
        queryPayload["real_time"] = 0
        queryPayload["page"] = 1
        this.setState({
            currentPage: 1,
            isRealTime: false
        })
        if(object !== "" && time.length > 0){
            this.setState({
                loading: true
            })
            //做表单验证
            dispatch({
                type: "sf3000_statistics/queryStatistics",
                payload: queryPayload
            }).then((res)=>{
                if(res.code == 200) {
                    message.success(formatMessage({id:'app.statistics.msg.query.success'})) 
                }
                this.setState({
                    isQuery: true,
                    loading: false
                })
            }).catch((err)=>{
                message.error(formatMessage({id:'app.statistics.msg.query.fail'}))
                this.setState({
                    loading: false
                })
            })
        }else {
            message.warning(formatMessage({id:'app.statistics.msg.query.warning'}))
        }
    }
    /**
     * 查询实时数据
     */
    handleQueryRealTime = () => {
        const { dispatch } = this.props
        const { queryPayload, currentPage } = this.state
        const { object, otype, time, scale } = queryPayload
        if(time[0] == "" || time[1] == ""){
            queryPayload["time"]=[]
        }
        queryPayload["real_time"] = 1
        queryPayload["page"] = 1
        queryPayload["scale"] = "hour"
        this.setState({
            currentPage: 1,
            isRealTime: true,
            queryPayload: {
                object,
                otype,
                time,
                scale: "hour",
            }
        })
        if(object !== ""){
            this.setState({
                loading: true
            })
            //做表单验证
            dispatch({
                type: "sf3000_statistics/queryStatistics",
                payload: queryPayload
            }).then((res)=>{
                if(res.code == 200) {
                    message.success(formatMessage({id:'app.statistics.msg.query.success'})) 
                }
                this.setState({
                    isQuery: true,
                    loading: false
                })
            }).catch((err)=>{
                message.error(formatMessage({id:'app.statistics.msg.query.fail'}))
                this.setState({
                    loading: false
                })
            })
        }else {
            message.warning(formatMessage({id:'app.statistics.msg.query.warning'}))
        }
    }
    /**
     * 翻页回调函数
     */
    handleChangePage = (page,pageSize) => {
        const { dispatch } = this.props
        const { queryPayload } = this.state
        this.setState({
            currentPage: page,
            loading: true
        })
        queryPayload["page"] = page
        dispatch({
            type: "sf3000_statistics/queryStatistics",
            payload: queryPayload
        }).then(()=>{
            this.setState({
                loading: false
            })
        }).catch(()=>{
            this.setState({
                loading: false
            })
        })
    }

    render(){
        const { currentStatisticsData, queryingGroupName } = this.props
        const { queryPayload, isQuery, isRealTime, starttime, endtime, currentPage, totalData, loading, defaultTimeRange } = this.state
        const { object, otype, time, scale } = queryPayload
        const treeData = [{
            title: formatMessage({id:'app.statistics.object.igress'}),
            value: "igress",
            selectable: false,
            children: this.ingroup
        },{
            title: formatMessage({id:'app.statistics.object.egress'}),
            value: "egress",
            selectable: false,
            children: this.outgroup
        },{
            title: formatMessage({id:'app.statistics.object.interface'}),
            value: "interface",
            selectable: false,
            children: this.interfaces
        }]

        //TreeSelect的Value转换
        let treeSelectValue = ""
        if(otype=="port"){
            treeSelectValue = "p_"+object
        }else if(otype=="ingroup"){
            treeSelectValue = "i_"+object
        }else if(otype=="outgroup"){
            treeSelectValue = "e_"+object
        }

        const disabledDate = (current) => {
            return current && current < moment().subtract(1, "month") 
        }

        const StatisticsTableProps = {
            scale: scale, object: object, dataSource: currentStatisticsData, queryPayload: queryPayload, 
            totalData: totalData, currentPage: currentPage, changePage: this.handleChangePage, isRealTime: isRealTime
        }

        const routes = [
            {
              path: 'welcome',
              breadcrumbName: formatMessage({id:"menu.home"}),
            },
            {
              path: 'statistics',
              breadcrumbName: formatMessage({id:"app.statistics.breadcrumb"}),
            },
        ];

        return (
            <PageHeaderWrapper
                breadcrumb = {{routes}}
            >
                <Spin spinning={queryingGroupName || loading}>
                <Card>
                    <div style={{display:"inline-box"}}>
                        <div className={styles.query}> 
                            <div className={styles.object}>
                                <div className={styles.objectlabel} style={localStorage.getItem("umi_locale") == "zh-CN"? {} : {width: 108}}>{formatMessage({id:'app.statistics.object'})}:</div>
                                <div><TreeSelect 
                                    dropdownStyle={{maxHeight: 300}}
                                    style={{width:175}}
                                    treeData={treeData}
                                    value={treeSelectValue}
                                    onChange={this.handleObjectSelect}
                                    showSearch
                                    searchPlaceholder={formatMessage({id:'app.statistics.object.placeholder'})}
                                ></TreeSelect></div>
                            </div>
                            <div className={styles.time}>
                                <div className={styles.timelabel}>{formatMessage({id:'app.statistics.time'})}:</div>
                                <div>
                                    <DatePicker
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD HH:mm"
                                        disabledDate={disabledDate}
                                        style={{ width: 150, marginRight: 10 }}
                                        placeholder={formatMessage({id:'app.statistics.starttime'})}
                                        onChange={this.handleStartTimeSelect}
                                        value={starttime}
                                    />
                                    {"-"}
                                    <DatePicker
                                        showTime={{ format: 'HH:mm' }} 
                                        format="YYYY-MM-DD HH:mm"
                                        disabledDate={disabledDate}
                                        style={{ width: 150, marginLeft: 10 }}
                                        placeholder={formatMessage({id:'app.statistics.endtime'})}
                                        onChange={this.handleEndTimeSelect}
                                        value={endtime}
                                    />
                                </div>
                            </div>
                            <div className={styles.btnwrapper1} style={localStorage.getItem("umi_locale") == "zh-CN"? {} : {width: "298px"}}>
                                <Button className={styles.querybutton} onClick={this.handleQuery}>{formatMessage({id:'app.statistics.query'})}</Button>
                                <Button className={styles.querybutton} onClick={this.handleQueryRealTime}>{formatMessage({id:'app.statistics.queryrealtime'})}</Button>
                                <Button className={styles.export}>
                                    <a href="/api/statistics/export" download="statistics">
                                        {formatMessage({id:'app.statistics.export'})}
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className={styles.scale1} style={{float: "right"}}>
                                <div className={styles.scalelabel}>{formatMessage({id:'app.statistics.scale'})}:</div>
                                <div><Switch style={{margin: "0 0 3px 0"}}
                                    checkedChildren={formatMessage({id:'app.statistics.scale.option1'})} 
                                    unCheckedChildren={formatMessage({id:'app.statistics.scale.option2'})} 
                                    checked={scale == "hour" ? false : true}
                                    onChange={isRealTime ? ()=>{} : this.handleScaleSelect}
                                ></Switch></div>
                        </div>
                    </div>
                    <div style={{display:"inline-box"}}>
                        <div className={styles.btnwrapper2} style={localStorage.getItem("umi_locale") == "zh-CN"? {} : {width: "298px"}}>
                            <Button className={styles.querybutton} onClick={this.handleQuery}>{formatMessage({id:'app.statistics.query'})}</Button>
                            <Button className={styles.querybutton} onClick={this.handleQueryRealTime}>{formatMessage({id:'app.statistics.queryrealtime'})}</Button>
                            <Button className={styles.export}>
                                <a href="/api/statistics/export" download="statistics">
                                    {formatMessage({id:'app.statistics.export'})}
                                </a>
                            </Button>
                        </div>
                        <div className={styles.scale2} style={{float: "right"}}>
                                <div className={styles.scalelabel}>{formatMessage({id:'app.statistics.scale'})}:</div>
                                <div><Switch style={{margin: "0 0 3px 0"}}
                                    checkedChildren={formatMessage({id:'app.statistics.scale.option1'})} 
                                    unCheckedChildren={formatMessage({id:'app.statistics.scale.option2'})} 
                                    checked={scale == "hour" ? false : true}
                                    onChange={isRealTime ? ()=>{} : this.handleScaleSelect}
                                ></Switch></div>
                        </div>
                    </div>
                </Card>
                {
                    isQuery ? <StatisticsTable {...StatisticsTableProps}/> : null
                }
                </Spin>
            </PageHeaderWrapper>
        )
    }
}


