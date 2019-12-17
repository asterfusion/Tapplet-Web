import React, {Component} from 'react';
import { Card, Button, Form, Modal, Divider, Input, Transfer, Switch, Select, message, List, InputNumber, Table } from 'antd';
import styles from './groups.less';
import formStyles from './groupforms.less';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import FormItem from 'antd/es/form/FormItem';
import { bubbleSort, deduplication } from '../../utils/tools'
import { RegexPattern } from './validatePattern'

const { pat_groupname, pat_wrr, pat_mac, pat_ip, pat_layer } = RegexPattern

//入接口组配置
class IgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetkeys: [],
            ddChecked: false,
            tupleChecked: false,
        }
    }

    componentDidMount() {
        this.initTargetKeys()
    }
    /**
     * 更新穿梭框值前使值顺序排列
     */
    transHandler = (t) => {
        this.setState({
            targetkeys: bubbleSort(t),
        })
    }

    initTargetKeys = () => {
        const { groupInfo } = this.props
        let initKeys = groupInfo.interlist.map((i) => {
            let strToNum = parseInt(i.replace("X","").trim())-1;
            let res = strToNum.toString();
            return res
        })
        this.setState({
            targetkeys: initKeys
        })
    }

    render() {
        const { targetkeys } = this.state;
        const { Mode, modalVisible, type, groupInfo, form, ports, canWrite, currentPolicy } = this.props;
        const { getFieldDecorator, validateFields, getFieldValue } = form;
        
        let modalValues = groupInfo;
        let isDedup = modalValues.deduplication == 0 || modalValues.deduplication == undefined ? false : true
        let tuplemode = modalValues.tuple_mode == 0 || modalValues.tuple_mode == undefined ? false : true
        const isConnect = groupInfo.connect//有规则组的时候不能添加删除端口

        return (
                <>
                    <Form.Item
                      label={formatMessage({id:'app.policy.groupname'})}
                      wrapperCol={{span:5}}
                      >
                        {getFieldDecorator("name",{
                            initialValue: modalValues.name,
                            rules: [{
                                required: true,
                                validator: (rule, value, callback) => {
                                    try{
                                        if(value != undefined && value != ""){
                                            let iname = []
                                            if(Mode == 'Add'){
                                                currentPolicy.map((i)=>{
                                                    iname.push(i["name"])
                                                })
                                                if(iname.indexOf(value) !== -1) {
                                                    throw new Error(formatMessage({id:"app.policy.msg.groupname.format.duplication"})) 
                                                }
                                            }
                                            if(value != "" && !pat_groupname.test(value)){
                                                throw new Error(formatMessage({id:"app.policy.msg.groupname.format"}))
                                            }
                                            if(value.length > 15){
                                                throw new Error(formatMessage({id:"app.policy.msg.groupname.format.length"}))
                                            }
                                        }else{
                                            throw new Error(formatMessage({id:"app.policy.msg.groupname"}))
                                        }
                                    }catch(err){
                                        callback(err)
                                    }finally{
                                        callback()
                                    }
                                } 
                            }],
                        })(<Input disabled={Mode == 'Edit'}/>)}
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({id:'app.policy.description'})}
                      wrapperCol={{span:12}}
                      >
                        {getFieldDecorator("description",{
                            initialValue: modalValues.description,
                            rules:[{max: 100, message: formatMessage({id:"app.users.user.msg.description.format.length"})},]
                        })(<TextArea placeholder={formatMessage({id:"app.users.user.description.tip"})} autosize={{minRows: 3, maxRows: 6 }} disabled={!canWrite}/>)}
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({id:'app.policy.interfaces'})}
                      >
                        {getFieldDecorator("interlist",{
                            initialValue: targetkeys,
                            rules: [{required: true, message: formatMessage({id:"app.policy.msg.port"})}],
                        })(<Transfer
                            dataSource={ports}
                            render={item => item.title}
                            targetKeys={targetkeys}
                            listStyle={{
                                width: 200,
                                height: 200
                            }}
                            onChange={this.transHandler}
                            showSearch
                            disabled={!canWrite || isConnect}
                        ></Transfer>)}
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({id:'app.policy.deduplication'})}
                      >
                        {getFieldDecorator("deduplication",{
                            initialValue: isDedup,
                        })(<Switch 
                                checkedChildren={formatMessage({id:'app.policy.deduplication.option1'})} 
                                unCheckedChildren={formatMessage({id:'app.policy.deduplication.option2'})}
                                checked={getFieldValue("deduplication")}
                                disabled={!canWrite}
                            ></Switch>)
                        }
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({id:'app.policy.tuple'})}
                      >
                        {getFieldDecorator("tuple_mode",{
                            initialValue: tuplemode,
                        })(<Switch 
                                checkedChildren={formatMessage({id:'app.policy.tuple.option1'})} 
                                unCheckedChildren={formatMessage({id:'app.policy.tuple.option2'})}
                                checked={getFieldValue("tuple_mode")}
                                disabled={!canWrite}
                            ></Switch>)}
                    </Form.Item>
                </>
        )
    }
}

//出接口组配置
class EgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetkeys: []
        }
    }

    componentDidMount(){
        this.initTargetKeys()
    }
    /**
     * 更新穿梭框值前使值顺序排列
     */
    transHandler = (t) => {
        this.setState({
            targetkeys: bubbleSort(t),
        })
    }

    initTargetKeys = () => {
        const { groupInfo } = this.props
        let initKeys = groupInfo.interlist.map((i) => {
            let strToNum = parseInt(i.replace("X","").trim())-1;
            let res = strToNum.toString();
            return res
        })
        this.setState({
            targetkeys: initKeys
        })
    }

    render() {
        const { targetkeys } = this.state
        const { Mode, type, groupInfo, form, ports, isCopy, canWrite, currentPolicy } = this.props
        const { getFieldDecorator, validateFields, getFieldValue } = form

        let modalValues =  groupInfo
        let loadBalance =  groupInfo.loadbalance

        //CopyFrom
        let commonONameOptions = []
        currentPolicy.map((i)=>{
            if(i["copy"] !== 1 && typeof i["connect"] !== "undefined"){
                commonONameOptions.push(i["name"])
            }
        })
        let lbOptions = {}
        //多个端口必须LoadBalance
        const tlen = targetkeys.length
        if(!isCopy){
            lbOptions = tlen > 1 ? {
            initialValue: {
                mode: loadBalance.mode,
                weight: loadBalance.weight
            },
            rules: [{required:true, message: formatMessage({id:"app.policy.msg.loadbalance"})},
            {//暂时没问题
                type: "object",
                validator: (rule, value, callback) => {
                    
                    let wrrArr = value.weight.split(":")
                    let hasVoid = false
                    wrrArr.forEach((i)=>{
                        if(i==""){
                            hasVoid = true
                        }
                    })
                    if(value.mode == "" && value.weight == "") {
                        callback(formatMessage({id:"app.policy.msg.loadbalance"})) 
                    }
                    /**
                     * 判断wrr模式下权重配置是否为空
                     */
                    if(value.mode == "wrr" && hasVoid) {
                        callback(formatMessage({id:"app.policy.msg.loadbalance.wrr"})) 
                    }
                    /**
                     * 判断权重配置的格式是否正确
                     */
                    wrrArr.forEach((i)=>{
                        if(value.mode == "wrr" && (parseInt(i) > 100000 || parseInt(i) < 1)){
                            callback(formatMessage({id:"app.policy.msg.loadbalance.wrr.format"}))
                        }
                    })
                    if(value.mode == "wrr" && !pat_wrr.test(value.weight)){
                        callback(formatMessage({id:"app.policy.msg.loadbalance.wrr.format"})) 
                    }
                    callback()
                } 
            }]
        } : null }
        // {
        //     initialValue: {
        //         mode: loadBalance.mode,
        //         weight: loadBalance.weight
        // }}}
        return (
            <>
                    <Form.Item
                      label={formatMessage({id:'app.policy.groupname'})}
                      wrapperCol={{span:5}}
                      >
                        {getFieldDecorator("name",{
                            initialValue: modalValues.name,
                            rules: [{
                                required: true,
                                validator: (rule, value, callback) => {
                                    try{
                                        if(value != undefined && value != "" ){
                                            let oname = []
                                            if(Mode == 'Add'){
                                                currentPolicy.map((i)=>{
                                                    oname.push(i["name"])
                                                })
                                                if(oname.indexOf(value) !== -1) {
                                                    throw new Error(formatMessage({id:"app.policy.msg.groupname.format.duplication"})) 
                                                }
                                            }
                                            if(!pat_groupname.test(value)){
                                                throw new Error(formatMessage({id:"app.policy.msg.groupname.format"}))
                                            }
                                            if(value.length > 15){
                                                throw new Error(formatMessage({id:"app.policy.msg.groupname.format.length"}))
                                            }
                                        }else{
                                            throw new Error(formatMessage({id:"app.policy.msg.groupname"}))
                                        }
                                    }catch(err){
                                        callback(err)
                                    }finally{
                                        callback()
                                    }
                                } 
                            }],
                        })(<Input disabled={Mode == 'Edit'}/>)}
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({id:'app.policy.description'})}
                      wrapperCol={{span:12}}
                      >
                        {getFieldDecorator("description",{
                            initialValue: modalValues.description,
                            rules:[{max: 100, message: formatMessage({id:"app.users.user.msg.description.format.length"})},]
                        })(<TextArea placeholder={formatMessage({id:"app.users.user.description.tip"})} autosize={{minRows: 3, maxRows: 6 }} disabled={!canWrite}/>)}
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({id:'app.policy.interfaces'})}
                      >
                        {getFieldDecorator("interlist",{
                            initialValue: targetkeys,
                            rules: [{required: true, message: formatMessage({id:"app.policy.msg.port"})}],
                        })(<Transfer
                            dataSource={ports}
                            render={item => item.title}
                            targetKeys={targetkeys}
                            listStyle={{
                                width: 200,
                                height: 200
                            }}
                            onChange={this.transHandler}
                            showSearch
                            disabled={!canWrite}
                        ></Transfer>)
                        }
                    </Form.Item>
                    {
                        !isCopy && tlen > 1 ? <Form.Item
                        label={formatMessage({id:'app.policy.loadbalance'})}
                        wrapperCol={{span:8}}
                        >
                            {getFieldDecorator("loadbalance",lbOptions)(<LoadBalance 
                                targetkeys={targetkeys}
                                canWrite={canWrite}
                            ></LoadBalance>)
                            }
                        </Form.Item> : null
                    }
                    {
                        isCopy ? <Form.Item
                        label={formatMessage({id:'app.policy.copyFrom'})}
                        wrapperCol={{span:8}}
                        >
                            {getFieldDecorator("copyFrom",{
                                initialValue: modalValues.copyFrom,
                            })(<Select showSearch>
                                {
                                    commonONameOptions.map((item) => {
                                    return <Select.Option key={item} value={item}>{item}</Select.Option>
                                    })
                                }
                            </Select>)
                            }
                        </Form.Item> : null
                    }
                </>
        )
    }
}
class LoadBalance extends Component {
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
    /**
     * 根据targetkeys读取端口号，根据value{mode:"",weight:""}中的weight读取端口对应的权重
     * 拆分比例{name:"Portx",weiht:""}    
     */
    wsTow = () => {
        const { targetkeys, value } = this.props;    
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
            let res = "Port" + num;
            //新增t后清空weight
            if(wlen == tlen) {
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
    }

    render() {
        const { targetkeys, value, canWrite } = this.props;
        const { modeSelected, newPorts, isWRR } = this.state;
        console.log(targetkeys)
       
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
                            <Select.Option key='3' value={"outer_srcdstip"}>Outer_Src_Dist_IP</Select.Option>
                            <Select.Option key='4' value={"outer_srcip"}>Outer_Src_IP</Select.Option>
                            <Select.Option key='5' value={"outer_dstip"}>Outer_Dist_IP</Select.Option>
                            <Select.Option key='6' value={"inner_srcdstip"}>Inner_Src_Dist_IP</Select.Option>
                            <Select.Option key='7' value={"inner_srcip"}>Inner_Src_IP</Select.Option>
                            <Select.Option key='8' value={"inner_dstip"}>Inner_Dist_IP</Select.Option>
                        </Select>
                    </div>
                </div>
                {
                    isWRR&&!selectDisabled ? <div>
                        <div className={styles.loadBalanceLabel}>{formatMessage({id:'app.policy.loadbalance.labe2'})}</div>
                        <div className={styles.loadBalenceWeight}>
                            {
                                newPorts.map((port,index) => {
                                    console.log(port.weight,index)
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

//出接口组高级配置
class AEgressForm extends Component {
    constructor(props){
        super(props)
    }

    render(){
        const { form, Mode, groupInfo, canWrite } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        let adActionValues = groupInfo.additional_actions;

        let remHeaderValues = [];
        remHeaderValues.push({
            vlan: {
                switch: adActionValues.remove_tunnel_header_vlan.switch,
                vlan_layers: adActionValues.remove_tunnel_header_vlan.vlan_layers,
            }
        },{
            mpls: {
                switch: adActionValues.remove_tunnel_header_mpls.switch,
                mpls_layers: adActionValues.remove_tunnel_header_mpls.mpls_layers,
            }
        },{
            vxlan: {
                switch: adActionValues.remove_tunnel_header_vxlan.switch,
            }
        },{
            gre: {
                switch: adActionValues.remove_tunnel_header_gre.switch,
                remove_tunnel_header_gre_update_crc: 0
            }
        })
        
        return (
            <>
                    <Form.Item>    
                        {getFieldDecorator("gre_encapsulation",{
                            initialValue: {
                                switch: adActionValues.gre_encapsulation.switch,
                                gre_dmac: adActionValues.gre_encapsulation.gre_dmac,
                                gre_dip: adActionValues.gre_encapsulation.gre_dip,
                            }
                        })(<GreEncapsulation canWrite={canWrite} form={form}/>)}
                    </Form.Item>  
                    <Form.Item>    
                        {getFieldDecorator("time_stamping",{
                            initialValue: {
                                switch: adActionValues.time_stamping.switch,
                            }
                        })(<Tagging canWrite={canWrite} form={form}/>)}
                    </Form.Item>
                    <Form.Item>    
                        {getFieldDecorator("slicing",{
                            initialValue: {
                                switch: adActionValues.slice.switch,
                                slice_bytes: adActionValues.slice.slice_bytes,
                                slice_flag_update: 1,
                            }
                        })(<Slicing canWrite={canWrite} form={form} />)}
                    </Form.Item> 
                    <Form.Item>    
                        {getFieldDecorator("remove",{
                            initialValue: remHeaderValues,
                        })(<RemoveHeader form={form} canWrite={canWrite} />)}
                    </Form.Item>  
            </> 
        )
    }
}
class GreEncapsulation extends Component {
    constructor(props){
        super(props)
    }

    handleSwitchChange = (e) => {
        const { onChange, form, value } = this.props
        const { getFieldValue } = form
        onChange({
            switch: e ? 1 : 0,
            gre_dmac: getFieldValue("gre_dmac") || value.gre_dmac,
            gre_dip: getFieldValue("gre_dip") || value.gre_dip
        })
    }
    handleDMacChange = (e) => {
        const { onChange, form } = this.props
        const { getFieldValue } = form
        onChange({
            switch: getFieldValue("gre_switch") ? 1 : 0,
            gre_dmac: e.target.value,
            gre_dip: getFieldValue("gre_dip")
        })
    }
    handleDIpChange = (e) => {
        const { onChange, form } = this.props
        const { getFieldValue } = form
        onChange({
            switch: getFieldValue("gre_switch") ? 1 : 0,
            gre_dmac: getFieldValue("gre_dmac"),
            gre_dip: e.target.value,
        })
    }
    render(){
        const { canWrite, form, value } = this.props
        const { getFieldDecorator, getFieldValue } = form
        let isGre = value.switch == 1 ? true : false
        
        return (
            <fieldset>
                <legend style={{width: "fit-content", border: 0}}>{formatMessage({id:'app.policy.gre_encapsulation'})}</legend>
                        
                <Form.Item 
                    label={formatMessage({id:'app.policy.gre_encapsulation.switch'})}
                    labelCol={{span: 6}} 
                    wrapperCol={{span: 15}}
                >{
                    getFieldDecorator("gre_switch",{
                        initialValue: value.switch == 1 ? true : false,
                    })(<Switch 
                        id="greEncSwicth" 
                        checkedChildren={formatMessage({id:'app.policy.on'})} 
                        unCheckedChildren={formatMessage({id:'app.policy.off'})} 
                        checked={getFieldValue("gre_switch")} 
                        disabled={!canWrite}
                        onChange={this.handleSwitchChange}
                    ></Switch>)}
                </Form.Item>
                {
                    isGre ? <div>
                        <Form.Item 
                            label={formatMessage({id:'app.policy.gre_encapsulation.dmac'})}
                            labelCol={{span: 6}} 
                            wrapperCol={{span: 15}}
                        >{
                            getFieldDecorator("gre_dmac",{
                                initialValue: value.gre_dmac,
                                rules:[{
                                    required: true,
                                    validator: (rule, value, callback) => {
                                        console.log("gredmac校验：")
                                        try{
                                            if(value != undefined && value != ""){
                                                if(!pat_mac.test(value)){
                                                    throw new Error(formatMessage({id:"app.policy.msg.addform.format.gremac"}))
                                                }
                                            }else{
                                                throw new Error(formatMessage({id:"app.policy.msg.addform.gremac"}))
                                            }
                                        }catch(err){
                                            callback(err)
                                        }finally{
                                            callback()
                                        }      
                                    }
                                }]
                            })(<Input id="greDmac" placeholder="(e.g. 00:16:EA:AE:3C:40)" style={{width: "200px"}} disabled={!canWrite} onChange={this.handleDMacChange}/>)}
                        </Form.Item>
                        <Form.Item 
                            label={formatMessage({id:'app.policy.gre_encapsulation.dip'})}
                            labelCol={{span: 6}} 
                            wrapperCol={{span: 15}}
                        >{
                            getFieldDecorator("gre_dip",{
                                initialValue: value.gre_dip,
                                rules:[{
                                    required: true,
                                    validator: (rule, value, callback) => {
                                        console.log("gredip校验：",value)
                                        try{
                                            if(value != undefined && value != ""){
                                                if(!pat_ip.test(value)){
                                                    throw new Error(formatMessage({id:"app.policy.msg.addform.format.greip"}))
                                                }
                                            }else{
                                                throw new Error(formatMessage({id:"app.policy.msg.addform.greip"}))
                                            }
                                        }catch(err){
                                            callback(err)
                                        }finally{
                                            callback()
                                        }
                                    }
                                }]
                            })(<Input id="greIp" placeholder="(e.g. 192.168.1.1)" style={{width: "200px"}} disabled={!canWrite} onChange={this.handleDIpChange}/>)}
                        </Form.Item>
                    </div> : null
                }
            </fieldset>
        )
    }
}
class Tagging extends Component {
    constructor(props){
        super(props)
    }
    handleTSChange = (v) => {
        const { onChange } = this.props
        let s = v == true ? 1 : 0;
        onChange({switch: s})
    }

    render(){
        const { canWrite, form, value } = this.props
        const { getFieldDecorator, getFieldValue } = form
        return (
            <fieldset>
                <legend style={{width: "fit-content", border: 0}}>{formatMessage({id:'app.policy.tagging'})}</legend>
                <Form.Item 
                    label={formatMessage({id:'app.policy.tagging.time_stamping'})}
                    labelCol={{span: 6}} 
                    wrapperCol={{span: 15}}
                >{
                    getFieldDecorator("tag_switch",{
                        initialValue: value.switch == 1 ? true : false,
                    })(<Switch 
                        id="tsSwitch" 
                        checkedChildren={formatMessage({id:'app.policy.on'})} 
                        unCheckedChildren={formatMessage({id:'app.policy.off'})}
                        checked={getFieldValue("tag_switch")}  
                        onChange={this.handleTSChange}
                        disabled={!canWrite}
                    ></Switch>)}
                </Form.Item>
            </fieldset>
        )
    }
}
class Slicing extends Component {
    constructor(props){
        super(props)
    }

    handleSwitchChange = (e) => {
        const { onChange, form, value } = this.props
        const { getFieldValue } = form
        onChange({
            switch: e ? 1 : 0,
            slice_bytes: getFieldValue("slice_bytes") || value.slice_bytes,
            slice_flag_update: 1,
        })
    }

    handleBytesChange = (e) => {
        const { onChange, form } = this.props
        const { getFieldValue } = form
        onChange({
            switch: getFieldValue("slice_switch") ? 1 : 0,
            slice_bytes: e,
            slice_flag_update: 1,
        })
    }

    render(){
        const { canWrite, value, form } = this.props
        const { getFieldDecorator } = form
        let isSlice = value.switch == 1 ? true : false
        return (
            <fieldset>
                <legend style={{width: "fit-content", border: 0}}>{formatMessage({id:'app.policy.slicing'})}</legend>
                <div>
                    <Form.Item 
                        label={formatMessage({id:'app.policy.slicing.switch'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >{
                        getFieldDecorator("slice_switch",{
                            initialValue: value.switch == 1 ? true : false,
                        })(<Switch 
                            id="sliceSwitch" 
                            checkedChildren={formatMessage({id:'app.policy.on'})} 
                            unCheckedChildren={formatMessage({id:'app.policy.off'})} 
                            checked={isSlice} 
                            onChange={this.handleSwitchChange}
                            disabled={!canWrite}
                        ></Switch>)}
                    </Form.Item>
                    
                </div>
                {
                    isSlice ? <Form.Item 
                        label={formatMessage({id:'app.policy.slicing.slice_bytes'})}
                        labelCol={{span: 6}} 
                        wrapperCol={{span: 15}}
                    >{
                        getFieldDecorator("slice_bytes",{
                            initialValue: value.slice_bytes,
                            rules:[{required: true, message: formatMessage({id:"app.policy.msg.addform.slicing.slice_bytes"})}]}
                        )(<InputNumber
                            id="sliceBytes"
                            placeholder="(40-1550, e.g.60)"
                            onChange={this.handleBytesChange}
                            max={1550}
                            min={40}
                            style={{width: '150px'}}
                            disabled={!canWrite}
                        ></InputNumber>)}
                    </Form.Item> : null
                }
            </fieldset>
        )
    }
}

//React Context 可编辑单元格
const EditableFormRow = ({...props}) => {
    return (
        <tr {...props} />
)}
class EditableCell extends React.Component {
    state = {
        editing: false,
    }
    /**
     * 改变editing状态
     */
    toggleEdit = () => {
        const { setIsEditingRow, record } = this.props
        const editing = !this.state.editing
        this.setState({ editing }, () => {
            if(editing) {
                this.input.focus()
                setIsEditingRow(record.protocol)
            }else{
                setIsEditingRow("")
            }
        })
    }
    /**
     * 失焦时保存编辑单元格的值
     */
    save = e => {
        const { record, handleSave, form, dataIndex } = this.props
        form.validateFields([dataIndex],(error, values) => {
            if(error && error[e.currentTaret.id]){
                return
            }
            let saveValue = {layers: values["layers"]}
            this.toggleEdit();
            handleSave({...record, ...saveValue})
        })
    }
    /**
     * 渲染可编辑单元格
     */
    renderCell = () => {
        const { children, dataIndex, record, title, form } = this.props
        const { getFieldDecorator } = form
        const { editing } = this.state
        return editing ? (
            <Form.Item
                wrapperCol={{span: 22}} 
                style={{ margin: 0 }}
            >
                {
                    getFieldDecorator(dataIndex,{
                        rules: [{
                            required: true,
                            message: formatMessage({id:"app.policy.msg.addform.editRemove"})
                        },{
                            validator: (rule, value, callback) => {
                                if(value != undefined && value !== "" && !pat_layer.test(value)){
                                    callback(formatMessage({id:"app.policy.msg.addform.format.editRemove"}))
                                }
                                callback()
                            }
                        }],
                        initialValue: record[dataIndex]//node代表input的dom元素，可以通过this.input使用dom元素的方法，如focus()
                    })(<Input placeholder="(1-15, e.g.1,2,5 or 1,2-8,15)" ref={node => (this.input = node)} onBlur={this.save}></Input>)
                }
            </Form.Item>
        ) : (
            <div
                className={formStyles.editable_cell_value_wrap}
                onClick={this.toggleEdit} 
            >
                {children}
            </div>
        )
    }

    render(){
        const { editable, dataIndex, title, record, index, handleSave, setIsEditingRow, children, form, ...restProps} = this.props
        return (
            <td {...restProps}>
                {
                    editable ? (
                        this.renderCell()
                    ) : (
                        children
                    )
                }
            </td>
        )
    }
}
class RemoveHeader extends Component {
    constructor(props){
        super(props)
        this.columns = [
            {
                align: 'left',
                title: formatMessage({id:'app.policy.removeheader.header.protocol'}),
                dataIndex: 'protocol'
            },
            {
                align: 'left',
                title: formatMessage({id: 'app.policy.removeheader.header.layers'}),
                dataIndex: 'layers',
                editable: true,
            }
        ]
        this.nolayer = [2,3]
        this.state = {
            isRemove: false,
            protocols: [{
                key: '0',
                protocol: 'VLAN',
                layers: ''
            }, {
                key: '1',
                protocol: 'MPLS',
                layers: ''
            }, {
                key: '2',
                protocol: 'VXLAN',
            }, {
                key: '3',
                protocol: 'GRE',
            }],
            selectedRowKeys: [],
            remHeaderValues: [],
            isEditingRow: ""
        }
    }

    componentDidMount(){
        const { value } = this.props
        const { protocols } = this.state
        let isSwitch = false
        let sk = []
        protocols.map((i,index) => {
            let name = i.protocol.toLowerCase()
            let layer_name = name+'_layers'
            if(value[index][name]['switch'] == 1) {//checkbox
                isSwitch = true
                sk.push(i.key)
            }
            if(typeof protocols[index].layers == "string") {
                protocols[index].layers = this.liToStr(value[index][name][layer_name])//layers
            }
        })
        this.setState({
            isRemove: isSwitch,
            protocols: protocols,
            selectedRowKeys: sk,
            remHeaderValues: value,
        })
    } 
    /**
     * 把数字列表变成字符串
     */
    liToStr = (li) => {
        let s, e, seqCnt=0;
        let len = li.length;
        let nli = [], nstr;

        if(len > 2){
            let bbn = li[0]
            let bn = li[1]
            if(bn == bbn + 1){ seqCnt++ }else{ nli.push(bbn) }
            li.map((i,index) => {
                if(i == li[0] || i == li[1]){}
                else if(i == bn + 1){
                    seqCnt++
                    if(seqCnt == 2){
                        s = bbn
                        e = i
                        bbn = bn
                        bn = i
                        if(index == len - 1) {
                            nli.push((s+'-'+e))
                            seqCnt = 0
                        }
                    }else if(seqCnt >= 2){
                        bbn = bn
                        e = i
                        bn = i
                        if(index == len - 1) {
                            nli.push((s+'-'+e))
                            seqCnt = 0
                        }
                    }else {
                        bbn = bn
                        bn = i
                    }
                }else if(seqCnt >= 2){
                    nli.push((s+'-'+e))
                    seqCnt = 0
                    bbn = bn
                    bn = i
                }else {
                    if(index == len - 1) {
                        nli.push(bn)
                        nli.push(i)
                        seqCnt = 0
                    }else if(seqCnt == 1){
                        nli.push(bbn)
                        nli.push(bn)
                    }else {
                        nli.push(bn)
                    }
                    seqCnt = 0
                    bbn = bn
                    bn = i
                }
            })
            nstr = nli.join(',').trim() 
        }
        else {
            nstr = li.join(',').trim()
        }
        return nstr
    }
    /**
     * 把字符串变成数字列表
     */
    strToLi = (str) => {
        if(str == "") return []
        str.trim()
        let nstr = str.split(',')
        let nstr1 = [], nstr2 = []
        nstr.map((i) => {
            let num 
            if(i.indexOf('-') == -1) {
                num = parseInt(i)
                nstr1.push(num)
            }else {
                let q = i.split('-')
                let s = parseInt(q[0]) < parseInt(q[1]) ? parseInt(q[0]) : parseInt(q[1])
                let e = parseInt(q[0]) > parseInt(q[1]) ? parseInt(q[0]) : parseInt(q[1])
                for(let j = s; j < e+1; j++){
                    nstr1.push(j)
                }
            }
        })
        nstr2 = deduplication(nstr1)
        return bubbleSort(nstr2)
    }

    handleRemoveChange = (v) => {
        const { onChange } = this.props
        const { isRemove, protocols, selectedRowKeys, remHeaderValues } = this.state
        this.setState({
            isRemove: v,
        })
        if(v) {
            onChange(remHeaderValues)
        } else {
            protocols.map((i,index) => {
                let name = i.protocol.toLowerCase()
                remHeaderValues[index][name]['switch'] = 0 
            })
            this.setState({
                remHeaderValues,
            })
            onChange(remHeaderValues)
        }
    }
    /**
     * 选中某一行时的回调函数，更新selectedRowKeys和remHeaderValues
     */
    onSelectChange = (selectedRowKeys, selectedRows) => {
        const { onChange } = this.props
        const { isRemove, protocols, remHeaderValues } = this.state
        this.setState({ 
            selectedRowKeys, 
        })
        protocols.map((i,index) => {
            let name = i.protocol.toLowerCase()
            let layer_name = name + "_layers"
            if(selectedRowKeys.indexOf(i.key) !== -1) {
                remHeaderValues[index][name]['switch'] = 1
                if(typeof i.layers == "string") remHeaderValues[index][name][layer_name] = this.strToLi(i.layers)
            }else {
                remHeaderValues[index][name]['switch'] = 0
                if(typeof i.layers == "string") remHeaderValues[index][name][layer_name] = this.strToLi(i.layers)
            }
        })
        console.log("改了之后的rhv------------->",remHeaderValues)
        this.setState({
            remHeaderValues,
        })
        onChange(remHeaderValues)
    }
    /**
     * 编辑单元格的回调函数，更新protocols和remHeaderValues
     */
    handleSave = row => {
        const { selectedRowKeys, protocols, remHeaderValues } = this.state
        const { onChange } = this.props
        const newData = [...this.state.protocols]
        const index = newData.findIndex( item => row.key === item.key )
        const item = newData[index]
        newData.splice(index, 1, {
            ...item,
            ...row
        })
        this.setState({ protocols: newData })
        newData.map((i,index) => {
            let name = i.protocol.toLowerCase()
            let layer_name = name + "_layers"
            if(selectedRowKeys.indexOf(i.key) !== -1) {
                remHeaderValues[index][name]['switch'] = 1
                if(typeof i.layers == "string") remHeaderValues[index][name][layer_name] = this.strToLi(i.layers)
            }else {
                remHeaderValues[index][name]['switch'] = 0
                if(typeof i.layers == "string") remHeaderValues[index][name][layer_name] = this.strToLi(i.layers)
            }
        })
        console.log("改了之后的rhv------------->",remHeaderValues)
        this.setState({
            remHeaderValues,
        })
        onChange(remHeaderValues)
    }

    setIsEditingRow = (row) => {
        this.setState({
            isEditingRow: row
        })
    }

    render(){
        const { value, form, canWrite } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const { isRemove, isEditingRow, protocols, selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            columnWidth: 10,
            getCheckboxProps: record => (!canWrite ? {
                disabled: record.key == "0" || "1" || "2" || "3",
            } : null),
          }      
        const columns = this.columns.map(col => {
            if(!col.editable) {
                return col
            }
            
            return {
                ...col,
                width: 200,
                onCell: (record, rowIndex) => {//设置某一列的单元格属性

                    let editable = ((isEditingRow == record.protocol || isEditingRow == "")&&col.editable&&this.nolayer.indexOf(rowIndex) == -1&&canWrite) ? true : false
                    return {
                        record,
                        form: form,
                        editable: editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        handleSave: this.handleSave,
                        setIsEditingRow: this.setIsEditingRow
                    }
                }
            }
        })
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell//React.ReactType类型，似乎不能传参
            }
        }
        console.log(value)
        return (
            <fieldset>
                <legend style={{width: "fit-content", border: 0}}>{formatMessage({id:'app.policy.removeheader'})}</legend>
                <Form.Item 
                    label={formatMessage({id:'app.policy.removeheader.switch'})}
                    labelCol={{span: 6}} 
                    wrapperCol={{span: 15}}
                >{
                    getFieldDecorator("remove_switch",{
                        initialValue: value.switch == 1 ? true : false,
                    })(<Switch 
                        id="removeSwitch" 
                        checkedChildren={formatMessage({id:'app.policy.on'})} 
                        unCheckedChildren={formatMessage({id:'app.policy.off'})} 
                        checked={isRemove} 
                        onChange={this.handleRemoveChange} 
                        disabled={!canWrite}></Switch>)}
                </Form.Item>
                {
                    isRemove ? <div>
                        <FormItem
                            label={formatMessage({id:'app.policy.removeheader.header'})}
                            labelCol={{span: 6}} 
                            wrapperCol={{span: 18}}
                        >
                        {
                             getFieldDecorator("remove_table",{
                                initialValue: value.switch == 1 ? true : false,
                            })(<Table
                                id="removeHeader"
                                rowSelection={rowSelection}//表格是否可选择
                                columns={columns}
                                dataSource={protocols}
                                components={components}
                                size={"small"}
                                rowClassName={() => formStyles.editable_row}
                                pagination={false}
                            >
                            </Table>)
                        }
                        </FormItem>
                    </div> : null
                }
            </fieldset>
        )
    }
}
export { IgressForm, EgressForm, AEgressForm };