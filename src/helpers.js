export default {
    install(Vue) {
        Vue.prototype.$findRefByName = function(refName) {
            let obj = this
            while (obj) {
                if (obj.$refs[refName]) {
                    return obj.$refs[refName]
                }
                obj = obj.$parent
            }
            return undefined
        }
    }
}
