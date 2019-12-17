import { Col, Dropdown, Icon, Menu, Row, Card, Popover, Button, Divider,Alert,List} from 'antd';
import React, { Component} from 'react';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './nf5000_home.less';
import Pie from './components/Charts/Pie';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
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
  } from 'bizcharts';
import nf5000_home from '@/models/nf5000_home';
import { blockStatement } from '@babel/types';
import  WaringInfo  from './components/WaringInfo' ;
import isEqual from 'lodash/isEqual'
const { Line } = Guide;

@connect(({nf5000_home, nf5000_global, loading})=>{
    return {
        currentUtilization: nf5000_home.currentUtilization,
        currentThrought: nf5000_home.currentThrought,
        currentInformation: nf5000_home.currentInformation,
        currentPortinformation: nf5000_home.currentPortinformation,
        currentStatus: nf5000_home.currentStatus,
        currentPortNumber: nf5000_home.currentPortNumber,
        currentHomeWaringData:nf5000_home.currentWaringData,
        currentVppstatus: nf5000_global.currentVppstatus
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
            },
        }
    }
    componentDidMount(){
        //先读一次
        const {dispatch} = this.props;
        dispatch({
            type: "nf5000_home/fetchUtilization"
        });

        dispatch({
            type: "nf5000_home/fetchTotalthrought"
        });

        dispatch({
            type: "nf5000_home/fetchSysteminformation"
        });

        dispatch({
            type: "nf5000_home/fetchPortinformation"
        });

        dispatch({
            type: "nf5000_home/fetchStatus"
        }); 
        
        dispatch({
            type: "nf5000_home/getHomeWaringLog"
        }); 

        dispatch({
            type: "nf5000_home/fetchPortNumber"
        });

        dispatch({
            type: "nf5000_global/fetchVppstatus"
        });

        //设置每一分钟读一次数据
         setInterval(() => {
            const {dispatch} = this.props;
            dispatch({
                type: "nf5000_home/fetchUtilization"
            });
    
            dispatch({
                type: "nf5000_home/fetchTotalthrought"
            });
    
            dispatch({
                type: "nf5000_home/fetchSysteminformation"
            });
    
            dispatch({
                type: "nf5000_home/fetchPortinformation"
            });
    
            dispatch({
                type: "nf5000_home/fetchStatus"
            }); 
         }, 60000);
    }

    componentDidUpdate(prevProps){
        const { refreshKey } = this.state
        const { currentPortinformation, currentStatus } = this.props
        const {G1,G2,G3,G4,G5,G6,G7,G8,G9,G10,G11,G12,G13,G14,G15,G16} = currentPortinformation
        const {G1:Y1,G2:Y2,G3:Y3,G4:Y4,G5:Y5,G6:Y6,G7:Y7,G8:Y8,G9:Y9,G10:Y10,G11:Y11,G12:Y12,G13:Y13,G14:Y14,G15:Y15,G16:Y16} = currentStatus

        if( (this.state.refreshKey == 0 && Object.keys(currentPortinformation).length > 0 && Object.keys(currentStatus).length > 0 ) || 
            (!isEqual(prevProps.currentPortinformation, currentPortinformation) && Object.keys(currentStatus).length > 0) || 
            (!isEqual(prevProps.currentStatus, currentStatus) && Object.keys(currentPortinformation).length > 0)){
            this.setState({
                refreshKey:refreshKey+1,
                arrs: {
                    arr1: [Object.assign(G1,Y1),Object.assign(G2,Y2),Object.assign(G3,Y3),Object.assign(G4,Y4),Object.assign(G5,Y5),Object.assign(G6,Y6),Object.assign(G7,Y7),Object.assign(G8,Y8)],
                    arr2: [Object.assign(G9,Y9),Object.assign(G10,Y10),Object.assign(G11,Y11),Object.assign(G12,Y12),Object.assign(G13,Y13),Object.assign(G14,Y14),Object.assign(G15,Y15),Object.assign(G16,Y16)]
                }
            })
        }
    }
    
    render(){
        const { arrs } = this.state
        const result = this.props.currentHomeWaringData;
        const returnWaringInfoProps = {
            waringData: result,
          };

        const { currentVppstatus } = this.props
        const {memory_usage, cpu_usage} = this.props.currentUtilization;
        const {data} = this.props.currentThrought;
        const {product_name, Mgmt_Ip, Mgmt_Mac, hostname, nos_version} = this.props.currentInformation;
        const { currentPortNumber } = this.props

        // G1~G16
        var arr_id =['port.attribute.1','port.attribute.2','port.attribute.3','port.attribute.4','port.attribute.5','port.attribute.6','port.attribute.7','port.attribute.8',
        'port.attribute.9','port.attribute.10','port.attribute.11','port.attribute.12','port.attribute.13','port.attribute.14','port.attribute.15','port.attribute.16'];

          let color_memory = memory_usage>80 ? "#d0121b" : "#5c7cb3";
          let color_cpu = cpu_usage>80 ? "#d0121b" : "#5c7cb3";
          let current_cpu_usage = cpu_usage>100 ? 100: cpu_usage;
          let backgroundColor = ""

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
                        <Card title = {formatMessage({id:'link.status.overview'})} style={{fontSize:20}} headStyle={{fontSize:20,fontWeight:700}}>
                        <div className={styles.div} >
                            <div className={styles.picture}>
                                <div >
                                    {arrs["arr1"].length > 0 ? arrs["arr1"].map((item,index)=>{
                                        backgroundColor = (currentVppstatus === "RUNNING") ? (item.link_status === "up" ? "#5c7cb3" : "#fff") : "#fff"
                                        if (index+1 <= currentPortNumber){
                                        return( 
                                            <React.Fragment key={index}>
                                            <Popover content ={
                                                <div>
                                                    <p>{formatMessage({id: 'link.status'})} {item.link_status}</p>
                                                    <p>{formatMessage({id: 'admin.status'})} {item.admin_status}</p>
                                                    <p>{formatMessage({id: 'link.speed'})} {item.speed} <span>M</span></p>
                                                    <Divider dashed="true"/>
                                                    <p>{formatMessage({id: 'packet.receive'})} {item.in_packets}</p>
                                                    <p>{formatMessage({id: 'packet.receive.speed'})} {item.in_pps} <span>Mbps</span></p>
                                                    <p>{formatMessage({id: 'packet.transmit'})} {item.out_packets}</p>
                                                    <p>{formatMessage({id: 'packet.transmit.speed'})} {item.out_pps} <span>Mbps</span></p>
                                                </div>
                                            }
                                             title={formatMessage({id:arr_id[index]})} trigger="hover" placement="bottom">
                                                    <Button className={styles.in1_above} style={{backgroundColor: backgroundColor}}></Button>
                                                </Popover>  
                                                    <div className={styles.blank}></div>
                                                </React.Fragment>
                                            )}else{
                                                return(
                                                    <React.Fragment key={index}>
                                                    <Popover >
                                                        <div className={styles.in1_above}></div>
                                            </Popover>  
                                                <div className={styles.blank}></div>
                                            </React.Fragment>
                                        )
                                            }
                                    }) : null }
                                </div>

                                <div >
                                    {arrs["arr2"].length > 0 ? arrs["arr2"].map((item,index)=>{
                                        backgroundColor = (currentVppstatus === "RUNNING") ? (item.link_status === "up" ? "#5c7cb3" : "#fff") : "#fff"
                                        if (index+9 <= currentPortNumber){
                                        return( 
                                            <React.Fragment key={8+index}>
                                            <Popover content = { 
                                                <div>
                                                    <p>{formatMessage({id: 'link.status'})} {item.link_status}</p>
                                                    <p>{formatMessage({id: 'admin.status'})} {item.admin_status}</p>
                                                    <p>{formatMessage({id: 'link.speed'})} {item.speed} <span>M</span></p>
                                                    <Divider dashed="true"/>
                                                    <p>{formatMessage({id: 'packet.receive'})} {item.in_packets}</p>
                                                    <p>{formatMessage({id: 'packet.receive.speed'})} {item.in_pps} <span>Mbps</span></p>
                                                    <p>{formatMessage({id: 'packet.transmit'})} {item.out_packets}</p>
                                                    <p>{formatMessage({id: 'packet.transmit.speed'})} {item.out_pps} <span>Mbps</span></p>
                                                </div>
                                            } title={formatMessage({id:arr_id[8+index]})} trigger="hover" placement="bottom">
                                                <Button className={styles.in2_below} style={{backgroundColor: backgroundColor}}></Button>
                                            </Popover>  
                                                <div className={styles.blank}></div>
                                            </React.Fragment>
                                        )}else{
                                            return(
                                                <React.Fragment key={8+index}>
                                                <div className={styles.in2_below}></div>
                                                <div className={styles.blank}></div>
                                            </React.Fragment>
                                        )
                                        }
                                    }) : null }
                                </div>
                            </div>
                            
                            <div style={{textAlign:"left"}}>
                                <div className={styles.illustration_icon_above}></div>
                                <div className={styles.illustration_above}>{formatMessage({id: 'word.above.overview'})}</div>
                                <div className={styles.icon_above_right}></div>
                                <div className={styles.illustration_above_right}>{formatMessage({id: 'word.above_right.overview'})}</div>
                            </div>
                        </div>
                        </Card>
                    </Col>
                    {/* 告警信息 */}
                    <WaringInfo { ...returnWaringInfoProps } />
                    <Col x1={12} lg={12} sm={24} xs={24} style={{marginBottom:24}}>
                        <Card title = {formatMessage({id: 'system.resource'})} style={{fontSize:20}} headStyle={{fontSize:20,fontWeight:700}} bodyStyle={{padding:24}}>
                            <Col span={12}>
                                <Pie
                                    
                                    color= {color_memory}
                                    percent={memory_usage}
                                    total={memory_usage+"%"}
                                    height={110}
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
                                    height={110}
                                />
                                <div className={styles.memory_utilization}>
                                    {formatMessage({id: 'cpu.utilization.picture'})}
                                </div>
                            </Col>
                        </Card>
                    </Col>
                    <Col x1={12} lg={12} sm={24} xs={24} style={{marginBottom:24}}>
                        <Card title = {formatMessage({id: 'system.info'})} headStyle={{fontSize:20, fontWeight:700}}>
                        <Col x1={9} lg={9} sm={24} xs={24}>
                        <div className={styles.hostname_fixed}>{formatMessage({id: 'host.name'})}</div>
                        <div className={styles.product_number_fixed}>{formatMessage({id: 'product.number'})}</div>
                        <div className={styles.system_version_fixed}>{formatMessage({id: 'system.version'})}</div>
                        <div className={styles.management_ip_fixed}>{formatMessage({id: 'management.ip'})}</div>
                        <div className={styles.management_mac_fixed}>{formatMessage({id: 'management.mac'})}</div>
                        </Col>
                        <Col x1={15} lg={15} sm={24} xs={24}>
                        <div><span className={styles.hostname_value}>{hostname}</span></div>
                        <div><span className={styles.product_number_value}>{product_name}</span></div>
                        <div><span className={styles.system_version_value}>{nos_version}</span></div>
                        <div><span className={styles.management_ip_value}>{Mgmt_Ip}</span></div>
                        <div><span className={styles.management_mac_value}>{Mgmt_Mac}</span></div>
                        </Col>
                        </Card>
                    </Col>
                </Row>
                <Row>
                <Col>
                <Card title = {formatMessage({id:'total.throughout'})} headStyle={{fontSize:20,fontWeight:700}} bodyStyle={{padding:24}}>
                <Chart height={400} data={data} scale={cols} forceFit>
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
