<template>
    <ul class="beer-stats">
        <li>
            <p>
                <span>{{ abv(batch.og, batch.fg) }}%</span>
                <abbr title="Alcohol By Volume">ABV</abbr>
            </p>
        </li>
        <li>
            <p>
                <span>{{ plato(batch.og, batch.fg) }}</span>
                <abbr title="Plato Gravity Scale">°P</abbr>
            </p>
        </li>
        <li>
            <p>
                <span>{{ gravity(batch.og) }}</span>
                <abbr title="Original Gravity">OG</abbr>
            </p>
        </li>
        <li>
            <p>
                <span>{{ gravity(batch.fg) }}</span>
                <abbr title="Final Gravity">FG</abbr>
            </p>
        </li>
        <li>
            <p>
                <span>{{ batch.ibu }}</span>
                <abbr title="International Bitterness Units">IBU</abbr>
            </p>
        </li>
        <li>
            <p>
                <span>{{ bu_gu(batch.ibu, batch.og) }}</span>
                <abbr title="Ratio, Bitterness Units to Gravity Units">BU:GU</abbr>
            </p>
        </li>
        <li>
            <p :style="{ background: convert(batch.ebc, .75), borderColor: convert(batch.ebc, 1) }">
                <span>{{ batch.ebc }}</span>
                <abbr title="European Brewing Convention color">EBC</abbr>
            </p>
        </li>
        <li>
            <p :style="{ background: convert(batch.ebc, .75), borderColor: convert(batch.ebc, 1) }">
                <span>{{ Math.round(ebcToSrm(batch.ebc) * 10) / 10 }}</span>
                <abbr title="Standard Reference Method color">SRM</abbr>
            </p>
        </li>
    </ul>
</template>

<script>
import Vue from 'vue'
import '../beer-ingredients.scss'
import '../beer-stats.scss'

export default Vue.component('BeerStats', {
    props: {
        beer: Object,
    },
    data() {
        return {
            batch: this.beer.stats[this.beer.currentbatch ? this.beer.currentbatch : 1]
        }
    },
    methods: {
        convert: function(ebc, sat) {
            ebc = ebc > 80 ? 80 : ebc
            ebc = ebc < 0 ? 0 : ebc
            const srm = this.ebcToSrm(ebc)
            let rgb = {
                r: this.calcRed(srm),
                g: this.calcGreen(srm),
                b: this.calcBlue(srm)
            }
            rgb = this.desaturate(rgb, sat)
            return this.rgbToHex(rgb)
        },
        ebcToSrm: function(ebc) {
            return ebc * 0.508
        },
        calcRed: function(srm) {
            const result = Math.round(280 - srm * 5.65)
            return result > 255 ? 255 : result
        },
        calcGreen: function(srm) {
            const result = Math.round(0.188349 * Math.pow(srm, 2) - 13.2676 * srm + 239.51)
            return result
        },
        calcBlue: function(srm) {
            const result = Math.round(0.000933566 * Math.pow(srm, 4) - 0.0894788 * Math.pow(srm, 3) + 3.00611 * Math.pow(srm, 2) - 40.8883 * srm + 183.409)
            return result < 0 ? 0 : result
        },
        segmentToHex: function(seg) {
            const hex = seg.toString(16)
            return hex.length == 1 ? '0' + hex : hex
        },
        rgbToHex: function(rgb) {
            return '#' + this.segmentToHex(rgb.r) + this.segmentToHex(rgb.g) + this.segmentToHex(rgb.b)
        },
        desaturate: function(rgb, sat) {
            let gray = rgb.r * 0.3086 + rgb.g * 0.6094 + rgb.b * 0.0820
            gray = gray * (1 - sat)
            rgb.r = Math.round(rgb.r * sat + gray)
            rgb.g = Math.round(rgb.g * sat + gray)
            rgb.b = Math.round(rgb.b * sat + gray)
            return rgb
        },
        gravity: function(x) {
            return x.toFixed(3)
        },
        abv: function(og, fg) {
            return ((og - fg) * 131.25).toFixed(1)
        },
        plato: function(og, fg) {
            return ((76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794)).toFixed(1)
        },
        bu_gu: function(ibu, og) {
            return (ibu / ((og - 1) * 1000)).toFixed(2)
        }
    }
})
</script>
