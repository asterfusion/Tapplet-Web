import React, { useImperativeHandle, useRef, useState } from 'react'
import { DragSource, DropTarget, useDrop, useDrag } from 'react-dnd'
import styles from './group.less'
import { Button , Icon } from 'antd'
import ItemTypes from './ItemTypes'
import PortList from '../../Interfaces/PortList'
import { bubbleSort } from '@/pages/nf5000_policy/utils/tools'
 
const IGroup = React.forwardRef(
    ({itype, groupInfo, clickHandle, dltHandle, isCreateRuleGroup, deletePort, canWrite },ref) => {

        const { name, interlist, connect } = groupInfo
        const igroupRef = useRef(null)
        useImperativeHandle(ref, () => ({
            getNode: () => igroupRef.current,
        }))
        const [{ isOver }, drop] = useDrop({
            accept:[ItemTypes.PORT, ItemTypes.PORTICON],
            collect: monitor => ({
                isOver: !!monitor.isOver()
            }),
            drop(item, monitor) {
                return {
                    gname: name,
                    type: "Igress",
                    isConnect: connect
                }
            }
        })
        const [{isDragging}, drag] = useDrag({
            item: {name,type: ItemTypes.IGROUP},
            collect: monitor => ({
                isDragging: monitor.isDragging()
            }),
            end(item, monitor){
                if(!monitor.didDrop()){
                    return
                }
                const dropResult = monitor.getDropResult()
                const curRGroupConnect = {
                    dragName: item.name,
                    dropName: dropResult.gname,
                }
                isCreateRuleGroup(curRGroupConnect)
            },
            canDrag(monitor){
                return canWrite
            }
        })
        drag(drop(igroupRef))
        
        //Styles
        const opacity = isDragging ? 0.5 : 1
        let backgroundColor = isDragging ? '#F7C2C5' : (isOver ? '#d8eae3' : '#fff')
        const cursor = canWrite ? "move" : "pointer"
        let t = []
        interlist.forEach((i) => {
            t.push(parseInt(i.replace("G","").trim()))
            
        })
        t = bubbleSort(t)

        const portsNum = interlist.length

        const portlistProps = {
            groupname: name, itype: itype, isDeletePort: deletePort, 
            canWrite: canWrite, portsNum: portsNum, isConnect: connect
        }

        return (
            <div className={styles.group_wrapper} ref={igroupRef}>
                <Button 
                    className={styles.group} 
                    onClick={clickHandle} 
                    style={{opacity, backgroundColor,}}
                >
                    <div className={styles.groupname} style={{cursor}}>{name}</div>
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
                <Button className={styles.dltgroup} onClick={dltHandle} style={{opacity,backgroundColor:"white"}} disabled={!canWrite || connect}><Icon type="close" /></Button>
            </div>
        )
})

export default IGroup