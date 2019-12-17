import react, { Component } from 'react'
import { message } from 'antd'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { connect } from 'dva';
import styles from '../sf3000_policy.less'

@connect()
export default class CopyConnect extends Component {
    constructor(props){
        super(props)
        this.state={
            isDeleteCopy: {is: false, copyInfo: {} },
            contextMenuPosition: {left: "", top: ""},
        }
    }

    /**
     * 事件监听
     */
    _handleClick = (e) => {
        const { isDeleteCopy } = this.state
        const wasOutside = !(e.target.contains === this.refs.rulemenu || e.target.contains === this.refs.copymenu)/////注意这里判断
        
        if (wasOutside && isDeleteCopy["is"]) this.setState({ isDeleteCopy: {is:false, copyInfo: {}}, })
    }
    _handleScroll = () => {
        const { isDeleteCopy } = this.state
        
        if (isDeleteCopy["is"]) this.setState({ isDeleteCopy: {is:false, copyInfo: {}}, })
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
     * 删除复制
     */
    handleIsDeleteCopy = (copyInfo, e) => {
        const { getElementPosition, getMousePosition } = this.props
        const { contextMenuPosition } = this.state
        delete copyInfo.id
        e.preventDefault()
        let svgPosition = this.refs.svgcurve ? getElementPosition(this.refs.svgcurve,"") : null
        let x = getMousePosition(e).x - svgPosition.x
        let y = getMousePosition(e).y - svgPosition.y
        this.setState({
            contextMenuPosition: {top: y+"px", left: x+"px"},
            isDeleteCopy:{ is:true, copyInfo }
        })
    }
    handleDeleteCopy = () => {
        const { dispatch, refreshGroups, refreshRuleConnect, refreshCopyConnect, refreshDefaultInterfaces, pageLoadingChange } = this.props
        const { isDeleteCopy } = this.state
        pageLoadingChange(true)
        dispatch({
            type: 'sf3000_policy/deleteCopy',
            payload: isDeleteCopy.copyInfo
        }).then((res)=>{
            if(typeof res.status_code == "undefined") message.success(formatMessage({id:'app.policy.msg.delete.success'}))
        }).catch((err)=>{
            message.error(formatMessage({id:'app.policy.msg.delete.fail'}))
        }).finally(()=>{
            this.setState({
                isDeleteCopy: {is: false, copyInfo: {}}
            })
            pageLoadingChange(false)
            refreshDefaultInterfaces()
            refreshGroups()
            refreshRuleConnect()
            refreshCopyConnect()
        })
    }
    /**
     * 获取复制组连接曲线的坐标
     * @param {object} i 
     */
    getCurvePosition(i){
        const { getElementPosition, igroupRefList, egroupRefList } = this.props
        let oname = i.outgroupname
        let cname = i.copygroupname
        let refList = {}
        let svgPosition = this.refs.svgcurve ? getElementPosition(this.refs.svgcurve,"") : {x:0,y:0}
        ////////////////////////////////////////////////////////////////////////////////////////////
        refList["oname"] = egroupRefList[oname]
        refList["cname"] = egroupRefList[cname]
        let oPosition = typeof refList["oname"] !== "undefined" && Object.prototype.toString.call(refList["oname"].current) !== "[object Null]" ? getElementPosition(refList["oname"].current.getNode(),"Cgress") : svgPosition
        let cPosition = typeof refList["cname"] !== "undefined" && Object.prototype.toString.call(refList["cname"].current) !== "[object Null]" ? getElementPosition(refList["cname"].current.getNode(),"Cgress") : oPosition
        let x1 = oPosition.x - svgPosition.x + 2
        let y1 = oPosition.y - svgPosition.y
        let x2 = cPosition.x - svgPosition.x + 8
        let y2 = cPosition.y - svgPosition.y
        return { x1, y1, x2, y2 }
    }
    render(){
        const { currentCopyConnects, svgHeight, canWrite } = this.props
        const { isDeleteCopy, contextMenuPosition } = this.state
        const { top, left } = contextMenuPosition
        return (
            <div style={{width:"100%", height:svgHeight}} ref="svgcurve" >
                <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                    <defs>
                        <marker id="arrow"  refX="4" refY="4" 
                            markerUnits="strokeWidth"
                            markerWidth="14" markerHeight="14"
                            orient="auto"
                        >
                        <path d="M 2 2 L 4 4 L 2 6 L 8 4 L 2 2 Z" fill={"#0B7BCE"} strokeWidth="5"/>
                    </marker>
                    </defs>
                    {
                        currentCopyConnects.length > 0 ? (currentCopyConnects.map((item,index) => {
                            
                            let id = index
                            return item["copygroupname"].map((i,index) => {
                                let newitem = {}
                                newitem["id"] = id+"-"+index
                                newitem["outgroupname"] = item.outgroupname
                                newitem["copygroupname"] = i
                                let curvePosition = this.getCurvePosition(newitem)
                                let x1 = curvePosition.x1
                                let y1 = curvePosition.y1
                                let x2 = curvePosition.x2 
                                let y2 = curvePosition.y2
                                let my = y1 > y2 ? y1 : y2
                                let ny = y1 < y2 ? y1 : y2
                                let h = my - ny
                                const cursor = canWrite ? "pointer" : "default"
                                const stroke = "#0B7BCE" 
                                // console.log("curve坐标：",x1,y1,x2,y2)
                                let d = "M "+x1+" "+y1+" C "+(x1+0.3*h)+" "+(y1+0.3*h)+", "+(x2+0.3*h)+" "+(y2-0.3*h)+", "+x2+" "+y2
                                return (
                                    <path key={"C"+newitem.id} d={d} style={{cursor}}
                                        stroke={stroke} strokeDasharray="20,10,5,5,5,10" strokeWidth="2" fill="none"
                                        markerEnd="url(#arrow)" {...newitem} onContextMenu={canWrite ? this.handleIsDeleteCopy.bind(this,newitem) : null}
                                        className={styles.copyLine}
                                    />
                                ) 
                            })
                        })) : null
                    }
                </svg>
                {
                    isDeleteCopy.is ? 
                    <div ref="copymenu" style={{cursor: "pointer", top:top, left:left}} className={styles.contextMenu}>
                        <div onClick={this.handleDeleteCopy.bind(this)} style={{width: "100%", height: "22px",textAlign:"left"}}>🗑&nbsp;&nbsp;{formatMessage({id:'app.policy.deleteMenu'})}</div>
                    </div> : null
                }
            </div>
        )
    }
}