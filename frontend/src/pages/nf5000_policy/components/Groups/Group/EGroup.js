import React, { useImperativeHandle, useRef } from 'react'
import { DragSource, DropTarget, useDrop,useDrag  } from 'react-dnd'
import styles from './group.less'
import { Button, Icon, message } from 'antd'
import { formatMessage } from 'umi/locale'
import { element } from 'prop-types'
import ItemTypes from './ItemTypes'
import PortList from '../../Interfaces/PortList'
import { bubbleSort } from '@/pages/nf5000_policy/utils/tools'

const EGroup = React.forwardRef(
    ({  itype, groupInfo, clickHandle, dltHandle, deletePort, canWrite,}, ref) => {
        const { type, name, interlist, connect} = groupInfo
        let itemtype = ItemTypes.EGROUP
        let droptype = "Egress"
        let acceptItem = [ItemTypes.PORT, ItemTypes.PORTICON, ItemTypes.IGROUP]
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
                }
            },
            canDrop(item, monitor){
                if(canWrite){
                    if (connect && connect.indexOf(item.name) !== -1){                                 
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
            },  
            canDrag(monitor){
                return canWrite
            }
        })
        drop(egroupRef)

        //Styles
        const opacity = isDragging ? 0.5 : 1
        let backgroundColor = isDragging ? '#F7C2C5' : ((isOver && canDrop) ? '#d8eae3' : '#fff')
        const cursor = canWrite ? "move" : "pointer"
        let t = []
        interlist.forEach((i) => {
            t.push(parseInt(i.replace("G","").trim()))
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
        
        return (
            <div className={styles.group_wrapper} ref={egroupRef}>
                <Button 
                    className={styles.group} 
                    onClick={clickHandle}
                    style={{opacity,backgroundColor,}}
                >
                    <div className={styles.groupname} style={{cursor}}>
                    {name}
                    </div>
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

     