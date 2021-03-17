import Qty from 'js-quantities'

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

        Vue.prototype.$waterConversion = function(el) {
            let value = el.innerText
            let time

            if (value.includes('@')) {
                time = el.innerText.slice(0, -7)
                value = el.innerText.slice(-4).replace('°C', 'tempC')
            }

            const kind = Qty(value).kind()
            let converted, string

            switch(kind) {
            case 'volume':
                string = Qty(value).to('gal').toPrec('0.05 gal')
                converted = string
                break
            case 'temperature':
                string = Qty(value).to('tempF').scalar
                converted = time + ' @ ' + string.toFixed(0) + '°F'
                break
            case 'time':
                converted = value
                break
            }

            el.innerText = converted
        }

        Vue.prototype.$weightConversion = function(el) {
            const value = el.innerText
            let converted

            const kind = Qty(value).isBase()

            if (kind) {
                converted = Qty(value).to('lbs').toPrec('0.1 lbs')
            } else {
                converted = Qty(value).to('oz').toPrec('0.01 oz').toString()
                if (converted.charAt(0) === '0') converted = converted.slice(1)
            }

            el.innerText = converted
        }

        Vue.prototype.$carbonationWeightConversion = function(el) {
            const co2vol = el.innerText.split('(')
            if (co2vol.length < 2) return

            const grams = /([0-9](\.[0-9])*\ g)/gi
            const gramsValue = el.innerText.match(grams)[0]

            let weightPerVol = Qty(`${gramsValue.toString()} / L`).to('oz / gal').toPrec('0.01 oz / gal').toString()

            if (weightPerVol.charAt(0) === '0') weightPerVol = weightPerVol.slice(1)

            el.innerText = `${co2vol[0]} (~${weightPerVol})`
        }
    }
}
