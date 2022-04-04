<template>
    <transition name="slide-fade" appear>
        <article class="beer beer-tools">
            <h2>Brewing Calculation Tools</h2>

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
                        <div v-katex:auto style="font-size: 2rem;" :key="hopWeight.update">
                            \(HA\) = \(\frac{ \htmlClass{foo}{ {{ hopWeight.ibu ? hopWeight.ibu : 'I' }} } * {{ hopWeight.volume ? hopWeight.volume : 'V' }} * {{ hopWeight.og > 1.050 ? Number(parseFloat(1 + (hopWeight.og - 1.050) / 2 * 10).toFixed(3)) : hopWeight.og > 1 ? 1 : hopWeight.og == null ? 'C' : 'C' }} }{ {{ hopWeight.aAUtilization ? hopWeight.aAUtilization : 'U' }} * {{ hopWeight.alphaAcids ? hopWeight.alphaAcids / 100 : 'A' }} * K}\){{ hopWeight.required ? '=' : '' }}\({{ hopWeight.required }}\)
                        </div>

                        <div v-katex:auto style="margin: 2rem 0;">
                            \(HA = Hop Amount Required (Grams)\)
                        </div>
                    </div>
                </div>
            </section>
        </article>
    </transition>
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
            this.hopWeight.update += 1

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
        }
    }
}
</script>
