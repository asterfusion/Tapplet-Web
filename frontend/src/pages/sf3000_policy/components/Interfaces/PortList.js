import React, { useImperativeHandle, useRef } from 'react'
import { DragSource, useDrag } from 'react-dnd'
import { Button, message } from 'antd'
import ItemTypes from '../Groups/Group/ItemTypes'
import { number } from 'prop-types';
import styles from './ports.less'
import { formatMessage } from 'umi/locale'

const PortList = ({  portnum, groupInfo, isDeletePort, itype, groupname, canWrite, portsNum, isConnect, ...props }) => {

    const portRef = useRef(null)

    const [{ isDragging }, drag] = useDrag({
        item: {portnum, type: ItemTypes.PORTICON},
        collect: monitor => ({
            isDragging: monitor.isDragging()
        }),
        end(item, monitor){
            const dropResult = monitor.getDropResult()
            if( monitor.didDrop() && (dropResult !== null && dropResult.gname == groupname )){
                return
            }
            if(isConnect){
                //如果入接口组有连接，不能删端口
                message.warning(formatMessage({id:'app.policy.msg.port.connect.warning'}))
                return
            }
            if(portsNum == 1){
                //接口组内至少有一个端口，不能删完
                message.warning(formatMessage({id:'app.policy.msg.port.warning'}))
                return
            }else if(props.isWRR){
                //编辑的内容不会增加端口，这是因为下面传的参数是以前的而不是动态更新的
                props.isEditEGroup(groupInfo)
                message.warning(formatMessage({id:'app.policy.msg.port.wrr.warning'}))
            }else {
                let port = "X"+item.portnum
                let gtype = ""
                if(itype == "Igress") gtype = "Igress"/////////注意这个type
                else gtype = "Egress"
                const deletePort = {
                    port,
                    groupname,
                    type: gtype,
                }
                isDeletePort(deletePort)
            }           
        },
        canDrag(monitor){
            return canWrite 
        }
    })
    drag(portRef)

    //Styles
    const opacity = isDragging ? 0 : 1
    const border = '1px solid #000' 
    const color = '#000' 
    const cursor = canWrite ? "move" : "default"
    return (
        <div className={styles.xicon} style={{cursor, opacity, border, color}} ref={portRef}>
            {portnum}
        </div>
    )
}

export default PortList


