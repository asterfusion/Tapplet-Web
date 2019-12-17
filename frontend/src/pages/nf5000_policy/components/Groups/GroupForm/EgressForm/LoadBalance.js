import React, { Component } from 'react'
import { Form, Input, Select, message } from 'antd'
import styles from '../../groups.less'
import { formatMessage } from 'umi/locale'


export default class LoadBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPorts: this.wsTow(),
            isWRR: false,
        }
    }

    componentDidMount() {
        const { value } = this.props;
        const { newPorts } = this.state;
        let WRR = typeof value !== "undefined" && value.mode == "wrr" ? true : false;
        if(WRR) {
            this.setState({
                newPorts: this.wsTow(),
                isWRR: true,
            }) 
        }
    }

    componentDidUpdate(prevProps){
        const { isWRR } = this.state;
        if(this.props.targetkeys !== prevProps.targetkeys) {
            if(isWRR) {
                this.setState({
                    newPorts: this.wsTow(),
                    isWRR: true,
                })
            }
        }
    }

    wsTow = () => {//根据targetkeys读取端口号，根据value中的weight读取端口对应的权重
        const { targetkeys, value } = this.props;
        //拆分比例        
        let patt = /[^:]+/g;
        let wlist = [];
        while(true){
            let match = patt.exec(value.weight);
            if(!match) break;

            let w;
            if(match[0] == "undefined") w = "";
            else w = match[0];
            wlist.push(w);
        }

        let wlen = wlist.length;
        let tlen = targetkeys.length;
        let newPorts = []; 
        targetkeys.map((i,index) => {
            let num = parseInt(i) + 1;
            let res = '';
            res = "G" + num; 
            if(wlen == tlen) {//新增t后清空weight
                let w = wlist[index];
                newPorts.push({name:res, weight:w});
            }else newPorts.push({name:res, weight:''})
        })
        return newPorts;
    }

    wTows = () => {
        const { newPorts } = this.state;
        let wlist = [];
        newPorts.map((i) => {
            wlist.push(i.weight);
        })
        let ws = "";
        wlist.map((i,index) => {
            ws += i;
            if(index < wlist.length-1) ws += ":";
        })
        return ws;
    }

    handleSelect = (v) => {
        const { onChange } = this.props;
        const { newPorts } = this.state;
        if( v == "wrr") {
            this.setState({
                isWRR: true,
                newPorts: this.wsTow()
            })
            onChange({mode: v, weight:this.wTows()})  
        }else {
            this.setState({
                isWRR: false,
            })
            onChange({mode: v, weight:''})  
        }
    }

    handleInput = (index,e) => {
        const { onChange } = this.props;
        const { newPorts } = this.state;
        newPorts[index].weight = e.target.value;   
        this.setState({
            newPorts: newPorts,
        })
        onChange({mode: "wrr", weight:this.wTows()})      
    }////////当传入多个参数时，e自动排后///////////////newPorts还是得定义为state不然这里无法反应

    render() {
        const { targetkeys, value, canWrite } = this.props;
        const { modeSelected, newPorts, isWRR } = this.state;
       
        let selectDisabled = !canWrite || targetkeys.length == 1 || targetkeys.length == 0
        let selected = typeof value !== "undefined" ? value.mode : ""
        if(selectDisabled){
            selected = ""
        }

        return (
            <div className={styles.loadBalance}>
                <div>
                    <div className={styles.loadBalanceLabel}>{formatMessage({id:'app.policy.loadbalance.labe1'})}</div>
                    <div className={styles.loadBalanceCnt}>
                        <Select
                            value={selected}
                            onChange={this.handleSelect}
                            disabled={selectDisabled}
                        >
                            <Select.Option key='1' value={"round_robin"}>RR</Select.Option>
                            <Select.Option key='2' value={"wrr"}>WRR</Select.Option>
                            <Select.Option key='3' value={"outer_src_dst_ip"}>Outer_Src_Dist_IP</Select.Option>
                            <Select.Option key='4' value={"outer_src_ip"}>Outer_Src_IP</Select.Option>
                            <Select.Option key='5' value={"outer_dst_ip"}>Outer_Dist_IP</Select.Option>
                            <Select.Option key='6' value={"inner_src_dst_ip"}>Inner_Src_Dist_IP</Select.Option>
                            <Select.Option key='7' value={"inner_src_ip"}>Inner_Src_IP</Select.Option>
                            <Select.Option key='8' value={"inner_dst_ip"}>Inner_Dist_IP</Select.Option>
                        </Select>
                    </div>
                </div>
                {
                    isWRR &&!selectDisabled ? <div>
                        <div className={styles.loadBalanceLabel}>{formatMessage({id:'app.policy.loadbalance.labe2'})}</div>
                        <div className={styles.loadBalenceWeight}>
                            {
                                newPorts.map((port,index) => {
                                    return (
                                        <div key={"W"+(index+1)} className={styles.weightItem}>
                                            <div className={styles.weightItem1}>
                                                <p className={styles.weightLabel}>{port.name}</p>
                                                <Input className={styles.weightInput} size={"default"} value={port.weight} onChange={this.handleInput.bind(this,index)}></Input>
                                            </div>
                                            { index !== newPorts.length-1 ? <div className={styles.weightItem2}>:</div> : null}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div> : null
                }
            </div>
        )
    }
}