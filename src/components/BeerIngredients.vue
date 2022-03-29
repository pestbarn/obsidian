<template>
    <div>
        <div class="beer-water" v-if="batch.waters">
            <table>
                <thead>
                    <tr>
                        <th colspan="10">Water</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(waters, i) in batch.waters.slice(1)" :key="i">
                        <td v-for="(water, j) in waters" :key="j" :data-original="water" :ref="`water${j[0].toUpperCase()}${j.slice(1)}`">
                            <strong v-if="j === 'key'">{{ water }}</strong>
                            <span v-else>{{ water }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="beer-fermentables" v-if="batch.fermentables">
            <table>
                <thead>
                    <tr>
                        <th colspan="10">Fermentables</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(fermentables, i) in batch.fermentables.slice(1)" :key="i">
                        <td v-for="(fermentable, j) in fermentables" :key="j" :data-original="fermentable" :ref="`fermentables${j[0].toUpperCase()}${j.slice(1)}`">
                            <strong v-if="j === 'amount'">{{ fermentable }}</strong>
                            <span v-else>{{ fermentable }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="beer-hops" v-if="batch.hops">
            <table>
                <thead>
                    <tr>
                        <th colspan="10">Hops</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(hops, i) in batch.hops.slice(1)" :key="i">
                        <td v-for="(hop, j) in hops" :key="j" :data-original="hop" :ref="`hops${j[0].toUpperCase()}${j.slice(1)}`">
                            <strong v-if="j === 'amount'">{{ hop }}</strong>
                            <span v-else>{{ hop }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="beer-yeast" v-if="batch.fermentation">
            <table>
                <thead>
                    <tr>
                        <th>Fermentation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(fermentation, i) in batch.fermentation.slice(1)" :key="i">
                        <td v-for="(ferm, j) in fermentation" :key="j" :data-original="ferm" :ref="`fermentation${j[0].toUpperCase()}${j.slice(1)}`">
                            <strong v-if="j === 'key'">{{ ferm }}</strong>
                            <span v-else>{{ ferm }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="beer-additions" v-if="batch.additions">
            <table>
                <thead>
                    <tr>
                        <th>Additions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(additions, i) in batch.additions.slice(1)" :key="i">
                        <td v-for="(addition, j) in additions" :key="j" :data-original="addition" :ref="`addition${j[0].toUpperCase()}${j.slice(1)}`">
                            <strong v-if="j === 'amount'">{{ addition }}</strong>
                            <span v-else>{{ addition }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="beer-chemistry" v-if="batch.chemistry">
            <table>
                <thead>
                    <tr>
                        <th>Water Chemistry</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <strong>Ca<sup>2+</sup></strong> {{ chem['ca2'] }}
                        </td>
                        <td>
                            <strong>Mg<sup>2+</sup></strong> {{ chem['mg2'] }}
                        </td>
                        <td>
                            <strong>Na<sup>+</sup></strong> {{ chem['na'] }}
                        </td>
                        <td>
                            <strong>Cl<sup>-</sup></strong> {{ chem['cl'] }}
                        </td>
                        <td>
                            <strong>SO<sub>4</sub><sup>2-</sup></strong> {{ chem['ca2'] }}
                        </td>
                        <td>
                            <strong>HCo<sub>3</sub><sup>-</sup></strong> {{ chem['hco3'] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import '../beer-ingredients.scss'

export default Vue.component('BeerIngredients', {
    props: {
        beer: Object,
    },
    data() {
        return {
            batch: this.beer.recipe[this.beer.currentbatch ? this.beer.currentbatch : 1],
            chem: this.beer.recipe[this.beer.currentbatch ? this.beer.currentbatch : 1].chemistry
        }
    },
    methods: {
        unitConversions() {
            this.$nextTick(() => {
                const refs = this.$refs

                if (refs.waterValue)
                    refs.waterValue.forEach(el => this.$waterConversion(el))

                if (refs.fermentablesAmount)
                    refs.fermentablesAmount.forEach(el => this.$weightConversion(el))

                if (refs.hopsAmount)
                    refs.hopsAmount.forEach(el => this.$weightConversion(el))

                if (refs.fermentationValue)
                    this.$carbonationWeightConversion(
                        refs.fermentationValue[refs.fermentationValue.length - 1]
                    )

                if (refs.additionAmount)
                    refs.additionAmount.forEach(el => this.$weightConversion(el))
            })
        },

        resetConversions() {
            this.$nextTick(() => {
                const refs = this.$refs

                if (refs.waterValue)
                    refs.waterValue.forEach(el => this.resetContent(el))

                if (refs.fermentablesAmount)
                    refs.fermentablesAmount.forEach(el => this.resetContent(el))

                if (refs.hopsAmount)
                    refs.hopsAmount.forEach(el => this.resetContent(el))

                if (refs.fermentationValue)
                    refs.fermentationValue.forEach(el => this.resetContent(el))

                if (refs.additionAmount)
                    refs.additionAmount.forEach(el => this.resetContent(el))
            })
        },

        resetContent(el) {
            return el.innerText = el.dataset.original
        }
    }
})
</script>
