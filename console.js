const e = (sel) => document.querySelector(sel)

const log = console.log.bind(console)

const isArray = o => Array.isArray(o)
const isObject = o => Object.prototype.toString.call(o) === '[object Object]'
const isString = o => typeof o === 'string'
const isFunction = o => typeof o === 'function'

const appendHtml = (elem, value) => {
    let node = document.createElement("div"),
        fragment = document.createDocumentFragment(),
        childs = null,
        i = 0
    node.innerHTML = value
    childs = node.childNodes
    for ( ; i < childs.length; i++) {
        fragment.appendChild(childs[i])
    }
    elem.appendChild(fragment)
    childs = null
    fragment = null
    node = null
}

const showLog = function(...args) {
    let div = e('.container')
    let result = []
    let s = ''
    for (let i = 0; i < args.length; i++) {
        const e = args[i]
        if (isArray(e)) {
            //元素是数组
            s += showArray(e)
        } else if (isObject(e)) {
            //元素是对象
            s += showObject(e)
        } else {
            s += e
        }
        result.push(s)
    }
    div.innerHTML = result.join(' ')
    // unfoldArray(...args)
}

const showArray = (arr) => {
    // 单元素 > ['aaa']
    // 多元素 > (3) ['aaa', 123, Array(2)]
    let s = `<span class="array" data-data='${JSON.stringify(arr)}'>`
    s += '<div class="triangle-right"></div>'
    if (arr.length > 1) {
        s += `(${arr.length})`
    }
    s += '['
    // 数组参数横向展示
    let es = []
    for (let i = 0; i < arr.length; i++) {
        const e = arr[i]
        if (isString(e)) {
            es.push(`<span class="red">'${e}'</span>`)
        } else if (isArray(e)) {
            es.push(`Array(${e.length})`)
        } else if (isObject(e)) {
            es.push('{...}')
        } else {
            es.push(`<span class="blue">${e}</span>`)
        }
    }
    s += es.join(', ')
    s += ']</span>'
    return s
}

const showObject = (obj) => {
    let s = `<span class="object" data-data='${JSON.stringify(obj)}'>`
    s += '<div class="triangle-right"></div>'
    s += '{'
    // 对象参数横向展示
    let es = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            let e = obj[key]
            if (isString(e)) {
                e = `<span class="red">'${e}'</span>`
            } else if (isArray(e)) {
                e = `Array(${e.length})`
            } else if (isObject(e)) {
                e = `{...}`
            } else {
                e = `<span class="blue">${e}</span>`
            }
            es.push(`${key}: ${e}`)
        }
    }
    s += es.join(', ')
    s += '}</span>'
    return s
}

const insertAfter = (targetElement, newElement) => {
    let parent = targetElement.parentNode
    if (parent.lastChild == targetElement){
        parent.appendChild(newElement)
    } else {
        parent.insertBefore(newElement,targetElement.nextSibling)
    }
}

const unfoldArray = (e, arr) => {
    let result = []
    for (let i = 0; i < arr.length; i++) {
        let e = arr[i]
        let s = ''
        let addTriangle = (isArray(e) || isObject(e))
        if (isString(e)) {
            e = `<span class="red">'${e}'</span>`
        } else if (isArray(e)) {
            e = showArray(e)
        } else if(isObject(e)) {
            e = showObject(e)
        } else {
            e = `<span class="blue">${e}</span>`
        }
        // s += addTriangle ? `<div class="triangle-right"></div>${i}: ${e}` : `<span class="space"></span>${i}: ${e}`
        s += `<span class="purple">${i}</span>: ${e}`
        result.push(s)
    }
    //length
    result.push(`<span class="mediumorchid">length</span>: <span class="blue">${arr.length}</span>`)
    // [[Prototype]]
    result.push(`<span class="prototype" data-data="prototype"><div class="triangle-right"></div><span class="grey">[[Prototype]]</span>: Array(0)</span>`)
    let tempNode = document.createElement('div')
    tempNode.className = "unfoldArray tab"
    tempNode.setAttribute("data-data", `${JSON.stringify(arr)}`)
    tempNode.innerHTML = `${result.join('</br>')}`
    insertAfter(e, tempNode)
    //展开元素后，去掉换行
    let br = e.nextSibling.nextSibling
    if (br) {
        br.remove()
    }
}

const unfoldObject = (e, obj) => {
    let result = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            let e = obj[key]
            let s = ''
            if (isString(e)) {
                e = `'${e}'`
            } else if (isArray(e)) {
                e = `Array(${e.length})`
            } else if (isObject(e)) {
                e = `{...}`
            }
            s += `${key}: ${e}`
            result.push(s)
        }
    }
    // [[Prototype]]
    result.push(`<span class="prototype" data-data="prototype"><div class="triangle-right"></div><span class="grey">[[Prototype]]</span>: Array(0)</span>`)
    let tempNode = document.createElement('div')
    tempNode.className = "unfoldObject tab"
    tempNode.setAttribute("data-data", `${JSON.stringify(obj)}`)
    tempNode.innerHTML = `${result.join('</br>')}`
    insertAfter(e, tempNode)
    //展开元素后，去掉换行
    let br = e.nextSibling.nextSibling
    if (br) {
        br.remove()
    }
}

const unfoldPrototype = (e, arr) => {
    // result.push( Object.getOwnPropertyNames(Array.prototype).sort((a,b) => a.localeCompare(b)).join('\n') )
    let result = []
    let obj = Array.prototype
    Object.getOwnPropertyNames(obj).sort((a,b) => a.localeCompare(b)).forEach((val,index) => {
        let e = obj[val]
        let s = ''
        if(isFunction(e)) {
            // toString()后的字符串示例： function Array() { [native code] }
            let funName = obj[val].toString().split(' ')[1]
            e = `<span class="italic">f</span> ${funName}`
        }
        s += `<div class="triangle-right"></div><span class="mediumorchid">${val}</span>: ${e}`
        result.push(s)
    })
    let tempNode = document.createElement('div')
    tempNode.className = "unfoldPrototype tab"
    tempNode.setAttribute("data-data", `${JSON.stringify(obj)}`)
    tempNode.innerHTML = `${result.join('</br>')}`
    insertAfter(e, tempNode)
    //展开元素后，去掉换行
    let br = e.nextSibling.nextSibling
    if (br) {
        br.remove()
    }
}

const unfold = (e, type, data) => {
    if (type === 'array') {
        unfoldArray(e, data)
    } else if (type === 'object') {
        unfoldObject(e, data)
    } else if (type === 'prototype') {
        unfoldPrototype(e, data)
    }
}

const fold = (e, type) => {
    let nextDiv = e.nextElementSibling
    nextDiv.remove()
    //折叠元素后，加上换行
    let br = document.createElement('br')
    insertAfter(e, br)
}

const handleData = (e, type, data) => {
    //处理三角形方向，并展开/折叠数据
    let triangle = e.firstElementChild
    if (triangle.classList.contains('triangle-right')) {
        triangle.classList.remove('triangle-right')
        triangle.classList.add('triangle-down')
        // 展开
        unfold(e, type, data)
    } else {
        triangle.classList.add('triangle-right')
        triangle.classList.remove('triangle-down')
        // 折叠
        fold(e, type)
    }
}

const bindEvent = () => {
    window.addEventListener('click', (event) => {
        const e = event.target
        if(!e.dataset.data) {
            return false
        }
        let jsonData = e.dataset.data.replace(/'/g, '"')
        let data
        if(e.dataset.data != 'prototype') {
            data = JSON.parse(jsonData)
        }
        if (e.classList.contains('array')) {
            handleData(e, 'array', data)
        } else if (e.classList.contains('object')) {
            handleData(e, 'object', data)
        } else if (e.classList.contains('prototype')) {
            handleData(e, 'prototype')
        }
    })
}

const __main = function() {
    // let test = 'aaa'
    // let test2 = 123
    let test3 = ['abc', 123, [1, 2], {c: '222'}]
    // let test4 = {a: 'aaa', b: 123, c: ['aaa', 123], d: {}}
    // log(test, test2, test3)
    // showLog(test, test2, test3)
    bindEvent()
    log(test3)
    showLog(test3)
}

__main()
