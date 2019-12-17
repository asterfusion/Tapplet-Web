import React, { Component } from 'react'
import styles from './style.less'
import Port from '../Interfaces/Port'  
import { connect } from 'dva'
import { Button } from 'antd'



@connect(({nf5000_home, nf5000_user, nf5000_policy, loading})=>{
    return {
        currentPortinformation: nf5000_home.currentPortinformation,
        currentPerm: nf5000_user.currentPerm,
        currentPortNumber: nf5000_home.currentPortNumber,
    }
})
export default class Panel extends Component {
    constructor(props){
        super(props)
    }

    render(){
        //设备图片每8个口为一组,arr1,arr2,arr3为图片上方的24的口，arr4,arr5,arr6为图片下方的24个口
        
        const { currentPortinformation, currentPerm, portProps, currentPortNumber} = this.props
        const { G1,G2,G3,G4,G5,G6,G7,G8,G9,G10,G11,G12,G13,G14,G15,G16 } = currentPortinformation;

        //后端传来的数据是字典形式，这里将数据图片上的形式划分成6个列表
        let arr1 = []
        let arr2 = []
        
        if(Object.keys(currentPortinformation).length != 0) {
            arr1 =[G1,G2,G3,G4,G5,G6,G7,G8];
            arr2 =[G9,G10,G11,G12,G13,G14,G15,G16];
        }

        return (
            <div className={styles.platform}>
                <div className={styles.interfaces}>
                    <div>
                        {
                            arr1.length > 0 ? arr1.map((i,index) => {
                                if ( index+1 <= currentPortNumber){
                                let blue = (portProps.currentVppstatus === "RUNNING") ? (i.link_status === 'up' ? true : false) : false
                                return (
                                    <Port key={"B1-"+(index+1)} id={"PORT1_"+(index+1)} blue={blue} {...portProps}  
                                    portid={(index+1)}  portName={'G'+(index+1)}/> 
                                )}else{
                                    return(
                                        <React.Fragment key={index+1}>
                                            <div className={styles.in1_above}>
                                                <Button
                                                    style={{
                                                        width: '120%',
                                                        height: '100%',
                                                    }}
                                                    disabled = {true}
                                                >
                                                </Button>
                                            </div>
                                            <div className={styles.blank}></div>
                                        </React.Fragment>
                                    )
                                }
                            }) : null
                        }
                    </div>
                    <div className={styles.div_bottom}>
                        {
                            arr2.length > 0 ? arr2.map((i,index) => {
                                if ( index+9 <= currentPortNumber ){
                                    let blue = (portProps.currentVppstatus === "RUNNING") ? (i.link_status === 'up' ? true : false) : false
                                return (
                                    <Port key={"B2-"+(index+1)} id={"PORT2_"+(index+1)} blue={blue} {...portProps}
                                    portid={(index+9)}  portName={'G'+(9+index)}/>
                                )}else{
                                    return(
                                        <React.Fragment key={index+8}>
                                            <div className={styles.in1_above}>
                                                <Button
                                                    style={{
                                                        width: '120%',
                                                        height: '100%',
                                                    }}
                                                    disabled = {true}
                                                >
                                                </Button>
                                            </div>
                                            <div className={styles.blank}></div>
                                        </React.Fragment>
                                    )
                                }
                            }) : null
                        }
                    </div>
                </div>
        </div>
        )
    }
}