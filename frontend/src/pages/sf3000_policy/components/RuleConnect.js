import react, { Component } from 'react'
import RuleGroup from './RuleGroups/RuleGroup'
import { Form, message } from 'antd'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { connect } from 'dva';
import styles from '../sf3000_policy.less'

const CreateForm_All = Form.create()(
    props => {
        return (
            <RuleGroup {...props} Mode="Add"></RuleGroup>
        )
    }
)
const EditRuleGroupForm = Form.create()(
    props => {
        return (
            <RuleGroup {...props} Mode="Edit"></RuleGroup>
        )
    }
)
@connect(({sf3000_policy})=>{
    return {
        currentCertainRuleGroup: sf3000_policy.currentCertainRuleGroup,
    }
})
export default class RuleConnect extends Component {
    constructor(props){
        super(props)
        this.state={
            isEditRule:false,
            isDeleteRGroup: {is: false, groupname: ""},
            contextMenuPosition: {left: "", top: ""},
            //loading
            ruleconfirmLoading: false,
            //
            haveDefaultRuleInterface: ""
        }
    }
    /**
     * 事件监听
     */
    _handleClick = (e) => {
        const { isDeleteRGroup } = this.state
        const wasOutside = !(e.target.contains === this.refs.rulemenu)
        
        if (wasOutside && isDeleteRGroup["is"]) this.setState({ isDeleteRGroup: {is:false, groupname:""}, })
    }
    _handleScroll = () => {
        const { isDeleteRGroup } = this.state
        
        if (isDeleteRGroup["is"]) this.setState({ isDeleteRGroup: {is:false, groupname:""}, })
    }
    componentDidMount() {
        document.addEventListener('click', this._handleClick)
        document.addEventListener('scroll', this._handleScroll)
    }
    componentWillUnmount() {
        document.removeEventListener('click', this._handleClick)
        document.removeEventListener('scroll', this._handleScroll)
    }
    /**
     * 判断规则组的入接口组中是否存在已配置default的端口
     */
    checkHasDefaultOrNot = (groupinfo, defaultRuleInterface, ingroupInterfaces) => {
        let drLength = Object.keys(defaultRuleInterface).length
        let igroupInterLength = Object.keys(ingroupInterfaces).length
        let allDrop = true
        groupinfo.rule.map((i) => {
            if(i["action"] == "1"){
                allDrop = false
            }
        })
        if ( igroupInterLength == 0 || drLength == 0 || (groupinfo.rule.length != 0 && !allDrop)){
            return true
        }

        let drValues = Object.keys(defaultRuleInterface)
        let inRuleArr = []
        ingroupInterfaces[groupinfo.ingroupname].map((i) => {
            if(defaultRuleInterface[i]){
                inRuleArr.push(i)
            }
        })

        if(inRuleArr.length > 0){
            this.setState({
            haveDefaultRuleInterface: inRuleArr.join(),
            },function (){
            message.error(formatMessage({id:'app.policy.interface'})
            +this.state.haveDefaultRuleInterface+
            formatMessage({id:'app.policy.defaultRuleExist'}))
            });
            return false;
        }
        
        return true;
    }
    /**
     * 创建规则组
     */
    handleCreateRuleGroup = (groupinfo) => {
        const { dispatch, curRGroupConnect, pageLoadingChange, refreshGroups, refreshRuleConnect, refreshCopyConnect, refreshDefaultInterfaces, closeModal,
                defaultRuleInterface, ingroupInterfaces } = this.props
        groupinfo.ingroupname = curRGroupConnect.dragName
        groupinfo.outgroupname = curRGroupConnect.dropName
        if(this.checkHasDefaultOrNot(groupinfo, defaultRuleInterface, ingroupInterfaces)){
            this.setState({
                ruleconfirmLoading: true
            })
            pageLoadingChange(true)
            dispatch({
                type: 'sf3000_policy/createRuleGroup',
                payload: groupinfo
            }).then((res)=>{
                if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.create.success'}))
                closeModal()
            }).catch((err)=>{
                message.error(formatMessage({id:'app.policy.msg.create.fail'}))
                closeModal()
            }).finally(()=>{
                pageLoadingChange(false)
                refreshDefaultInterfaces()
                refreshGroups()
                refreshRuleConnect()
                refreshCopyConnect()
                this.setState({
                    ruleconfirmLoading: false
                })
            })
        }    
    }
    /**
     * 修改规则组
     */
    isEditRGroup = (groupname) => {
        const { dispatch, pageLoadingChange } = this.props
        this.setState({
            ruleconfirmLoading: true
        })
        pageLoadingChange(true)
        dispatch({
            type: `sf3000_policy/getGroupRules`,
            payload: {"rulegroupname" : groupname}
        }).finally(()=>{
            this.setState({
                ruleconfirmLoading: false
            })
            pageLoadingChange(false)
        })
        this.setState({
            isEditRule: true,
        })
    }
    handleEditFormClose = () =>{
        this.setState({
            isEditRule: false,
        })
    }
    //点击编辑规则组modal框的确认按钮会下发新添加的规则///////////////////////////////////修改的时候不生效
    handleSubformOn = (groupinfo) => {
        const { dispatch, pageLoadingChange, refreshGroups, refreshRuleConnect, refreshCopyConnect, refreshDefaultInterfaces, } = this.props
        this.setState({
            ruleconfirmLoading: true
        })
        pageLoadingChange(true)
        dispatch({
            type: `sf3000_policy/createRule`,
            payload: {"rulegroupname": groupinfo.rulegroupname, "rule": groupinfo.rule, "description": groupinfo.description}
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.edit.success'}))
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.edit.fail'}))
        }).finally(()=>{
            this.setState({
                ruleconfirmLoading: false,
                isEditRule: false,
            },()=>{
            pageLoadingChange(false)
            refreshDefaultInterfaces()
            refreshGroups()
            refreshRuleConnect()
            refreshCopyConnect()
            })
        })  
    }
    /**
     * 删除规则组
     */
    handleIsDeleteRGroup = (groupname,e) => {
        const { getElementPosition, getMousePosition } = this.props
        e.preventDefault()
        const { contextMenuPosition } = this.state
        let svgPosition = this.refs.svgline ? getElementPosition(this.refs.svgline,"") : null
        let x = getMousePosition(e).x - svgPosition.x
        let y = getMousePosition(e).y - svgPosition.y
        this.setState({
            contextMenuPosition: {top: y+"px", left: x+"px"},
            isDeleteRGroup: {is: true, groupname: groupname}
        })
    }
    handleDeleteRGroup = () => {
        const { isDeleteRGroup } = this.state
        const { dispatch, refreshGroups, refreshRuleConnect, refreshCopyConnect, refreshDefaultInterfaces, pageLoadingChange } = this.props
        pageLoadingChange(true)
        dispatch({
            type: 'sf3000_policy/deleteRuleGroup',
            payload: {rulegroupname: isDeleteRGroup.groupname}
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.delete.success'}))
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.delete.fail'}))
        }).finally(()=>{
            this.setState({
                isDeleteRGroup: {is: false, groupname: ""}
            })
            pageLoadingChange(false)
            refreshDefaultInterfaces()
            refreshGroups()
            refreshRuleConnect()
            refreshCopyConnect()
        })
    }
    /**
     * 获取规则组连接线的坐标
     * @param {object} i 
     */
    getLinePosition(i){
        const { getElementPosition, igroupRefList, egroupRefList } = this.props
        let igress = i.ingroupname
        let egress = i.outgroupname
        let refList = {}
        let svgPosition = this.refs.svgline ? getElementPosition(this.refs.svgline,"") : {x:0,y:0}
        ////////////////////////////////////////////////////////////////////////////////////////////
        refList["igress"] = igroupRefList[igress]
        refList["egress"] = egroupRefList[egress]
        let iPosition = typeof refList["igress"] !== "undefined" && Object.prototype.toString.call(refList["igress"].current) !== "[object Null]" ? getElementPosition(refList["igress"].current.getNode(),"Igress") : svgPosition
        let ePosition = typeof refList["egress"] !== "undefined" && Object.prototype.toString.call(refList["egress"].current) !== "[object Null]" ? getElementPosition(refList["egress"].current.getNode(),"Egress") : iPosition
        let x1 = iPosition.x - svgPosition.x
        let y1 = iPosition.y - svgPosition.y
        let x2 = ePosition.x - svgPosition.x - 6
        let y2 = ePosition.y - svgPosition.y
        return { x1, y1, x2, y2 }
    }
    
    render(){
        const { currentCertainRuleGroup, currentRuleConnects, defaultRuleInterface, ingroupInterfaces, curRGroupConnect,
                svgHeight, isCreateRule, closeModal, canWrite } = this.props
        const { isEditRule, isDeleteRGroup, contextMenuPosition, ruleconfirmLoading } = this.state
        const { top, left } = contextMenuPosition
        const createRuleProps = {
            modalVisible: isCreateRule, closeModal: closeModal, handleOk: this.handleCreateRuleGroup, confirmLoading: ruleconfirmLoading, curRGroupConnect: curRGroupConnect,
            currentRuleConnects: currentRuleConnects, handleEditRuleGroup: this.isEditRGroup, defaultRuleInterface, ingroupInterfaces
        }
        const editRuleProps = {
            currentRuleGroupInfo: currentCertainRuleGroup, defaultRuleInterface, ingroupInterfaces,
            handleEditRuleGroup: this.isEditRGroup, modalVisible: isEditRule, handleOk: this.handleSubformOn, 
            confirmLoading: ruleconfirmLoading, canWrite: canWrite, closeModal: this.handleEditFormClose
        }
        return (
            <>
            <div style={{width:"100%", height:svgHeight, position:"relative"}} ref="svgline" >
                <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                    <defs>
                        <marker id="arrow1"  refX="4" refY="4" 
                            markerUnits="strokeWidth"
                            markerWidth="10" markerHeight="10"
                            orient="auto"
                        >
                            <path d="M 2 2 L 4 4 L 2 6 L 8 4 L 2 2 Z" fill={"#D01218"}/>
                        </marker>
                    </defs>
                    <defs>
                        <marker id="arrow2"  refX="4" refY="4" 
                            markerUnits="strokeWidth"
                            markerWidth="10" markerHeight="10"
                            orient="auto"
                        >
                            <path d="M 2 2 L 4 4 L 2 6 L 8 4 L 2 2 Z" fill={"#389A2B"}/>
                        </marker>
                    </defs>
                    {/*画线*/
                        currentRuleConnects.length > 0 ? currentRuleConnects.map((i,index) => {
                            let groupname = i.rulegroupname
                            let linePosition = this.getLinePosition(i)
                            let x1 = linePosition.x1
                            let y1 = linePosition.y1
                            let x2 = linePosition.x2 
                            let y2 = linePosition.y2
                            // console.log("line坐标：",x1,y1,x2,y2)
                            let mx = x1 > x2 ? x1 : x2
                            let nx = x1 < x2 ? x1 : x2
                            let my = y1 > y2 ? y1 : y2
                            let ny = y1 < y2 ? y1 : y2
                            let x = (mx - nx) * 0.5 - 10
                            let y = my - ny == 0 ? my - 2 : (my - ny) * 0.5 - 10 + ny
                            const stroke = i.isEmpty == 1 ? "#389A2B" : "#D01218"
                            const color = "#000" 
                            let d = "M" +x2+" "+y2+" L "+x1+" "+y1+" Z"
                            return (
                                <g key={"Line"+index}>
                                    <path id={"Line"+groupname}
                                        d={d} style={{cursor:"pointer"}} stroke={stroke} strokeWidth="1.6" fill="null" 
                                        markerEnd={i.isEmpty == 1 ? "url(#arrow2)" : "url(#arrow1)"} onClick={this.isEditRGroup.bind(this,groupname)}
                                        onContextMenu={canWrite ? this.handleIsDeleteRGroup.bind(this,groupname) : null}
                                    />
                                    <text key={"Label"+index} x={x} y={y} fontSize="14" style={{cursor:"pointer", backgroundColor:"white", fill:color}} 
                                        onClick={this.isEditRGroup.bind(this,groupname)}
                                        onContextMenu={canWrite ? this.handleIsDeleteRGroup.bind(this,groupname) : null}
                                    >{groupname}</text>
                                </g>
                            )
                        }) : null
                    }
                </svg>
                {
                    isDeleteRGroup.is ? 
                    <div ref="rulemenu" style={{cursor: "pointer", top:top, left:left}} className={styles.contextMenu}>
                        <div onClick={this.handleDeleteRGroup.bind(this)} style={{width: "100%", height: "22px",textAlign:"left"}}>🗑&nbsp;&nbsp;{formatMessage({id:'app.policy.deleteMenu'})}</div>
                    </div> : null
                }
            </div>
            {
                isCreateRule ? <CreateForm_All {...createRuleProps}></CreateForm_All> : null
            }
            {
                isEditRule ? <EditRuleGroupForm {...editRuleProps}></EditRuleGroupForm> : null
            } 
            </>
        )
    }
}