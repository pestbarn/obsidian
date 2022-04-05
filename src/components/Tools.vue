<template>
    <transition-group name="slide-fade" appear>
        <article class="beer beer-tools" :key="0">
            <h2>Brewing Calculation Tools</h2>
        </article>

        <article class="beer beer-tools" :key="1">
            <section>
                <h3>Calculate Hop Weight</h3>

                <div class="beer-tool">
                    <form>
                        <table id="hop-weight">
                            <tr>
                                <td><span v-katex="'\{ I = }'"></span></td>
                                <td><input type="text" v-model="hopWeight.ibu" placeholder="IBU" @keyup="calcRequiredHopAmount()"></td>
                            </tr>
                            <tr>
                                <td><span v-katex="'\{ V = }'"></span></td>
                                <td><input type="text" v-model="hopWeight.volume" placeholder="Wort Volume (liter)" @keyup="calcRequiredHopAmount()"></td>
                            </tr>
                            <tr>
                                <td><span v-katex="'\{ C = }'"></span></td>
                                <td><input type="text" v-model="hopWeight.og" placeholder="OG (1.000)" @keyup="calcRequiredHopAmount()"></td>
                            </tr>
                            <tr>
                                <td><span v-katex="'\{ U = }'"></span></td>
                                <td>
                                    <select type="text" v-model="hopWeight.aAUtilization" @change="calcRequiredHopAmount()">
                                        <option value="U" selected disabled>α-acid Utilization</option>
                                        <option value="0.34">90 min boil (0.34)</option>
                                        <option value="0.28">60 min boil (0.28)</option>
                                        <option value="0.21">30 min boil (0.21)</option>
                                        <option value="0.14">15 min boil (0.14)</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><span v-katex="'\{ A = }'"></span></td>
                                <td><input type="text" v-model="hopWeight.alphaAcids" placeholder="α-acid Concentration (%)" @keyup="calcRequiredHopAmount()"></td>
                            </tr>
                            <tr>
                                <td><span v-katex="'\{ K = }'"></span></td>
                                <td><input type="text" placeholder="Conversion Constant (1000)" disabled></td>
                            </tr>
                        </table>
                    </form>

                    <div>
                        <div v-katex:auto :key="hopWeight.update">
                            \(\Large HA\) = \(\LARGE \frac{ { {{ hopWeight.ibu ? hopWeight.ibu : 'I' }} } * {{ hopWeight.volume ? hopWeight.volume : 'V' }} * {{ hopWeight.og > 1.050 ? Number(parseFloat(1 + (hopWeight.og - 1.050) / 2 * 10).toFixed(3)) : hopWeight.og > 1 ? 1 : hopWeight.og == null ? 'C' : 'C' }} }{ {{ hopWeight.aAUtilization ? hopWeight.aAUtilization : 'U' }} * {{ hopWeight.alphaAcids ? hopWeight.alphaAcids / 100 : 'A' }} * K}\){{ hopWeight.required ? ' = ' : '' }}\(\huge {{ hopWeight.required }}\)
                        </div>

                        <div v-katex:auto style="margin: 2rem 0;">
                            \(HA = Hop Amount Required (Grams)\)
                        </div>
                    </div>
                </div>
            </section>
        </article>

        <article class="beer beer-tools" :key="2">
            <section>
                <h3>ABV from OG, FG, and Plato</h3>

                <div class="beer-tool">
                    <form action="">
                        <table>
                            <tr>
                                <td><span v-katex="'\{ OG = }'"></span></td>
                                <td><input type="text" v-model="ogFg.og" placeholder="OG" @keyup="calcOgFg()"></td>
                            </tr>
                            <tr>
                                <td><span v-katex="'\{ FG = }'"></span></td>
                                <td><input type="text" v-model="ogFg.fg" placeholder="FG" @keyup="calcOgFg()"></td>
                            </tr>
                        </table>

                        <table>
                            <tr>
                                <td><span v-katex="'\{ P°_1 = }'"></span></td>
                                <td><input type="text" v-model="plato.platoPre" placeholder="P° before fermentation" @keyup="calcPlato()"></td>
                            </tr>
                            <tr>
                                <td><span v-katex="'\{ P°_2 = }'"></span></td>
                                <td><input type="text" v-model="plato.platoPost" placeholder="P° after fermentation" @keyup="calcPlato()"></td>
                            </tr>
                        </table>
                    </form>

                    <div>
                        <div v-katex:auto style="" :key="ogFg.update">
                            \(\huge \frac{ {{ ogFg.og ? ogFg.og : 'OG' }} - {{ ogFg.fg ? ogFg.fg : 'FG' }} }{ 0.00753 }\){{ ogFg.gravityABV ? ' = ' : '' }}\(\LARGE {{ ogFg.gravityABV }}{{ ogFg.gravityABV ? '\\% ABV' : '' }}\)
                        </div>
                        <div v-katex:auto style="margin-top: 2rem;" :key="plato.update">
                            \(\Large {{ plato.platoPre ? plato.platoPre + '°P' : 'P°_1' }} - {{ plato.platoPost ? plato.platoPost + '°P' : 'P°_2' }} * 0.516\){{ plato.platoABV ? ' = ' : '' }}\(\Large {{ plato.platoABV }}{{ plato.platoABV ? '\\% ABV' : '' }}\)
                        </div>
                    </div>
                </div>
            </section>
        </article>

        <article class="beer beer-tools" :key="3">
            <section>
                <h3>EBC</h3>

                <div class="beer-tool">
                    <form action="">
                        <table>
                            <tr>
                                <td><span v-katex="'\{ MC = }'"></span></td>
                                <td><input type="text" v-model="ebc.ebc" placeholder="Malt color (°EBC)" @keyup="calcEbc()"></td>
                            </tr>
                            <tr>
                                <td><span v-katex="'\{ MW = }'"></span></td>
                                <td><input type="text" v-model="ebc.amount" placeholder="Malt weight (kg)" @keyup="calcEbc()"></td>
                            </tr>
                            <tr>
                                <td><span v-katex="'\{ TGL = }'"></span></td>
                                <td><input type="text" v-model="ebc.total" placeholder="Total grain load (kg)" @keyup="calcEbc()"></td>
                            </tr>
                        </table>
                    </form>

                    <div>
                        <div v-katex:auto style="" :key="ebc.update">
                            \(\Large MCU\) = \(\huge \frac{ MC * MW }{ TGL }\){{ ebc.ebcContribution ? ' = ' : '' }}\(\LARGE {{ ebc.ebcContribution }}{{ ebc.ebcContribution ? '\°EBC' : '' }}\)
                        </div>
                    </div>
                </div>
            </section>
        </article>
    </transition-group>
</template>

<script>
import '../beer.scss'
import '../beer-tools.scss'

export default {
    name: 'Beer',
    data() {
        return {
            tools: [],
            hopWeight: {
                ibu: null,
                volume: null,
                og: null,
                aAUtilization: 'U',
                alphaAcids: null,
                update: null,
                required: null
            },
            ogFg: {
                og: null,
                fg: null,
                update: null,
                gravityABV: null,
            },
            plato: {
                platoPre: null,
                platoPost: null,
                update: null,
                platoABV: null
            },
            ebc: {
                ebc: null,
                amount: null,
                total: null,
                update: null,
                ebcContribution: null
            }
        }
    },
    metaInfo() {
        return {
            title: 'Brewing Calculation Tools'
        }
    },
    mounted() {
        let loading = this.$findRefByName('loading')
        if (!loading.hidden) loading.hidden = true
    },
    methods: {
        calcRequiredHopAmount() {
            this.hopWeight.update = Math.random()

            if (
                this.hopWeight.ibu > 0 &&
                this.hopWeight.volume > 0 &&
                this.hopWeight.og > 1 &&
                this.hopWeight.aAUtilization !== 'U' &&
                this.hopWeight.alphaAcids > 0
            ) {
                let correctionFactor = this.hopWeight.og > 1.050 ? Number(parseFloat(1 + (this.hopWeight.og - 1.050) / 2 * 10).toFixed(3)) : 1

                let numerator = this.hopWeight.ibu * this.hopWeight.volume * correctionFactor
                let denominator = (this.hopWeight.aAUtilization * (this.hopWeight.alphaAcids / 100)) * 1000

                this.hopWeight.required = parseFloat(numerator / denominator).toFixed(2)
            } else return null
        },
        calcOgFg() {
            this.ogFg.update = Math.random()

            if (
                this.ogFg.og > 0 &&
                this.ogFg.fg > 0
            ) {
                let numerator = this.ogFg.og - this.ogFg.fg
                let denominator = 0.00753

                this.ogFg.gravityABV = parseFloat(numerator / denominator).toFixed(1)
            }
        },
        calcPlato() {
            this.plato.update = Math.random()

            if (
                this.plato.platoPre > 0 &&
                this.plato.platoPost > 0
            ) {
                this.plato.platoABV = parseFloat(this.plato.platoPre - this.plato.platoPost + 0.516).toFixed(1)
            }
        },
        calcEbc() {
            this.ebc.update = Math.random()

            if (
                this.ebc.ebc > 0 &&
                this.ebc.amount > 0 &&
                this.ebc.total > 0
            ) {
                this.ebc.ebcContribution = parseFloat((this.ebc.ebc * this.ebc.amount) / this.ebc.total)
            }
        }
    }
}
</script>
