const e = (sel) => document.querySelector(sel)

const log = console.log.bind(console)

const isArray = o => Array.isArray(o)
const isString = o => typeof o === 'string'

const showLog = function(...args) {
    let div = e('.container')
    let l = []
    for (let i = 0; i < args.length; i++) {
        let a = args[i]
        let s = ''
        if (isArray(a)) {
            s += '>'
            s += '['
            if (isString(a[0])) {
                s += "\'" + a[0] + "\'"
            }
            s += ']'
        } else {
            s = a
        }
        l.push(s)
    }
    div.innerHTML = l.join(' ')
}

const __main = function() {
    log(['a'])
    showLog(['a'])
}

__main()
