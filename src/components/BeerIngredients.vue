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
                        <td v-for="(water, j) in waters" :key="j" :data-original="water" :ref="`water${j[0].toUpperCase()}${j.slice(1)}`">{{ water }}</td>
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
                        <td v-for="(fermentable, j) in fermentables" :key="j" :data-original="fermentable" :ref="`fermentables${j[0].toUpperCase()}${j.slice(1)}`">{{ fermentable }}</td>
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
                        <td v-for="(hop, j) in hops" :key="j" :data-original="hop" :ref="`hops${j[0].toUpperCase()}${j.slice(1)}`">{{ hop }}</td>
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
                        <td v-for="(object, j) in fermentation" :key="j" :data-original="object" :ref="`fermentation${j[0].toUpperCase()}${j.slice(1)}`">{{ object }}</td>
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
                        <td v-for="(addition, j) in additions" :key="j" :data-original="addition" :ref="`addition${j[0].toUpperCase()}${j.slice(1)}`">{{ addition }}</td>
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
            batch: this.beer.recipe[this.beer.currentbatch ? this.beer.currentbatch : 1]
        }
    }
})
</script>
