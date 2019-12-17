import react, { Component } from 'react'
import Platform from "./components/Platform"
import GroupsPane from "./components/GroupsPane"
import Groups from './components/Groups/Groups'
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { message, Spin } from "antd"
import { DndProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import { connect } from "dva";
import { getElementPosition, getMousePosition } from './utils/tools'
import RuleConnect from './components/RuleConnect'
import CopyConnect from './components/CopyConnect'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'


@connect(({sf3000_policy, sf3000_user})=>{
    return {
        currentIPolicy: sf3000_policy.currentIPolicy,
        currentEPolicy: sf3000_policy.currentEPolicy,
        currentRuleConnects: sf3000_policy.currentRuleConnects,
        currentCopyConnects: sf3000_policy.currentCopyConnects,
        defaultRuleInterface: sf3000_policy.defaultRuleInterface,
        currentPerm: sf3000_user.currentPerm,
    }
})
export default class PolicyPage extends Component {

    constructor(props){
        super(props)
        this.state={
            //needToUpdateInfo
            newCurrentIPolicy: [],
            newCurrentEPolicy: [],
            ingroupInterfaces: {},
            //svg
            igroupRefList: {},
            egroupRefList: {},
            groupsHeight: {igroups:null,egroups:null},
            svgHeight: "0px",
            //egroups
            editEGroup: [],
            isEditEGroup: false,
            //rulegroup
            curRGroupConnect: {},
            isCreateRule: false,
            //loading
            loading: false,
            pageLoading: false,
            groupConfirmLoading: false,
            getGroupsLoading: false,
            getRuleConnectLoading: false,
            getCopyConnectLoading: false,
            getDefaultInterfacesLoading: false,
            refreshKey:0
        }
    }
    
    /**
     * 钩子函数
     */
    componentDidMount() {
        const {dispatch} = this.props
        
        dispatch({
            type: "sf3000_user/queryPermiss"
        })
        this.refreshDefaultInterfaces()
        this.refreshGroups()
        this.refreshRuleConnect()
        this.refreshCopyConnect()
    }
    componentDidUpdate(prevProps,prevState){
       
        const { currentIPolicy, currentEPolicy, currentRuleConnects, currentCopyConnects, defaultRuleInterface } = this.props
        const { pageLoading, importLoading, groupConfirmLoading, ruleconfirmLoading, portconfigloading, 
                getGroupsLoading, getRuleConnectLoading, getCopyConnectLoading, getDefaultInterfacesLoading, 
                newCurrentIPolicy, newCurrentEPolicy } = this.state
console.log(JSON.stringify(newCurrentEPolicy))
        /**
         * 标记入接口组是否已经配有转发，如果已连接，不能更改入接口组
         * 如果入接口组或规则组为空就不必
         */
        if( this.state.refreshKey == 0 || (!isEqual(prevProps.currentIPolicy, currentIPolicy)) ||
            (!isEqual(prevProps.currentRuleConnects, currentRuleConnects) && currentIPolicy.length > 0)){
                let nCurrentIPolicy = cloneDeep(currentIPolicy)
            /**
             * 更新入接口组的端口信息
             */
            let ingroupInterfaces = {}
            nCurrentIPolicy.map((i) => {
                ingroupInterfaces[i.name] = i.interlist
            })
            this.setState({
                ingroupInterfaces
            })
            
            if(currentRuleConnects.length > 0){ 
                let iconnectList = []
                currentRuleConnects.forEach((i) => {
                    if(iconnectList.indexOf(i.ingroupname) == -1){
                        iconnectList.push(i.ingroupname)
                    }
                })
                nCurrentIPolicy.map((i) => {
                    if(iconnectList.indexOf(i.name) !== -1){
                        i["connect"] = true
                    }else if(i["connect"]){
                        delete i["connect"]
                    }
                })
                this.setState({
                    newCurrentIPolicy: nCurrentIPolicy,
                    refreshKey:this.state.refreshKey+1
                })
                
            }
            else if(currentRuleConnects.length == 0){
                let iconnectArr = {}
                newCurrentIPolicy.map((i) => {
                    if(i["connect"]){
                        iconnectArr[i.name] = i["connect"]
                    }else {
                        iconnectArr[i.name] = ""
                    }
                })
                nCurrentIPolicy.map((i) => {
                    if(iconnectArr[i.name] !== ""){
                        delete i["connect"]
                    }
                })
                this.setState({
                    newCurrentIPolicy: nCurrentIPolicy,
                    refreshKey:this.state.refreshKey+1
                })
            }    
        }
        /**
         * 标记出接口组已经连接了哪些入接口组，如果已连接，不可重复连接
         * 如果出接口组为空就不必
         */
        if( this.state.refreshKey == 0 || !isEqual(prevProps.currentEPolicy, currentEPolicy)
            || (!isEqual(prevProps.currentRuleConnects, currentRuleConnects) && currentEPolicy.length > 0)
            || (!isEqual(prevProps.currentCopyConnects, currentCopyConnects) && currentEPolicy.length > 0)) {
                let nCurrentEPolicy = cloneDeep(currentEPolicy)

            if(currentRuleConnects.length > 0){
                let connectList = {}
                
                currentRuleConnects.forEach((i)=>{
                    if(typeof connectList[i.outgroupname] == "undefined"){
                        connectList[i.outgroupname] = []
                        connectList[i.outgroupname].push(i.ingroupname)
                    }else{
                        connectList[i.outgroupname].push(i.ingroupname)
                    }
                })

                nCurrentEPolicy.map((i)=>{
                    if(Object.keys(connectList).indexOf(i.name) !== -1){
                        i["connect"]=connectList[i.name]
                    }else if(i["connect"]){
                        delete i["connect"]
                    }
                })
            }else if(currentRuleConnects.length == 0){
                nCurrentEPolicy.map((i)=>{
                if(i["connect"]){
                        delete i["connect"]
                    }
                }) 
            }
            /**
             * 标记复制接口组已经连接了哪些出接口组，如果已连接，不可重复连接
             * 如果出接口组为空就不必
             */
            if(currentCopyConnects.length > 0){
                let copyConnectList = {}
                currentCopyConnects.forEach((item) => {
                    item.copygroupname.forEach((ci) => {
                        copyConnectList[ci] = item.outgroupname    
                    })
                })
                nCurrentEPolicy.map((i)=>{
                        if(Object.keys(copyConnectList).indexOf(i.name) !== -1){
                            i["copyconnect"]=copyConnectList[i.name]
                        }else if(i["copyconnect"]){
                            delete i["copyconnect"]
                        }
                    })
            }else if(currentCopyConnects.length == 0){
                nCurrentEPolicy.map((i)=>{
                    if(i["copyconnect"]){
                        delete i["copyconnect"]
                    }
                })    
            }
console.log(JSON.stringify(nCurrentEPolicy))
            this.setState({
                newCurrentEPolicy: nCurrentEPolicy
            })
        }
    /**
     * 判断当前是否需要加载页面
     */
    if( pageLoading !== prevState.pageLoading || importLoading !== prevState.importLoading || groupConfirmLoading !== prevState.groupConfirmLoading || 
        portconfigloading !== prevState.portconfigloading || getGroupsLoading !== prevState.getGroupsLoading || getRuleConnectLoading !== prevState.getRuleConnectLoading ||
        getCopyConnectLoading !== prevState.getCopyConnectLoading || getDefaultInterfacesLoading !== prevState.getDefaultInterfacesLoading){
        if(pageLoading || importLoading || groupConfirmLoading || portconfigloading || 
            getGroupsLoading || getRuleConnectLoading || getCopyConnectLoading || getDefaultInterfacesLoading){
            this.setState({loading: true})
        }else {
            this.setState({loading: false})
        }
    }
}
    /**
     * 获取接口组、规则组、复制组、default端口信息
     */
    refreshGroups = () => {
        const { dispatch } = this.props
        this.setState({
            getGroupsLoading: true
        })
        dispatch({
            type: 'sf3000_policy/queryIPolicies'
        })
        dispatch({
            type: 'sf3000_policy/queryEPolicies'
        }).then((res) => {
            this.setState({
                getGroupsLoading: false
            })
        })
    }
    refreshRuleConnect = () => {
        const { dispatch } = this.props
        this.setState({
            getRuleConnectLoading: true
        })
        dispatch({
            type: 'sf3000_policy/queryRuleConnect'
        }).then((res) => {
            this.setState({
                getRuleConnectLoading: false
            })
        })
    }
    refreshCopyConnect = () => {
        const { dispatch } = this.props
        this.setState({
            getCopyConnectLoading: true
        })
        dispatch({
            type: 'sf3000_policy/queryCopyConnect'
        }).then((res) => {
            this.setState({
                getCopyConnectLoading: false
            })
        })
    }
    refreshDefaultInterfaces = () => {
        const { dispatch } = this.props
        this.setState({
            getDefaultInterfacesLoading: true
        })
        dispatch({
            type: 'sf3000_policy/queryDefaultRuleInterface'
        }).then((i) => {
            this.setState({
                getDefaultInterfacesLoading: false
            })
        })
    }
    /**
     * 修改出接口组
     */
    handleIsEditEGroup = (groupInfo) => {
        console.log("修改接口组？",groupInfo)
        this.setState({
            editEGroup: groupInfo,
            isEditEGroup: true,
        })
    }
    handleFinEditEGroup = () => {
        this.setState({
            isEditEGroup: false,
        }) 
    }
    /**
     * 是否是接口组内表单、规则组内表单加载
     */
    pageLoadingChange = (flag) => {
        this.setState({
            pageLoading: flag
        })
    }
    groupLoadingChange = (flag) => {
        this.setState({
            groupConfirmLoading: flag
        })
    }
    /**
     * 创建规则组
     */
    handleIsCreateRuleGroup = (curRGroupConnect) => {
        this.setState({
            isCreateRule: true,
            curRGroupConnect: curRGroupConnect,
        })
    }
    handleCloseRuleModal = () => {
        this.setState({
             isCreateRule: false,
        }) 
    }
    /**
     * 获取入接口组集合的ref,确定svg的高度
     * @param {object} refsList
     * @param {object} iGroupsRef
     */
    getIgroupRefs = (refsList,iGroupsRef) => {
        const { svgHeight, groupsHeight } = this.state
        const { igroups, egroups } = groupsHeight
        this.setState({
            igroupRefList:refsList
        })

        let iGroupsHeight = iGroupsRef.offsetHeight
        this.setState({
            groupsHeight: {igroups:iGroupsHeight,egroups:egroups}
        })

        if((egroups !== null && iGroupsHeight >= egroups) || iGroupsHeight > parseInt(svgHeight.replace("px").trim())){
            this.setState({
                svgHeight: iGroupsHeight+"px"
            })
        }
    }
    /**
     * 获取出接口组集合的ref,确定svg的高度
     * @param {object} refsList
     * @param {object} eGroupsRef
     */
    getEgroupRefs = (refsList,eGroupsRef) => {
        const { svgHeight, groupsHeight } = this.state
        const { igroups, egroups } = groupsHeight
        this.setState({
            egroupRefList:refsList
        })
        let eGroupsHeight = eGroupsRef.offsetHeight
        this.setState({
            groupsHeight: {igroups:igroups, egroups:eGroupsHeight}
        })
        if((igroups !== null && eGroupsHeight >= igroups) || eGroupsHeight > parseInt(svgHeight.replace("px").trim())){
            this.setState({
                svgHeight: eGroupsHeight+"px"
            })
        }
    }

    render(){
        const { currentIPolicy, currentEPolicy, currentRuleConnects, currentCopyConnects, currentPerm, defaultRuleInterface } = this.props
        const { editEGroup, isEditEGroup, isCreateRule, curRGroupConnect, svgHeight, igroupRefList, egroupRefList,
                loading, pageLoading, groupConfirmLoading, newCurrentIPolicy, newCurrentEPolicy, ingroupInterfaces } = this.state
                console.log(/*editEGroup,*/ newCurrentEPolicy)
        const platProps = {
            handleIsEditEGroup: this.handleIsEditEGroup, 
            refreshGroups: this.refreshGroups, refreshRuleConnect: this.refreshRuleConnect, refreshCopyConnect: this.refreshCopyConnect, refreshDefaultInterfaces: this.refreshDefaultInterfaces,
            canWrite: currentPerm["policy_write"], pageLoadingChange: this.pageLoadingChange,
            clearContent: formatMessage({id:'app.policy.clear'}), importContent: formatMessage({id:'app.policy.import'}), exportContent: formatMessage({id:'app.policy.export'})
        }
        const iGroupsProps = {
            itype: "Igress", currentPolicy: newCurrentIPolicy, currentRuleConnects: currentRuleConnects,
            refreshGroups: this.refreshGroups, refreshRuleConnect: this.refreshRuleConnect, refreshCopyConnect: this.refreshCopyConnect, refreshDefaultInterfaces: this.refreshDefaultInterfaces,
            handleIsCreateRuleGroup: this.handleIsCreateRuleGroup, forwardingRefs: this.getIgroupRefs,
            canWrite: currentPerm["policy_write"], confirmLoading: groupConfirmLoading, loadingChange: this.groupLoadingChange, 
            createContent: formatMessage({id:'app.policy.createIgress.name'}),
        }
        const eGroupsProps = {
            itype: "Egress", currentPolicy: newCurrentEPolicy, currentRuleConnects: currentRuleConnects,
            refreshGroups: this.refreshGroups, refreshRuleConnect: this.refreshRuleConnect, refreshCopyConnect: this.refreshCopyConnect, refreshDefaultInterfaces: this.refreshDefaultInterfaces,
            handleIsCreateRuleGroup: this.handleIsCreateRuleGroup, forwardingRefs: this.getEgroupRefs,
            isEditEGroup: isEditEGroup, editEGroup: editEGroup, handleIsEditEGroup: this.handleIsEditEGroup, handleFinEditEGroup: this.handleFinEditEGroup,
            canWrite: currentPerm["policy_write"], confirmLoading: groupConfirmLoading, loadingChange: this.groupLoadingChange,
            createContent: formatMessage({id:'app.policy.createEgress.name'})
        }
        const ruleConnectProps = { 
            getElementPosition: getElementPosition, getMousePosition: getMousePosition, 
            defaultRuleInterface: defaultRuleInterface, ingroupInterfaces: ingroupInterfaces,
            currentRuleConnects: currentRuleConnects, igroupRefList: igroupRefList, egroupRefList: egroupRefList, svgHeight: svgHeight, 
            refreshGroups: this.refreshGroups, refreshRuleConnect: this.refreshRuleConnect, refreshCopyConnect: this.refreshCopyConnect, refreshDefaultInterfaces: this.refreshDefaultInterfaces,
            isCreateRule: isCreateRule, curRGroupConnect: curRGroupConnect, closeModal: this.handleCloseRuleModal,
            canWrite: currentPerm["policy_write"], pageLoadingChange: this.pageLoadingChange,
        }
        const copyConnectProps = {
            getElementPosition: getElementPosition, getMousePosition: getMousePosition,
            currentCopyConnects: currentCopyConnects, igroupRefList: igroupRefList, egroupRefList: egroupRefList, svgHeight: svgHeight, 
            refreshGroups: this.refreshGroups, refreshRuleConnect: this.refreshRuleConnect, refreshCopyConnect: this.refreshCopyConnect, refreshDefaultInterfaces: this.refreshDefaultInterfaces,
            canWrite: currentPerm["policy_write"], pageLoadingChange: this.pageLoadingChange
        }      
        
        return (
            <PageHeaderWrapper>
            <Spin spinning={loading}>
                <DndProvider backend={HTML5Backend}>
                    <Platform {...platProps}/>
                    <GroupsPane
                        igroups={<Groups {...iGroupsProps} />}
                        egroups={<Groups {...eGroupsProps} />}
                        ruleconnect={<RuleConnect {...ruleConnectProps} />}
                        copyconnect={<CopyConnect {...copyConnectProps}/>}
                    />
                </DndProvider>    
            </Spin>
        </PageHeaderWrapper>
        )
    }
}