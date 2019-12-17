import React, { useImperativeHandle, useRef } from 'react'
import { useDrag } from 'react-dnd'
import { Button, message } from 'antd'
import ItemTypes from '../Groups/Group/ItemTypes'
import { number } from 'prop-types'
import styles from './ports.less'
import { formatMessage } from 'umi/locale'


const Xport = ({  red, id, isAddPort, isEditEGroup, portid, portName,portConfig, canWrite, ...props }) => {
        
    const portRef = useRef(null)

    let num, numlist = id
    const [{ isDragging }, drag] = useDrag({
        item: {name:portName, portnum: num, type:ItemTypes.PORT},
        collect: monitor => ({
            isDragging: monitor.isDragging()
        }),
        end(item,monitor){
            if(!monitor.didDrop()){
                return
            }
            const dropResult = monitor.getDropResult()
            if(dropResult.type == "Egress" && (dropResult.groupInfo.loadbalance.mode == "wrr")) {
                //编辑的内容不会增加端口，这是因为下面传的参数是以前的而不是动态更新的
                isEditEGroup(dropResult.groupInfo)
                message.warning(formatMessage({id:'app.policy.msg.port.wrr.warning'}))
            }else if(dropResult.isConnect){
                //如果入接口组有连接，不能增加
                message.warning(formatMessage({id:'app.policy.msg.port.connect.warning'}))
                return
            }
            else {
                const port = portName
                const rtype = dropResult.type == "Cgress" ? "Egress" : dropResult.type
                const addPort = {
                    port,
                    groupname: dropResult.gname,
                    type: rtype
                }
                isAddPort(addPort)
            }
            
        },
        canDrag(monitor){
            return canWrite
        }
    })
    drag(portRef)

    //Styles
    const fill = red ? 'buttonX_blue' : 'buttonX_white'
    const opacity = isDragging ? 0.5 : 1
    const cursor = canWrite ? 'move' : 'default'
    return (
        <>
        <div ref={portRef} className={styles[fill]} styles={{width:'12.5%', height:'80%'}}>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    cursor,
                }}
                 onClick = {()=>portConfig('G'+portid)}
            >
            </div>
        </div>
        <div className={styles.blank_X}></div>
        </>
    )
}

export default Xport


