import React, { useImperativeHandle, useRef } from 'react'
import { useDrag } from 'react-dnd'
import { Button, message } from 'antd'
import ItemTypes from '../Groups/Group/ItemTypes'
import { number } from 'prop-types'
import styles from './ports.less'
import { formatMessage } from 'umi/locale'

const Port = ({  red, id, isAddPort, isEditEGroup, portid, portConfig, canWrite, ...props }) => {
        
    const portRef = useRef(null)

    let num, numlist, portname = id
    numlist = portname.replace("PORT","").trim().split('_')
    num = parseInt(numlist[0]) <= 3 ? 
            (parseInt(numlist[0]) - 1) * 16 + 1 + (parseInt(numlist[1]) - 1) * 2 
            : (parseInt(numlist[0]) - 4) * 16 + parseInt(numlist[1]) * 2
    
    const [{ isDragging }, drag] = useDrag({
        item: {name:portname, portnum: num, type:ItemTypes.PORT},
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
                let port = "X"+item.portnum
                let rtype = dropResult.type == "Cgress" ? "Egress" : dropResult.type
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
    const fill = red ? '#d01218' : '#fff'
    const opacity = isDragging ? 0.5 : 1
    const cursor = canWrite ? 'move' : 'default'
    return (
        <div ref={portRef} style={{width: '12.5%', height: '100%',}}>
            <Button
                style={{
                    backgroundColor: fill,
                    width: '100%',
                    height: '100%',
                    cursor,
                }}
                className={styles.portButton}
                onClick = {()=>portConfig(portid)}
            >
            </Button>
        </div>
    )
}

export default Port


