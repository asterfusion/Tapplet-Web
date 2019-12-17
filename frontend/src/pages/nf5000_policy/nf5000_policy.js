import react, { Component } from 'react'
import Platform from "./components/Platform"
import GroupsPane from "./components/GroupsPane"
import Groups from './components/Groups/Groups'
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { message, Spin,Alert,Col, Button, Card } from "antd"
import { DndProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import { connect } from "dva";
import { getElementPosition, getMousePosition } from './utils/tools'
import RuleConnect from './components/RuleConnect'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import Link from 'umi/link'


@connect(({nf5000_policy, nf5000_user, nf5000_global})=>{
    return {
        currentIPolicy: nf5000_policy.currentIPolicy,
        currentEPolicy: nf5000_policy.currentEPolicy,
        currentRuleConnects: nf5000_policy.currentRuleConnects,
        currentPerm: nf5000_user.currentPerm,
        defaultRuleInterface: nf5000_policy.defaultRuleInterface,
        currentVppstatus: nf5000_global.currentVppstatus
    }
})
export default class NewPolicyPage extends Component {

    constructor(props){
        super(props)
        this.state={
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
            getDefaultInterfacesLoading: false,
            refreshKey:0,
            showTappletWaring:false,
        }
    }
    
    /**
     * 钩子函数
     */
    componentDidMount() {
        this.forceUpdate();
        const {dispatch} = this.props
        dispatch({
            type: "nf5000_user/queryPermiss"
        })
        dispatch({
            type: "nf5000_global/fetchVppstatus"
        })
        this.refreshGroups()
        this.refreshRuleConnect()
        this.refreshDefaultInterface()
      
    }
    componentDidUpdate(prevProps,prevState){
        const { currentIPolicy, currentEPolicy, currentRuleConnects, defaultRuleInterface } = this.props
        const { pageLoading, importLoading, groupConfirmLoading, ruleconfirmLoading, portconfigloading, 
                getGroupsLoading, getRuleConnectLoading, getDefaultInterfacesLoading, 
                newCurrentIPolicy, newCurrentEPolicy } = this.state
        /**
         * 标记入接口组是否已经配有转发，如果已连接，不能更改入接口组
         * 如果入接口组或规则组为空就不必
         */
        if(this.state.refreshKey==0 || (!isEqual(prevProps.currentIPolicy, currentIPolicy)) ||
            (!isEqual(prevProps.currentRuleConnects, currentRuleConnects) && currentIPolicy.length > 0)){
                let nCurrentIPolicy = cloneDeep(currentIPolicy)
            /**
             * 更新入接口组的端口信息
             */
            let ingroupInterfaces = {}
            currentIPolicy.map((i) => {
                ingroupInterfaces[i.name] = i.interlist
            })
            this.setState({
                ingroupInterfaces,
                refreshKey:this.state.refreshKey+1
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
                        newCurrentIPolicy: nCurrentIPolicy
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
                    newCurrentIPolicy: nCurrentIPolicy
                })
            }    
        }
        /**
         * 标记出接口组已经连接了哪些入接口组，如果已连接，不可重复连接
         * 如果出接口组为空就不必
         */
        if(this.state.refreshKey==0 || !isEqual(prevProps.currentEPolicy, currentEPolicy)
            || (!isEqual(prevProps.currentRuleConnects, currentRuleConnects) && currentEPolicy.length > 0)) {
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
            
            this.setState({
                newCurrentEPolicy: nCurrentEPolicy,
                refreshKey:this.state.refreshKey+1
            })
        }
        /**
         * 判断当前是否需要加载页面
         */
        if( this.state.refreshKey==0 || pageLoading !== prevState.pageLoading || importLoading !== prevState.importLoading || groupConfirmLoading !== prevState.groupConfirmLoading || 
            portconfigloading !== prevState.portconfigloading || getGroupsLoading !== prevState.getGroupsLoading || getRuleConnectLoading !== prevState.getRuleConnectLoading ||
            getDefaultInterfacesLoading !== prevState.getDefaultInterfacesLoading){
            if(pageLoading || importLoading || groupConfirmLoading || portconfigloading || 
                getGroupsLoading || getRuleConnectLoading || getDefaultInterfacesLoading){
                this.setState({loading: true})
            }else {
                this.setState({loading: false})
            }
            this.setState({
                refreshKey:this.state.refreshKey+1
            })
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
            type: 'nf5000_policy/queryIPolicies'
        })
        dispatch({
            type: "nf5000_policy/defaultRuleInterface"
        })
        dispatch({
            type: 'nf5000_policy/queryEPolicies'
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
            type: 'nf5000_policy/queryRuleConnect'
        }).then((res) => {
            this.setState({
                getRuleConnectLoading: false
            })
        })
    }

    refreshDefaultInterface = () => {
        const {dispatch} = this.props
        this.setState({
            getDefaultInterfacesLoading: true
        })
        dispatch({
            type: 'nf5000_policy/defaultRuleInterface'
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
        const { type } = this.props;
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
        if(egroups !== null && iGroupsHeight >= egroups || iGroupsHeight>parseInt(svgHeight.replace('px').trim())){
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
        if(igroups !== null && eGroupsHeight >= igroups|| eGroupsHeight>parseInt(svgHeight.replace('px').trim())){
            this.setState({
                svgHeight: eGroupsHeight+"px"
            })
        }
    }

    render(){
        const { currentIPolicy, currentEPolicy, currentRuleConnects, currentPerm ,defaultRuleInterface, currentVppstatus } = this.props
        const { editEGroup, isEditEGroup, isCreateRule, curRGroupConnect, svgHeight, igroupRefList, egroupRefList,
            loading, pageLoading, groupConfirmLoading, newCurrentIPolicy, newCurrentEPolicy, ingroupInterfaces } = this.state
        const platProps = {
            handleIsEditEGroup: this.handleIsEditEGroup, pageLoadingChange: this.pageLoadingChange, canWrite: (currentPerm["policy_write"] && currentVppstatus === "RUNNING"),
            refreshGroups: this.refreshGroups, refreshRuleConnect: this.refreshRuleConnect, refreshDefaultInterfaces: this.refreshDefaultInterfaces,
            clearContent: formatMessage({id:'app.policy.clear'}), importContent: formatMessage({id:'app.policy.import'}), exportContent: formatMessage({id:'app.policy.export'})
        }
        const iGroupsProps = {
            itype: "Igress", currentPolicy: newCurrentIPolicy, currentRuleConnects: currentRuleConnects,
            refreshGroups: this.refreshGroups, refreshRuleConnect: this.refreshRuleConnect, refreshDefaultInterfaces: this.refreshDefaultInterfaces,
            handleIsCreateRuleGroup: this.handleIsCreateRuleGroup, forwardingRefs: this.getIgroupRefs,
            canWrite: (currentPerm["policy_write"] && currentVppstatus === "RUNNING"), confirmLoading: groupConfirmLoading, loadingChange: this.groupLoadingChange, 
            createContent: formatMessage({id:'app.policy.createIgress.name'})
        }
        const eGroupsProps = {
            itype: "Egress", currentPolicy: newCurrentEPolicy, currentRuleConnects: currentRuleConnects,
            refreshGroups: this.refreshGroups, refreshRuleConnect: this.refreshRuleConnect, refreshDefaultInterfaces: this.refreshDefaultInterfaces,
            handleIsCreateRuleGroup: this.handleIsCreateRuleGroup, forwardingRefs: this.getEgroupRefs,
            isEditEGroup: isEditEGroup, editEGroup: editEGroup, handleIsEditEGroup: this.handleIsEditEGroup, handleFinEditEGroup: this.handleFinEditEGroup,
            canWrite: (currentPerm["policy_write"] && currentVppstatus === "RUNNING"), confirmLoading: groupConfirmLoading, loadingChange: this.groupLoadingChange,
            createContent: formatMessage({id:'app.policy.createEgress.name'})
        }
        const ruleConnectProps = { 
            getElementPosition: getElementPosition, getMousePosition: getMousePosition, 
            defaultRuleInterface: defaultRuleInterface, ingroupInterfaces: ingroupInterfaces,
            currentRuleConnects: currentRuleConnects, igroupRefList: igroupRefList, egroupRefList: egroupRefList, svgHeight: svgHeight, 
            refreshGroups: this.refreshGroups, refreshRuleConnect: this.refreshRuleConnect, refreshDefaultInterfaces: this.refreshDefaultInterfaces,
            isCreateRule: isCreateRule, curRGroupConnect: curRGroupConnect, closeModal: this.handleCloseRuleModal,
            pageLoadingChange: this.pageLoadingChange,defaultRuleInterface:defaultRuleInterface,currentIPolicy: currentIPolicy,
            refreshDefaultInterface: this.refreshDefaultInterface,canWrite: (currentPerm["policy_write"] && currentVppstatus === "RUNNING")
        }

        const routes = [
            {
              path: 'welcome',
              breadcrumbName: formatMessage({id:"menu.home"}),
            },
            {
              path: 'policy',
              breadcrumbName: formatMessage({id:"menu.policy"}),
            },
        ];
        const tappletWaringStatus = currentVppstatus === "RUNNING"?'none':''
        return (
            <PageHeaderWrapper breadcrumb = {{routes}}>
            <Spin spinning={loading}>
                <DndProvider backend={HTML5Backend}> 
                    <Platform {...platProps}/>
                    <Card style={{display:tappletWaringStatus}}>
                    <Alert className='ant-col ant-col-14' type='warning' message= {formatMessage({id:'app.policy.tapplet.waring.info'})}></Alert>    
                     <Link to="/business/setting">
                     <Button type='primary' style={{marginTop:'3px',marginLeft:'10px'}}>
                     {formatMessage({id:'app.policy.tapplet.use.tapplet'})}
                     </Button>
                     </Link>
                     </Card>
                    <GroupsPane
                        igroups={<Groups {...iGroupsProps} />}
                        egroups={<Groups {...eGroupsProps} />}
                        ruleconnect={<RuleConnect {...ruleConnectProps} />}
                    />
                </DndProvider>
            </Spin>
        </PageHeaderWrapper>
        )
    }
}