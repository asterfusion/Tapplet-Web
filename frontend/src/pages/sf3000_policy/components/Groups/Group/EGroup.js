import React, { useImperativeHandle, useRef } from 'react'
import { DragSource, DropTarget, useDrop,useDrag  } from 'react-dnd'
import styles from './group.less'
import { Button, message, Icon } from 'antd'
import { formatMessage } from 'umi/locale'
import { element } from 'prop-types'
import ItemTypes from './ItemTypes'
import PortList from '../../Interfaces/PortList'
import { bubbleSort } from '@/pages/sf3000_policy/utils/tools'

const EGroup = React.forwardRef(
    ({  itype, isCopy, groupInfo, clickHandle, dltHandle, deletePort, setCopy, canWrite,}, ref) => {

        const { type, name, interlist, connect, copyconnect } = groupInfo

        let itemtype = isCopy ? ItemTypes.CGROUP : ItemTypes.EGROUP
        let droptype = isCopy ? "Cgress" : "Egress"
        let acceptItem = isCopy ? [ItemTypes.PORT, ItemTypes.PORTICON, ItemTypes.EGROUP] : 
                        [ItemTypes.PORT, ItemTypes.PORTICON, ItemTypes.IGROUP]

        const egroupRef = useRef(null)
        useImperativeHandle(ref, () => ({
            getNode: () => egroupRef.current,
        }))
        const [{ isOver, canDrop }, drop] = useDrop({
            accept: acceptItem,
            collect: monitor => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop()
            }),
            drop(item, monitor) {
                return {
                    groupInfo: groupInfo,
                    gname: name,
                    type: droptype,
                    isCopied: copyconnect ? true : false
                }
            },
            canDrop(item, monitor){
                console.log(item)
                console.log(connect, copyconnect)
                if(canWrite){
                    
                    if( (connect && connect.indexOf(item.name) !== -1) ||           //不能重复drop相同的入接口组
                        (copyconnect && copyconnect.indexOf(item.name) !== -1) ||   //不能重复drop相同的普通出接口组
                        (isCopy && item.type == "igroup") ||                        //复制组不能drop入接口组
                        item.type == "cgroup") {                                    //不能drop复制组
                           return false  
                        }                      
                    return true
                }else return false
            }
        })
        const [{isDragging}, drag] = useDrag({
            item: {name, type: itemtype},
            collect: monitor => ({
                isDragging: monitor.isDragging()
            }),
            end(item,monitor){
                if(!monitor.didDrop()){
                    return
                }
                const dropResult = monitor.getDropResult()
                const curCopyInfo = {
                    outgroupname: item.name,
                    copygroupname: dropResult.gname,
                }
                if(typeof connect == "undefined"){
                    message.warning(formatMessage({id:'app.policy.msg.copyconnect.warning'}))
                    return
                }else if(dropResult.isCopied){//一个复制组只能有一个复制来源
                    message.warning(formatMessage({id:'app.policy.msg.copyconnect.copyfrom.warning'}))
                    return
                }else {
                    setCopy(curCopyInfo) 
                }
            },
            canDrag(monitor){
                return canWrite 
            }
        })
        drop(drag(egroupRef))

        //Styles
        const opacity = isDragging ? 0.5 : 1
        let backgroundColor = isDragging ? '#F7C2C5' : ((isOver && canDrop) ? '#d8eae3' : '#fff')
        const cursor = canWrite ? "move" : "pointer"
        let t = []
        interlist.forEach((i) => {
            t.push(parseInt(i.replace("X","").trim()))
        })
        t = bubbleSort(t)
        //groupInfo
        let isWRR = false
        if(groupInfo.loadbalance){
            isWRR = groupInfo.loadbalance.mode == "wrr" ? true : false
        }

        const portsNum = interlist.length

        const portlistProps = {
            groupname: name, itype: itype, isDeletePort: deletePort, isWRR: isWRR, isEditEGroup: clickHandle,
            groupInfo: groupInfo, canWrite: canWrite, portsNum: portsNum
        }
        const copyIcon = isCopy ? <Icon type="copy" /> : null
        
        return (
            <div className={styles.group_wrapper} ref={egroupRef}>
                <Button 
                    className={styles.group} 
                    onClick={clickHandle}
                    style={{opacity,backgroundColor,}}
                >
                    <div className={styles.groupname} style={{cursor}}>{name}{" "}{copyIcon}</div>
                    <div className={styles.interfaces}>
                        {
                            t ? t.map((i) => {
                                return (
                                    <PortList key={i} portnum={i} {...portlistProps}/>
                                )
                            }) : null
                        }
                    </div>
                </Button>
                <Button className={styles.dltgroup} onClick={dltHandle} style={{opacity,backgroundColor:"white"}} disabled={!canWrite}><Icon type="close" /></Button>
            </div>
        )

})

export default EGroup

     