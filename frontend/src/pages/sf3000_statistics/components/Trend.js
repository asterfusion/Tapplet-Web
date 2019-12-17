import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { message, Select } from 'antd'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import styles from '../sf3000_statistics.less'
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Shape,
    Facet,
    Util,
  } from 'bizcharts'
import isEqual from 'lodash/isEqual'

var RATIO = 1
function pick(data, field) {
    return data.map(function(item) {
      var result = {};

      for (var key in item) {
        if (item.hasOwnProperty(key) && field.indexOf(key) !== -1) {
          result[key] = item[key];
        }
      }

      return result;
    });
}

@connect()
export default class Trend extends Component {
    constructor(props){
        super(props)
        this.state={
            newDataSource: [],
            data: [],
            datatimes: [],
            canZoom: false,
            localScale: "",
            selectedValue: ["bps"],
            chartInfo: {
                data: ["time","bps","bpsflag"],
                yaxis_name: "bps",
                geom_position: "time*bps",
                color: ["bpsflag",['#11B0FF', '#51DEFF', '#97EDFF', '#FF6836', '#F99A36', '#FFC15A']]
            },
            refreshKey:0
        }
    }
    /**
     * 滚动回调函数
     */
    _handleWheel = (e) => {
        const { dataSource, queryPayload, dispatch, scale, totalData, handleChangeTrendLoading } = this.props
        const { canZoom, localScale } = this.state
        console.log("在趋势图中滚动：",e)
        if(canZoom){
            //更新画图数据
            if(e.deltaY < 0){
                //zoom out
                RATIO++
                if(scale == "hour"){
                    if(RATIO <= 3){
                        this.setState({
                            localScale: "hour"
                        })
                        this.dataFilter(dataSource,RATIO)
                    }else{
                        RATIO = 3
                        if(totalData > 48){
                            this.setState({
                                localScale: "day"
                            })
                            queryPayload["scale"] = "day"
                            dispatch({
                                type: "sf3000_statistics/queryTrendData",
                                payload: queryPayload 
                            })
                        }else{
                            this.setState({
                                localScale: "hour"
                            })
                            this.dataFilter(dataSource,RATIO)
                        }
                    }    
                }
            }else if(e.deltaY > 0){
                //zoom in
                if(scale == "hour" && localScale == "day"){
                    handleChangeTrendLoading(true)
                    this.setState({
                        canZoom: false
                    })
                    queryPayload["scale"] = "hour"
                    dispatch({
                        type: "sf3000_statistics/queryTrendData",
                        payload: queryPayload 
                    }).then(() => {
                        handleChangeTrendLoading(false)
                        this.setState({
                            canZoom: true
                        })
                    }).catch(() => {
                        handleChangeTrendLoading(false)
                        this.setState({
                            canZoom: true
                        })
                    })
                    this.setState({
                        localScale: "hour"
                    })
                }else if(scale == "hour" && localScale == "hour"){
                    RATIO--
                    if(RATIO >= 1){
                        this.dataFilter(dataSource,RATIO)
                    }else{
                        RATIO = 1
                    }
                }
            }
        }
    }
    componentDidMount(){
        document.addEventListener('wheel',this._handleWheel)
        this.setState({
            localScale: this.props.scale
        })
    }
    componentWillUnmount(){
        document.removeEventListener('wheel', this._handleWheel)
    }
    componentDidUpdate(prevProps,prevState){
        const { scale, dataSource } = this.props
        const { newDataSource, localScale, data, datatimes, refreshKey } = this.state
        if(refreshKey == 0 || (Object.keys(dataSource).length !== 0 && !isEqual(prevProps.dataSource, dataSource))){
            if(prevProps.dataSource.length !== 0 && prevProps.dataSource.length < dataSource.length){
                this.dataFilter(dataSource, 3)
            }else{
                this.dataFilter(dataSource, 1)
            }
            this.setState({
                refreshKey: refreshKey + 1
            })
        }       

        if(!isEqual(prevState.newDataSource, newDataSource)){
            let data = [], prevDate = ""
            if(scale=="hour" && localScale == "hour"){//48条
                newDataSource.map((i,index)=>{
                    data.push({
                        time: i["time"].split(" ")[0]+"/"+i["time"].split(" ")[1],
                        bps: i["in_packets_bps"],
                        type: "Rx"
                    })
                    data.push({
                        time: i["time"].split(" ")[0]+"/"+i["time"].split(" ")[1],
                        bps: i["out_packets_bps"],
                        type: "Tx"
                    })   
                })
            }else if(scale=="day" || (scale == "hour" && localScale == "day")){
                newDataSource.map((i)=>{
                    data.push({
                        time: i["time"],
                        pps: i["max_in_pps"],
                        type: "max_in_pps",
                        ppsflag: "max_in_pps"
                    })
                    data.push({
                        time: i["time"],
                        pps: i["ave_in_pps"],
                        type: "ave_in_pps",
                        ppsflag: "ave_in_pps"
                    })
                    data.push({
                        time: i["time"],
                        pps: i["min_in_pps"],
                        type: "min_in_pps",
                        ppsflag: "min_in_pps"
                    })
                    data.push({
                        time: i["time"],
                        pps: i["max_out_pps"],
                        type: "max_out_pps",
                        ppsflag: "max_out_pps"
                    })
                    data.push({
                        time: i["time"],
                        pps: i["ave_out_pps"],
                        type: "ave_out_pps",
                        ppsflag: "ave_out_pps"
                    })
                    data.push({
                        time: i["time"],
                        pps: i["min_out_pps"],
                        type: "min_out_pps",
                        ppsflag: "min_out_pps"
                    })
                    data.push({
                        time: i["time"],
                        bps: i["max_in_bps"],
                        type: "max_in_bps",
                        bpsflag: "max_in_bps"
                    })
                    data.push({
                        time: i["time"],
                        bps: i["ave_in_bps"],
                        type: "ave_in_bps",
                        bpsflag: "ave_in_bps"
                    })
                    data.push({
                        time: i["time"],
                        bps: i["min_in_bps"],
                        type: "min_in_bps",
                        bpsflag: "min_in_bps"
                    })
                    data.push({
                        time: i["time"],
                        bps: i["max_out_bps"],
                        type: "max_out_bps",
                        bpsflag: "max_out_bps"
                    })
                    data.push({
                        time: i["time"],
                        bps: i["ave_out_bps"],
                        type: "ave_out_bps",
                        bpsflag: "ave_out_bps"
                    })
                    data.push({
                        time: i["time"],
                        bps: i["min_out_bps"],
                        type: "min_out_bps",
                        bpsflag: "min_out_bps"
                    })
                })
            }
            this.setState({
                data: data
            })
        }
    }
    /**
     * 过滤绘制趋势图所需的数据
     * 传进来48条，分阶段显示
     */
    dataFilter = (dataSource, ratio) => {
        const { scale, currentPage, totalData } = this.props
        const { localScale } = this.state
        let newdatasource = [],start,end 
        if(scale == "hour" && localScale == "hour" && dataSource.length > 24){
            let newdatalen = 24 + (ratio-1) * 8 > dataSource.length ? dataSource.length : 24 + (ratio-1) * 8 
            if(currentPage == 1){
                start=0;
                end=start+newdatalen;
            }else if(currentPage == Math.ceil(dataSource.length/24)){
                end=dataSource.length;
                start=end-newdatalen;
            }else{
                start=24-newdatalen*0.5;
                end=24+newdatalen*0.5;
            }
        }else if((scale == "hour" && localScale == "hour" && dataSource.length <= 24 ) || 
                 (scale == "hour" && localScale == "day") || scale == "day"){
            start = 0;
            end = dataSource.length;
        }
        for(let i = start; i < end; i++){
            newdatasource.push(dataSource[i])
        }
        this.setState({
            newDataSource: newdatasource
        })
        
    }
    /**
     * 天单位图表的组件数据
     */
    makeChartInfo = value => {
        let nChartInfo = {
            data: ["time"],
            yaxis_name: "",
            geom_position: "",
            color: []
        }
        const bpsColorMap = ['#11B0FF', '#51DEFF', '#97EDFF', '#FF6836', '#F99A36', '#FFC15A']
        const ppsColorMap = ['#256F35', '#429933', '#9CCF6E', '#341745', '#5A3C63', '#C17DD4']
        if(value.length == 0){
            return nChartInfo
        }else {
            if(value.split("_")[0] == "bps"){
                nChartInfo.data.push("bps")
                nChartInfo.data.push("bpsflag")
                nChartInfo.yaxis_name = "bps"
                nChartInfo.geom_position = "time*bps"
                nChartInfo.color = ["bpsflag",bpsColorMap]
            }else if(value.split("_")[0] == "pps"){
                nChartInfo.data.push("pps")
                nChartInfo.data.push("ppsflag")
                nChartInfo.yaxis_name = "pps"
                nChartInfo.geom_position = "time*pps"
                nChartInfo.color = ["ppsflag",ppsColorMap]
            }
        }
        return nChartInfo
    }
    /**
     * 选择器的回调函数
     */
    handleSelectChange = value => {
        this.setState({
            selectedValue: value,
            chartInfo: this.makeChartInfo(value)
        })
    }
    render(){
        const { scale, dataSource, currentPage } = this.props
        const { data, localScale, selectedValue, chartInfo } = this.state
        console.log("扩大之后的单位：",scale, localScale)
        console.log("图表的数据：",data)
        const chartScale = {
            bps:  {alias: "Gbps", range: [0,1]},
            time: {alias: "Time", range: [0,1], tickCount:24},
            pps:  {alias: "Gpps", range: [0,1]}
        }
        const dayScale = {
            bps:  {alias: "Gbps", range: [0,1]},
            time: {alias: "Time", range: [0,1], tickCount:24},
            pps:  {alias: "Gpps", range: [0,1]}
        }
        const title = {
            position: "end",
            textStyle: {
                fontSize: "14",
                textAlign: "center",
                fill: "#AEAEAE",
            }
        }
        const bpsColorMap = ['#11B0FF', '#51DEFF', '#97EDFF', '#FF6836', '#F99A36', '#FFC15A']
        const ppsColorMap = ['#256F35', '#429933', '#9CCF6E', '#341745', '#5A3C63', '#C17DD4']
        const handleOnTooltipChange = scale == "day" || (scale == "hour" && localScale == "day") ? (ev)=>{
            let items = ev.items
            let origin = items[0]
            let nv = origin.value / 1000000000
            items.splice(0)
            items.push({
                name: origin.name,
                title: origin.title,
                value: nv,
                marker: true,
                color: origin.color
            })
        } : (ev) => {}
        return (
            <>
            {
                scale == "day" || (scale == "hour" && localScale == "day") ? 
                <div>
                    <Select
                        placeholder='Please select'
                        value={selectedValue}
                        onChange={this.handleSelectChange}
                        style={{
                            width: 150,
                            marginLeft: 60
                        }}
                    >
                        <Select.Option value="bps">bps</Select.Option>
                        <Select.Option value="pps">pps</Select.Option>
                    </Select>
                </div> : <></>

            }
            <Chart  
                width={1190} 
                height={420} 
                scale={chartScale}
                data={scale == "day" || (scale == "hour" && localScale == "day") ? {} : data}  
                padding={[20,"auto",55,"auto"]}
                onPlotEnter={ev => {this.setState({canZoom:true})}}
                onPlotLeave={ev => {this.setState({canZoom:false})}}
                onTooltipChange={handleOnTooltipChange}
            >
                {
                    chartInfo && (scale == "day" || (scale == "hour" && localScale == "day")) ? 
                    <View data={pick(data, chartInfo.data)} scale={dayScale}>
                        <Axis name="time"  position="bottom"   line={{stroke: '#ccc', fill: '#ccc'}} title={title} />
                        <Axis name={chartInfo.yaxis_name}   position="left"     line={{stroke: '#ccc', fill: '#ccc'}} title={title} 
                            label={{
                                formatter: (text, item, index) => {
                                    if(parseInt(text) == 1){ return "1" }else{
                                        let val = parseInt(text) / 1000000000; 
                                        return `${val}` ;
                                    }
                                }                 
                            }}
                        />
                        <Geom type="line" position={chartInfo.geom_position} size={2} color={chartInfo.color} />
                        <Geom type="point" position={chartInfo.geom_position} size={4} shape={'circle'} color={chartInfo.color} />
                    </View> 
                    :
                    <>
                        <Axis name="time"  position="bottom"   line={{stroke: '#ccc', fill: '#ccc'}} title={title} />
                        <Axis name="bps"   position="left"     line={{stroke: '#ccc', fill: '#ccc'}} title={title} 
                            label={{
                                formatter: (text, item, index) => {
                                    if(parseInt(text) == 1){ return "1" }else{
                                        let val = parseInt(text) / 1000000000; 
                                        return `${val}` ;
                                    }
                                    
                                }                   
                            }}
                        />
                        <Geom type="line" position="time*bps" size={2} color={['type', ['#7dd0ff', '#f08336']]} 
                            tooltip={["time*bps*type", (time, bps, type) => {
                                return {
                                    name: `${type}`,
                                    value: `${bps/1000000000}`
                                }
                            }]}
                        />
                        <Geom type="point" position="time*bps" size={4} shape={'circle'} color={['type', ['#7dd0ff', '#f08336']]} 
                            tooltip={["time*bps*type", (time, bps, type) => {
                                return {
                                    name: `${type}`,
                                    value: `${bps/1000000000}`
                                }
                            }]}
                        />
                    </>
                }
                <Tooltip crosshairs={{type: "y"}}/>
                <Legend position="right-center" />
            </Chart>
            </>
        )
    }
}