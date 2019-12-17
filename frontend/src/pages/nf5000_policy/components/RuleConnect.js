import react, { Component } from 'react'
import RuleGroup from './RuleGroup'
import { Form, message } from 'antd'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { connect } from 'dva';
import styles from '../nf5000_policy.less'

//创建规则组的modal框
const CreateForm_All = Form.create()(
    props => {
        return (
            <RuleGroup {...props} Mode="Add"></RuleGroup>
        )
    }
)
//编辑规则组的modal框
const EditRuleGroupForm = Form.create()(
    props => {
        return (
            <RuleGroup {...props} Mode="Edit"></RuleGroup>
        )
    }
)

@connect(({ nf5000_policy }) => {
    return {
        currentCertainRuleGroup: nf5000_policy.currentCertainRuleGroup
    }
})
export default class RuleConnect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isEditRule: false,
            isDeleteRGroup: { is: false, groupname: "" },
            contextMenuPosition: { left: "", top: "" },
            curRGroupConnect: {},
            footerVisible: true,
            //loading
            ruleconfirmLoading: false,
            haveDefaultRuleInterface: '',
        }
    }
    /**
     * 事件监听
     */
    _handleClick = (e) => {
        const { isDeleteRGroup } = this.state
        const wasOutside = !(e.target.contains === this.refs.rulemenu)

        if (wasOutside && isDeleteRGroup["is"]) this.setState({ isDeleteRGroup: { is: false, groupname: "" }, })
    }
    _handleScroll = () => {
        const { isDeleteRGroup } = this.state

        if (isDeleteRGroup["is"]) this.setState({ isDeleteRGroup: { is: false, groupname: "" }, })
    }
    componentDidMount() {
        document.addEventListener('click', this._handleClick)
        document.addEventListener('scroll', this._handleScroll)
    }
    componentWillUnmount() {
        document.removeEventListener('click', this._handleClick)
        document.removeEventListener('scroll', this._handleScroll)
    }
    //创建规则组时验证端口是否已存在default rule
    checkDefaultRuleInterface = (groupinfo, defaultRuleInterface, currentIPolicy) => {
        let drLength = Object.keys(defaultRuleInterface)
        if (currentIPolicy.length == 0 || drLength.length == 0 || groupinfo.rule.length!=0){
            return true
        };
        let interlist = []
        currentIPolicy.map(item => {
            if (item.name == groupinfo.ingroupname) {
                interlist = item.interlist
            }
        }
        )
        let drValues = Object.keys(defaultRuleInterface)
        let inRlueString = ''
        interlist.map(item => {
            if (drValues.indexOf(item) != -1) {
                inRlueString = inRlueString + item +','
            }
        }
        )
        if(inRlueString){
            this.setState({
            haveDefaultRuleInterface: inRlueString,
            },function (){
            message.error(formatMessage({'id':'app.policy.interface'})
            +this.state.haveDefaultRuleInterface+
            formatMessage({'id':'app.policy.defaultRuleExist'}))
            });
            return false;
        }
        return true;
    }
    /**
     * 创建规则组
     */
    handleCreateRuleGroup = (groupinfo) => {
        const { dispatch, curRGroupConnect, pageLoadingChange, refreshGroups, refreshRuleConnect, closeModal, defaultRuleInterface,
                currentIPolicy, refreshDefaultInterface} = this.props
        groupinfo.ingroupname = curRGroupConnect.dragName
        groupinfo.outgroupname = curRGroupConnect.dropName
        
        if(this.checkDefaultRuleInterface(groupinfo, defaultRuleInterface, currentIPolicy)){
        this.setState({
            ruleconfirmLoading: true,
            footerVisible: false
        })
        pageLoadingChange(true)
        dispatch({
            type: 'nf5000_policy/createRuleGroup',
            payload: groupinfo
        }).then((res) => {
            if (typeof res.status_code == "undefined") message.success(formatMessage({ id: 'app.policy.msg.create.success' }))
            closeModal()
        }).catch((err) => {
            message.error(formatMessage({ id: 'app.policy.msg.create.fail' }))
            closeModal()
        }).finally(() => {
            refreshGroups()
            refreshRuleConnect()
            refreshDefaultInterface()
            this.setState({
                ruleconfirmLoading: false,
                footerVisible: true
            })
            pageLoadingChange(false)
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
            type: `nf5000_policy/getGroupRules`,
            payload: { "rulegroupname": groupname }
        }).finally(() => {
            this.setState({
                ruleconfirmLoading: false
            })
            pageLoadingChange(false)
        })
        this.setState({
            isEditRule: true,
        })
    }
    handleEditFormClose = () => {
        this.setState({
            isEditRule: false,
        })
    }
    //点击编辑规则组modal框的确认按钮会下发新添加的规则
    handleSubformOn = (groupinfo) => {
        const { dispatch, pageLoadingChange, refreshRuleConnect, refreshDefaultInterface} = this.props
        this.setState({
            ruleconfirmLoading: true,
            footerVisible: false
        })
        pageLoadingChange(true)
        dispatch({
            type: `nf5000_policy/createRule`,
            payload: { "rulegroupname": groupinfo.rulegroupname, "rule": groupinfo.rule, "description": groupinfo.description }
        }).then((res) => {
            if (typeof res.status_code == "undefined") message.success(formatMessage({ id: 'app.policy.msg.edit.success' }))
        }).catch((err) => {
            message.error(formatMessage({ id: 'app.policy.msg.edit.fail' }))
        }).finally(() => {
            refreshDefaultInterface()
            refreshRuleConnect()
            this.setState({
                ruleconfirmLoading: false,
                isEditRule: false,
                footerVisible: true
            })
            pageLoadingChange(false)
        })
    }
    /**
     * 删除规则组
     */
    handleIsDeleteRGroup = (groupname, e) => {
        const { getElementPosition, getMousePosition } = this.props
        e.preventDefault()
        const { contextMenuPosition } = this.state
        let svgPosition = this.refs.svgline ? getElementPosition(this.refs.svgline, "") : null
        let x = getMousePosition(e).x - svgPosition.x
        let y = getMousePosition(e).y - svgPosition.y
        this.setState({
            contextMenuPosition: { top: y + "px", left: x + "px" },
            isDeleteRGroup: { is: true, groupname: groupname }
        })
    }
    handleDeleteRGroup = () => {
        const { isDeleteRGroup } = this.state
        const { dispatch, refreshGroups, refreshRuleConnect, pageLoadingChange, refreshDefaultInterface } = this.props
        pageLoadingChange(true)
        dispatch({
            type: 'nf5000_policy/deleteRuleGroup',
            payload: { rulegroupname: isDeleteRGroup.groupname }
        }).then((res) => {
            if (typeof res.status_code == "undefined") message.success(formatMessage({ id: 'app.policy.msg.delete.success' }))
        }).catch((err) => {
            message.error(formatMessage({ id: 'app.policy.msg.delete.fail' }))
        }).finally(() => {
            this.setState({
                isDeleteRGroup: { is: false, groupname: "" }
            })
            pageLoadingChange(false)
            refreshGroups()
            refreshRuleConnect()
            refreshDefaultInterface()
        })
    }
    /**
     * 获取规则组连接线的坐标
     * @param {object} i 
     */
    getLinePosition(i) {
        const { getElementPosition, igroupRefList, egroupRefList } = this.props
        let igress = i.ingroupname
        let egress = i.outgroupname
        let refList = {}
        let svgPosition = this.refs.svgline ? getElementPosition(this.refs.svgline, "") : { x: 0, y: 0 }
        ////////////////////////////////////////////////////////////////////////////////////////////
        refList["igress"] = igroupRefList[igress]
        refList["egress"] = egroupRefList[egress]
        let iPosition = typeof refList["igress"] !== "undefined" && Object.prototype.toString.call(refList["igress"].current) !== "[object Null]" ? getElementPosition(refList["igress"].current.getNode(), "Igress") : svgPosition
        let ePosition = typeof refList["egress"] !== "undefined" && Object.prototype.toString.call(refList["egress"].current) !== "[object Null]" ? getElementPosition(refList["egress"].current.getNode(), "Egress") : iPosition
        let x1 = iPosition.x - svgPosition.x
        let y1 = iPosition.y - svgPosition.y
        let x2 = ePosition.x - svgPosition.x - 6
        let y2 = ePosition.y - svgPosition.y
        return { x1, y1, x2, y2 }
    }
    render() {
        const { currentCertainRuleGroup, currentRuleConnects, svgHeight, isCreateRule, closeModal, canWrite, defaultRuleInterface, currentIPolicy, refreshRuleConnect } = this.props
        const { isEditRule, isDeleteRGroup, contextMenuPosition, ruleconfirmLoading, footerVisible } = this.state
        const { top, left } = contextMenuPosition
        const createRuleProps = {
            modalVisible: isCreateRule, closeModal: closeModal, handleOk: this.handleCreateRuleGroup, confirmLoading: ruleconfirmLoading,
            currentRuleConnects: currentRuleConnects, handleEditRuleGroup: this.isEditRGroup, defaultRuleInterface, currentIPolicy, footerVisible,
            canWrite: canWrite
        }
        const editRuleProps = {
            currentRuleGroupInfo: currentCertainRuleGroup,
            handleEditRuleGroup: this.isEditRGroup, modalVisible: isEditRule, handleOk: this.handleSubformOn,
            confirmLoading: ruleconfirmLoading, canWrite: canWrite, closeModal: this.handleEditFormClose, defaultRuleInterface, currentIPolicy,
            checkDefaultRuleInterface:this.checkDefaultRuleInterface, footerVisible, refreshRuleConnect
        }
  
        return (
            <>
                <div style={{ width: "100%", height: svgHeight, position: "relative" }} ref="svgline" >
                    <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                        <defs>
                            <marker id="arrow1" refX="4" refY="4"
                                markerUnits="strokeWidth"
                                markerWidth="10" markerHeight="10"
                                orient="auto"
                            >
                                <path d="M 2 2 L 4 4 L 2 6 L 8 4 L 2 2 Z" fill={"#5c7cb3"} />
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
                            currentRuleConnects.length > 0 ? currentRuleConnects.map((i, index) => {
                                let groupname = i.rulegroupname
                                let linePosition = this.getLinePosition(i)
                                let x1 = linePosition.x1
                                let y1 = linePosition.y1
                                let x2 = linePosition.x2
                                let y2 = linePosition.y2
                                let mx = x1 > x2 ? x1 : x2
                                let nx = x1 < x2 ? x1 : x2
                                let my = y1 > y2 ? y1 : y2
                                let ny = y1 < y2 ? y1 : y2
                                let x = (mx - nx) * 0.5 - 10
                                let y = my - ny == 0 ? my - 2 : (my - ny) * 0.5 - 12 + ny
                                const stroke = i.isEmpty ? "#389A2B" : "#5c7cb3"
                                const color = "#000"
                                return (
                                    <g key={"Line" + index}>
                                        <line id={"Line" + groupname}
                                            x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke, strokeWidth: "1.5", cursor: "pointer" }}
                                            markerEnd={i.isEmpty ? "url(#arrow2)" : "url(#arrow1)"} onClick={this.isEditRGroup.bind(this,groupname)}
                                            onContextMenu={canWrite ? this.handleIsDeleteRGroup.bind(this, groupname) : null}
                                        />
                                        <text key={"Label" + index} x={x} y={y} fontSize="14" style={{ cursor: "pointer", backgroundColor: "white", fill: color }}
                                            onClick={this.isEditRGroup.bind(this, groupname)}
                                            onContextMenu={canWrite ? this.handleIsDeleteRGroup.bind(this, groupname) : null}
                                        >{groupname}</text>
                                    </g>
                                )
                            }) : null
                        }
                    </svg>
                    {
                        isDeleteRGroup.is ?
                            <div ref="rulemenu" style={{ cursor: "pointer", top: top, left: left }} className={styles.contextMenu}>
                                <div onClick={this.handleDeleteRGroup.bind(this)} style={{ width: "100%", height: "22px", textAlign: "left" }}>🗑&nbsp;&nbsp;{formatMessage({ id: 'app.policy.deleteMenu' })}</div>
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