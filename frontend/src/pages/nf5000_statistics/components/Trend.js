import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { message } from 'antd'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import styles from '../nf5000_statistics.less'
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

var RATIO = 1
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
        }
    }
    /**
     * 滚动回调函数
     */
    _handleWheel = (e) => {
        const { dataSource, queryPayload, dispatch, scale, totalData, handleChangeTrendLoading } = this.props
        const { canZoom, localScale } = this.state
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
                                type: "nf5000_statistics/queryTrendData",
                                payload: queryPayload 
                            }).then(() => {
                            }).catch(() => {
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
                        type: "nf5000_statistics/queryTrendData",
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
        const { newDataSource, localScale, data, datatimes } = this.state
        if(Object.keys(dataSource).length !== 0 && prevProps.dataSource !== dataSource){
            if(prevProps.dataSource.length < dataSource.length){
                this.dataFilter(dataSource, 3)
            }else{
                this.dataFilter(dataSource, 1)
            }
        }       
        if(prevState.newDataSource !== newDataSource){
            let data = [], prevDate = ""
            if(scale=="hour" && localScale == "hour"){//48条
                newDataSource.map((i,index)=>{
                    data.push({
                        time: i["time"],
                        bps: i["in_bps"],
                        type: "Rx"
                    })
                    data.push({
                        time: i["time"],
                        bps: i["out_bps"],
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
    render(){
        const { scale, dataSource, currentPage } = this.props
        const { data, localScale } = this.state
        const chartScale = {
            bps: {
                alias: "Gbps",
                type: "linear",
                range: [0,1]
            },
            time: {
                alias: "Time",
                tickCount:24,
                range: [0,1]
            },
            pps: {
                alias: "pps",
                type: "linear",
                range: [0,1],
                min:0,
            }
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
        return (
            <Chart  
                width={1190} height={420} data={data} scale={chartScale} 
                padding={scale=="day" || (scale == "hour" && localScale == "day") ? [55,80,130,80] : [25,70,100,70]}
                onPlotEnter={ev => {this.setState({canZoom:true})}}
                onPlotLeave={ev => {this.setState({canZoom:false})}}
            >
                {//缩放
                    scale == "day" || (scale == "hour" && localScale == "day")? 
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
                        <Geom type="line"  position="time*bps" size={2} color={['bpsflag', bpsColorMap]} 
                        />
                        <Geom type="point" position="time*bps" size={4} shape={'circle'} color={['bpsflag', bpsColorMap]} />
                        <Axis name="pps"   position="right"    line={{stroke: '#ccc', fill: '#ccc'}} title={title} />
                        <Geom type="line"  position="time*pps" size={2} shape={'dot'} color={['ppsflag', ppsColorMap]}
                        />
                        <Geom type="point" position="time*pps" size={4} shape={'triangle'} color={['ppsflag', ppsColorMap]} />
                    </> : 
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
                        <Geom type="line"  position="time*bps" size={2} color={['type', ['#7dd0ff', '#f08336']]} 
                            tooltip={["time*bps*type", (time, bps, type) => {
                                return {
                                    name: `${time.split(' ')[1]} ${type}`,
                                    value: `${bps/1000000000}`
                                }
                            }]}
                        />
                        <Geom type="point" position="time*bps" size={4} shape={'circle'} color={['type', ['#7dd0ff', '#f08336']]} 
                            tooltip={["time*bps*type", (time, bps, type) => {
                                return {
                                    name: `${time.split(' ')[1]} ${type}`,
                                    value: `${bps/1000000000}`
                                }
                            }]}
                        />
                    </>
                }
                <Legend />
                <Tooltip
                    crosshairs={{
                        type: 'y'
                    }} 
                />
            </Chart>
        )
    }
}