
/**
 * 获取元素节点位置
 * @param {object} e 
 * @param {string} type 
 */
function getElementPosition(e, type){
    let x = 0;
    let y = 0;
    let el = e
    while (el !== null)  {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    if(type == "Igress") {
        let w = e.offsetWidth
        let h = e.offsetHeight
        return { x: x + w + 1, y: y + 0.5 * h }
    }else if(type == "Egress") {
        let w = e.offsetWidth
        let h = e.offsetHeight
        return { x: x, y: y + 0.5 * h }
    }else if(type == "Cgress") {
        let w = e.offsetWidth
        let h = e.offsetHeight
        return {x: x + w, y: y + 0.5 * h }
    }
    else return { x: x, y: y }
} 
/**
 * 获取鼠标位置
 * @param {object} event 
 */
function getMousePosition(event){
    let e = event || window.event
    let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft
    let scrollY = document.documentElement.scrollTop || document.body.scrollTop
    let x = e.pageX || e.clientX + scrollX
    let y = e.pageY || e.clientY + scrollY
    return {x,y}
}

/**
 * 冒泡排序
 * @param {array} list 
 */
function bubbleSort(list) {
    let t = list
    let len = t.length;
    for(let i = 0; i < len-1; i++) {
        for(let j = 0; j < len-1-i; j++) {
            if(parseInt(t[j])>parseInt(t[j+1])) {
                let temp = t[j];
                t[j] = t[j+1];
                t[j+1] = temp;
            }
        }
    }
    return t
}
/**
 * 去重
 * @param {array} list
 */
function deduplication(list){
    var x = new Set(list)
    return [...x]
}

export { getElementPosition, getMousePosition, bubbleSort, deduplication } 