import { Col, Dropdown, Icon, Menu, Row, Card, Popover, Button, Divider,Alert,List} from 'antd'
import React, { Component} from 'react'
import { Dispatch } from 'redux'
import { GridContent } from '@ant-design/pro-layout'
import { connect } from 'dva'
import styles from './sf3000_home.less'
import Pie from './components/Charts/Pie'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
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
    Guide,
    Shape,
    Facet,
    Util,
  } from 'bizcharts'
import sf3000_home from '@/models/sf3000_home'
import { blockStatement } from '@babel/types'
import  WaringInfo  from './components/WaringInfo' 
import isEqual from 'lodash/isEqual'
const { Line } = Guide;



/**
 * 端口组件
 */
class PopButton extends Component {
    render(){
        const { portId, content, arr_id, arrId } = this.props
        let backgroundColor = ""
        if(content.link_status == 'down'){
            backgroundColor = '#fff'
        }
        else {
            if(content.speed == '10000'){
                backgroundColor = '#7dd0ff'
            }else{
                backgroundColor = '#f08336'
            }
        }
        return (
            <div style={{width: '12.5%', height: '100%'}}>
            <Popover content={
                <div>
                    <p>{formatMessage({id: 'link.status'})} {content.link_status}</p>
                    <p>{formatMessage({id: 'link.speed'})} {content.speed} <span>M</span></p>
                    <Divider dashed="true"/>
                    <p>{formatMessage({id: 'packet.receive'})} {content.in_packets}</p>
                    <p>{formatMessage({id: 'packet.receive.speed'})} {content.in_packets_bps} <span>Mbps</span></p>
                    <p>{formatMessage({id: 'packet.transmit'})} {content.out_packets}</p>
                    <p>{formatMessage({id: 'packet.transmit.speed'})} {content.out_packets_bps} <span>Mbps</span></p>
                    <Divider dashed="true"/>
                    <p>{formatMessage({id: 'plug.info'})} {content.plug}</p>
                    <p>{formatMessage({id: 'mode.info'})} {content.mode} </p>
                    <p>{formatMessage({id: 'temperature.info'})} {content.temperature} </p>
                    <p>{formatMessage({id: 'packet.receive.capacity'})} {content.rx_power} <span>dbm</span> </p>
                    <p>{formatMessage({id: 'packet.transmit.capacity'})} {content.tx_power} <span>dbm</span> </p>
                    <p>{formatMessage({id: 'supplier.info'})} {content.vendorName} </p>
                </div>
            } title={formatMessage({id:arr_id[portId]})} trigger="hover" placement="bottom">
                <Button style={{backgroundColor:backgroundColor, width:'100%', height:'100%', padding:"0 13px"}}></Button>
            </Popover>
            </div>
        )
    }
}



@connect(({sf3000_home, loading})=>{
    console.log(sf3000_home)
    console.log("占用率----------------------->", sf3000_home.currentUtilization)
    console.log("折线图----------------------->", sf3000_home.currentThrought)
    console.log("设备信息----------------------->",sf3000_home.currentInformation)
    console.log("端口信息-------------------------->",sf3000_home.currentPortinformation)
    console.log("端口速率状态信息-------------------------->",sf3000_home.currentStatus)
    console.log("告警信息-------------------------->",sf3000_home.currentWaringData)
    return {
        currentUtilization: sf3000_home.currentUtilization,
        currentThrought: sf3000_home.currentThrought,
        currentInformation: sf3000_home.currentInformation,
        currentPortinformation: sf3000_home.currentPortinformation,
        currentStatus: sf3000_home.currentStatus,
        currentHomeWaringData:sf3000_home.currentWaringData,
    }
})
class Home extends Component{
    constructor(props){
        super(props)
        this.state = {
            refreshKey: 0,
            arrs: {
                arr1:[],
                arr2:[],
                arr3:[],
                arr4:[],
                arr5:[],
                arr6:[]
            },
            returnWaringInfoProps: {}
        }
    }
    componentDidMount(){
        //先读一次
        const {dispatch} = this.props;
        dispatch({
            type: "sf3000_home/fetchUtilization"
        });

        dispatch({
            type: "sf3000_home/fetchTotalthrought"
        });

        dispatch({
            type: "sf3000_home/fetchSysteminformation"
        });

        dispatch({
            type: "sf3000_home/fetchPortinformation"
        });

        dispatch({
            type: "sf3000_home/fetchStatus"
        }); 
        
        dispatch({
            type: "sf3000_home/getHomeWaringLog"
        }); 

        //设置每一分钟读一次数据
         setInterval(() => {
             console.log("2")
            const {dispatch} = this.props;
            dispatch({
                type: "sf3000_home/fetchUtilization"
            });
    
            dispatch({
                type: "sf3000_home/fetchTotalthrought"
            });
    
            dispatch({
                type: "sf3000_home/fetchSysteminformation"
            });
    
            dispatch({
                type: "sf3000_home/fetchPortinformation"
            });
    
            dispatch({
                type: "sf3000_home/fetchStatus"
            }); 
         }, 60000);
    }
    componentDidUpdate(prevProps){
        const { refreshKey } = this.state
        const { currentPortinformation, currentStatus, currentHomeWaringData } = this.props
        console.log(currentHomeWaringData)
        const {X1,X2,X3,X4,X5,X6,X7,X8,X9,X10,X11,X12,X13,X14,X15,X16,X17,X18,X19,X20,X21,X22,X23,X24,
            X25,X26,X27,X28,X29,X30,X31,X32,X33,X34,X35,X36,X37,X38,X39,X40,X41,X42,X43,X44,X45,X46,X47,X48} = currentPortinformation
        const {X1:Y1,X2:Y2,X3:Y3,X4:Y4,X5:Y5,X6:Y6,X7:Y7,X8:Y8,X9:Y9,X10:Y10,X11:Y11,X12:Y12,X13:Y13,X14:Y14,X15:Y15,X16:Y16,
            X17:Y17,X18:Y18,X19:Y19,X20:Y20,X21:Y21,X22:Y22,X23:Y23,X24:Y24,X25:Y25,X26:Y26,X27:Y27,X28:Y28,X29:Y29,X30:Y30,X31:Y31,X32:Y32,
            X33:Y33,X34:Y34,X35:Y35,X36:Y36,X37:Y37,X38:Y38,X39:Y39,X40:Y40,X41:Y41,X42:Y42,X43:Y43,X44:Y44,X45:Y45,X46:Y46,X47:Y47,X48:Y48} = currentStatus

        if( (this.state.refreshKey == 0 && Object.keys(currentPortinformation).length > 0 && Object.keys(currentStatus).length > 0 ) || 
            (!isEqual(prevProps.currentPortinformation, currentPortinformation) && Object.keys(currentStatus).length > 0) || 
            (!isEqual(prevProps.currentStatus, currentStatus) && Object.keys(currentPortinformation).length > 0)){
                console.log(Object.assign(X1,Y1))
            this.setState({
                refreshKey:refreshKey+1,
                arrs: {
                    arr1: [Object.assign(X1,Y1),Object.assign(X3,Y3),Object.assign(X5,Y5),Object.assign(X7,Y7),Object.assign(X9,Y9),Object.assign(X11,Y11),Object.assign(X13,Y13),Object.assign(X15,Y15)],
                    arr2: [Object.assign(X17,Y17),Object.assign(X19,Y19),Object.assign(X21,Y21),Object.assign(X23,Y23),Object.assign(X25,Y25),Object.assign(X27,Y27),Object.assign(X29,Y29),Object.assign(X31,Y31)],
                    arr3: [Object.assign(X33,Y33),Object.assign(X35,Y35),Object.assign(X37,Y37),Object.assign(X39,Y39),Object.assign(X41,Y41),Object.assign(X43,Y43),Object.assign(X45,Y45),Object.assign(X47,Y47)],
                    arr4: [Object.assign(X2,Y2),Object.assign(X4,Y4),Object.assign(X6,Y6),Object.assign(X8,Y8),Object.assign(X10,Y10),Object.assign(X12,Y12),Object.assign(X14,Y14),Object.assign(X16,Y16)],
                    arr5: [Object.assign(X18,Y18),Object.assign(X20,Y20),Object.assign(X22,Y22),Object.assign(X24,Y24),Object.assign(X26,Y26),Object.assign(X28,Y28),Object.assign(X30,Y30),Object.assign(X32,Y32)],
                    arr6: [Object.assign(X34,Y34),Object.assign(X36,Y36),Object.assign(X38,Y38),Object.assign(X40,Y40),Object.assign(X42,Y42),Object.assign(X44,Y44),Object.assign(X46,Y46),Object.assign(X48,Y48)]
                }
            })
        }
        if((this.state.refreshKey == 0 && Object.keys(currentHomeWaringData).length > 0) || !isEqual(prevProps.currentHomeWaringData, currentHomeWaringData)){
            console.log("1", currentHomeWaringData)
            this.setState({
                returnWaringInfoProps: {
                    waringData: currentHomeWaringData.data
                }
            })
        }
    }
    
    render(){
        const { arrs, returnWaringInfoProps } = this.state

        const {memory_usage, cpu_usage} = this.props.currentUtilization;
        const {currentThrought} = this.props;
        const {serial_number, product_name, Mgmt_Ip, Mgmt_Mac, Hostname, nos_version} = this.props.currentInformation;


        // 用于标识每个端口的名称
        var arr_id =['port.attribute.1','port.attribute.2','port.attribute.3','port.attribute.4','port.attribute.5','port.attribute.6','port.attribute.7','port.attribute.8',
        'port.attribute.9','port.attribute.10','port.attribute.11','port.attribute.12','port.attribute.13','port.attribute.14','port.attribute.15','port.attribute.16','port.attribute.17',
        'port.attribute.18','port.attribute.19','port.attribute.20','port.attribute.21','port.attribute.22','port.attribute.23','port.attribute.24','port.attribute.25','port.attribute.26',
        'port.attribute.27','port.attribute.28','port.attribute.29','port.attribute.30','port.attribute.31','port.attribute.32','port.attribute.33','port.attribute.34','port.attribute.35',
        'port.attribute.36','port.attribute.37','port.attribute.38','port.attribute.39','port.attribute.40','port.attribute.41','port.attribute.42','port.attribute.43','port.attribute.44',
        'port.attribute.45','port.attribute.46','port.attribute.47','port.attribute.48'];

        let color_memory = memory_usage > 80 ? "#d0121b" : "#7dd0ff";
        let color_cpu = cpu_usage > 80 ? "#d0121b" : "#7dd0ff";
        let current_cpu_usage = cpu_usage > 100 ? 100: cpu_usage;

        const cols = {
        time: {
            range: [0, 1],
        },
        value: {
            range: [0,1],
        },
        };

        return(
            <GridContent>
                <Row gutter={24}>
                    <Col x1={12} lg={24} sm={24} xs={24} style={{marginBottom:24}}>
                        <Card title = {formatMessage({id:'link.status.overview'})} style={{fontSize:18}} headStyle={{fontSize:18,fontWeight:700}}>
                        <div className={styles.container} >
                            <div className={styles.picture}>
                                <div className={styles.interfaces}>
                                    <div className={styles.in1}>
                                    {
                                        arrs["arr1"].length > 0 ? arrs["arr1"].map((item,index)=>{
                                            return(
                                                <PopButton key={2*index+1} content={item} arr_id={arr_id} portId={2*index} arrId={1}/>   
                                            )
                                        }) : null
                                    }
                                    </div>
                                    <div className={styles.in2}>
                                    { 
                                        arrs["arr2"].length > 0 ? arrs["arr2"].map((item,index)=>{
                                            return(
                                                <PopButton key={2*index+17} content={item} arr_id={arr_id} portId={2*index+16} arrId={2}/>
                                            )
                                        }) : null
                                    }
                                    </div>
                                    <div className={styles.in3}>
                                    { 
                                        arrs["arr3"].length > 0 ? arrs["arr3"].map((item,index)=>{
                                            return(
                                                <PopButton key={2*index+33} content={item} arr_id={arr_id} portId={2*index+32} arrId={3}/>
                                            )
                                        }) : null
                                    }
                                    </div>
                                    <div className={styles.in4}>
                                    { 
                                        arrs["arr4"].length > 0 ? arrs["arr4"].map((item,index)=>{
                                            return(
                                                <PopButton key={2*index+2} content={item} arr_id={arr_id} portId={2*index+1} arrId={4}/>
                                            )
                                        }) : null
                                    }
                                    </div>
                                    <div className={styles.in5}>
                                    { 
                                        arrs["arr5"].length > 0 ? arrs["arr5"].map((item,index)=>{
                                            return(
                                                <PopButton key={2*index+18} content={item} arr_id={arr_id} portId={2*index+17} arrId={5}/>
                                            )
                                        }) : null
                                    }
                                    </div>
                                    <div className={styles.in6}>
                                    { 
                                        arrs["arr6"].length > 0 ? arrs["arr6"].map((item,index)=>{
                                            return(
                                                <PopButton key={2*index+34} content={item} arr_id={arr_id} portId={2*index+33} arrId={6}/>
                                            )
                                        }) : null
                                    }
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.legend_left}>
                                <div className={styles.icon_left}></div>
                                <div className={styles.icon_middle}></div>
                                <div className={styles.word_left}>{formatMessage({id:'app.policy.icon.up'})}</div>
                                <div className={styles.icon_right}></div>
                                <div className={styles.word_right}>{formatMessage({id:'app.policy.icon.down'})}</div>
                            </div>
                            <div className={styles.legend_right}>
                                <div>
                                <div className={styles.illustration_icon_above}></div>
                                <div className={styles.illustration_above}>{formatMessage({id: 'word.above.overview'})}</div>
                                </div>
                                <div>
                                <div className={styles.illustration_icon_below}></div>
                                <div className={styles.illustration_below}>{formatMessage({id: 'word.below.overview'})}</div>
                                </div>
                            </div>
                        </div>
                        </Card>
                    </Col>
                    {/* 告警信息 */}
                    <WaringInfo { ...returnWaringInfoProps } />
                    <Col x1={12} lg={12} sm={24} xs={24} style={{marginBottom:24}}>
                        <Card title = {formatMessage({id: 'system.resource'})} style={{fontSize:18}} headStyle={{fontSize:18,fontWeight:700}} bodyStyle={{padding:24}}>
                            <Col span={12}>
                                <Pie
                                    
                                    color= {color_memory}
                                    percent={memory_usage}
                                    total={memory_usage+"%"}
                                    height={140}
                                />
                                <div className={styles.cpu_utilization}>
                                        {formatMessage({id: 'memory.utilization.picture'})}
                                </div>
                            </Col>
                            <Col span={12}>
                                <Pie
                                    color={color_cpu}
                                    percent={current_cpu_usage}
                                    total={current_cpu_usage+"%"}
                                    height={140}
                                />
                                <div className={styles.memory_utilization}>
                                    {formatMessage({id: 'cpu.utilization.picture'})}
                                </div>
                            </Col>
                        </Card>
                    </Col>
                    <Col x1={12} lg={12} sm={24} xs={24} style={{marginBottom:24}}>
                        <Card title = {formatMessage({id: 'system.info'})} headStyle={{fontSize:18, fontWeight:700}}>
                            <Col x1={9} lg={9} sm={24} xs={24}>
                                <div className={styles.hostname_fixed}>{formatMessage({id: 'host.name'})}</div>
                                <div className={styles.product_number_fixed}>{formatMessage({id: 'product.number'})}</div>
                                <div className={styles.system_version_fixed}>{formatMessage({id: 'system.version'})}</div>
                                <div className={styles.management_ip_fixed}>{formatMessage({id: 'management.ip'})}</div>
                                <div className={styles.management_mac_fixed}>{formatMessage({id: 'management.mac'})}</div>
                                <div className={styles.serial_number_fixed}>{formatMessage({id: 'serial.number'})}</div>
                            </Col>
                            <Col x1={15} lg={15} sm={24} xs={24}>
                                <div><span className={styles.hostname_value}>{Hostname}</span></div>
                                <div><span className={styles.product_number_value}>{product_name}</span></div>
                                <div><span className={styles.system_version_value}>{nos_version}</span></div>
                                <div><span className={styles.management_ip_value}>{Mgmt_Ip}</span></div>
                                <div><span className={styles.management_mac_value}>{Mgmt_Mac}</span></div>
                                <div><span className={styles.serial_number_value}>{serial_number}</span></div>
                            </Col>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                <Card title = {formatMessage({id:'total.throughout'})} headStyle={{fontSize:18,fontWeight:700}} bodyStyle={{padding:24}}>
                <Chart height={350} data={currentThrought} scale={cols} forceFit>
                    <Legend />
                    <Axis 
                        name="time" 
                        label={{
                            textStyle:{
                                fontSize:16,
                            }
                        }}
                    />
                    <Axis
                        name="value"
                        label={{
                            formatter: val => `${val}Gbps`,     
                            textStyle:{
                                fontSize:16,
                            }                  
                        }}
                        line={{
                            lineWidth:1,
                            stroke:"#8e8e8e"
                        }}
                    />
                    <Tooltip
                        crosshairs={{
                            type: 'y'
                        }}
                    />
                    <Legend
                        textStyle={{
                            fontSize:20
                        }}
                    />
                    <Geom type="line" position="time*value" size={2} color={['type', ['#7dd0ff', '#f08336']]} />
                    <Geom
                        type="point"
                        position="time*value"
                        size={4}
                        shape={'circle'}
                        color={['type', ['#7dd0ff', '#f08336']]}
                        style={{
                          stroke: '#fff',
                          lineWidth: 1,
                        }}
                    />
                </Chart>
                </Card>
                </Col>
                </Row>
            </GridContent>
        );
    }
}

export default Home;
