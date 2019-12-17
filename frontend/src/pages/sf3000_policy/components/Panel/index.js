import React, { Component } from 'react'
import styles from './style.less'
import Port from '../Interfaces/Port'
import { connect } from 'dva'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'



@connect(({sf3000_home, sf3000_user, sf3000_policy, loading})=>{
    return {
        currentPortinformation: sf3000_home.currentPortinformation,
        currentPerm: sf3000_user.currentPerm,
    }
})
export default class Panel extends Component {
    constructor(props){
        super(props)
        this.arrs = {
            arr1:[],
            arr2:[],
            arr3:[],
            arr4:[],
            arr5:[],
            arr6:[]
        }
        this.state = {
            refreshKey:0
        }
    }

    componentDidUpdate(prevProps){
        const { currentPortinformation } = this.props
        const {X1,X2,X3,X4,X5,X6,X7,X8,X9,X10,X11,X12,X13,X14,X15,X16,X17,X18,X19,X20,X21,X22,X23,X24,
            X25,X26,X27,X28,X29,X30,X31,X32,X33,X34,X35,X36,X37,X38,X39,X40,X41,X42,X43,X44,X45,X46,X47,X48} = currentPortinformation
            console.log(this.state.refreshKey, JSON.stringify(prevProps.currentPortinformation), JSON.stringify(currentPortinformation), !isEqual(prevProps.currentPortinformation, currentPortinformation))
        if((this.state.refreshKey == 0 && !isEmpty(currentPortinformation)) || !isEqual(prevProps.currentPortinformation, currentPortinformation)){
            this.arrs["arr1"] = [X1,X3,X5,X7,X9,X11,X13,X15]
            this.arrs["arr2"] = [X17,X19,X21,X23,X25,X27,X29,X31]
            this.arrs["arr3"] = [X33,X35,X37,X39,X41,X43,X45,X47]
            this.arrs["arr4"] = [X2,X4,X6,X8,X10,X12,X14,X16]
            this.arrs["arr5"] = [X18,X20,X22,X24,X26,X28,X30,X32]
            this.arrs["arr6"] = [X34,X36,X38,X40,X42,X44,X46,X48]
            this.setState({
                refreshKey: this.state.refreshKey + 1
            })
        }
    }

    render(){
        const { portProps } = this.props

        return (
            <div className={styles.platform}>
                <div className={styles.interfaces}>
                    <div className={styles.in1}>
                        {
                            this.arrs["arr1"].length > 0 ? this.arrs["arr1"].map((i,index) => {
                                let red = i.link_status === 'down' ? false : true
                                return (
                                    <Port key={"B1-"+(index+1)} id={"PORT1_"+(index+1)} red={red} {...portProps}  
                                    portid={(2*index+1)} /> //portid为端口配置服务的
                                )
                            }) : null
                        }
                    </div>
                    <div className={styles.in2}>
                        {
                            this.arrs["arr2"].length > 0 ? this.arrs["arr2"].map((i,index) => {
                                let red = i.link_status === 'down' ? false : true
                                return (
                                    <Port key={"B2-"+(index+1)} id={"PORT2_"+(index+1)} red={red} {...portProps}
                                    portid={(2*index+17) } />
                                )
                            }) : null
                        }
                    </div>
                    <div className={styles.in3}>
                        {
                            this.arrs["arr3"].length > 0 ? this.arrs["arr3"].map((i,index) => {
                                let red = i.link_status === 'down' ? false : true
                                return (
                                    <Port key={"B3-"+(index+1)} id={"PORT3_"+(index+1)} red={red} {...portProps}
                                    portid={(2*index+33)} />
                                )
                            }) : null
                        }
                    </div>
                    <div className={styles.in4}>
                        {
                            this.arrs["arr4"].length > 0 ? this.arrs["arr4"].map((i,index) => {
                                let red = i.link_status === 'down' ? false : true
                                return (
                                    <Port key={"B4-"+(index+1)} id={"PORT4_"+(index+1)} red={red} {...portProps}
                                    portid={(2*index+2)} />
                                )
                            }) : null
                        }
                    </div>
                    <div className={styles.in5}>
                        {
                            this.arrs["arr5"].length > 0 ? this.arrs["arr5"].map((i,index) => {
                                let red = i.link_status === 'down' ? false : true
                                return (
                                    <Port key={"B5-"+(index+1)} id={"PORT5_"+(index+1)} red={red} {...portProps}
                                    portid={(2*index+18)} />
                                )
                            }) : null
                        }
                    </div>
                    <div className={styles.in6}>
                        {
                            this.arrs["arr6"].length > 0 ? this.arrs["arr6"].map((i,index) => {
                                let red = i.link_status === 'down' ? false : true
                                return (
                                    <Port key={"B6-"+(index+1)} id={"PORT6_"+(index+1)} red={red} {...portProps}
                                    portid={(2*index+34)} />
                                )
                            }) : null
                        }
                    </div>
                </div>
        </div>
        )
    }
}