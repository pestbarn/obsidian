<template>
    <div>
        <article class="beer beer-detailed-view" v-for="beer in beers.slice().reverse()" :key="beer.id">
            <div class="beer-content">
                <figure class="beer-label" :data-label="beer.id">
                    <img :src="fullImage[beer.id]">
                </figure>
                <ul class="beer-info">
                    <li>
                        <h2>
                            {{ beer.name }}
                        </h2>
                    </li>
                    <li class="beer-meta">
                        <strong>{{ beer.style }}</strong>
                        <span v-if="beer.currentbatch">
                            Batch no: {{ beer.currentbatch }}
                        </span>
                        <span v-if="beer.brewday">
                            Brewday: {{ beer.brewday[beer.currentbatch ? beer.currentbatch : 1].date }}
                        </span>
                    </li>
                    <li v-if="beer.description">
                        <p>{{ beer.description }}</p>
                    </li>
                    <li v-if="beer.url" class="view-on-untappd">
                        <a :href="`https://untappd.com/b/${ beer.url }`">
                            View on Untappd
                        </a>
                    </li>
                </ul>

                <div class="beer-ingredients" v-if="beer.recipe">
                    <div class="beer-water" v-if="beer.recipe[beer.currentbatch ? beer.currentbatch : 1].waters">
                        <table>
                            <thead>
                                <tr>
                                    <th colspan="10">Water</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(waters, i) in beer.recipe[beer.currentbatch ? beer.currentbatch : 1].waters.slice(1)" :key="i">
                                    <td v-for="(water, j) in waters" :key="j">{{ water }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="beer-fermentables" v-if="beer.recipe[beer.currentbatch ? beer.currentbatch : 1].fermentables">
                        <table>
                            <thead>
                                <tr>
                                    <th colspan="10">Fermentables</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(fermentables, i) in beer.recipe[beer.currentbatch ? beer.currentbatch : 1].fermentables.slice(1)" :key="i">
                                    <td v-for="(fermentable, j) in fermentables" :key="j">{{ fermentable }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="beer-hops" v-if="beer.recipe[beer.currentbatch ? beer.currentbatch : 1].hops">
                        <table>
                            <thead>
                                <tr>
                                    <th colspan="10">Hops</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(hops, i) in beer.recipe[beer.currentbatch ? beer.currentbatch : 1].hops.slice(1)" :key="i">
                                    <td v-for="(hop, j) in hops" :key="j">{{ hop }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="beer-yeast" v-if="beer.recipe[beer.currentbatch ? beer.currentbatch : 1].fermentation">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fermentation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(fermentation, i) in beer.recipe[beer.currentbatch ? beer.currentbatch : 1].fermentation.slice(1)" :key="i">
                                    <td v-for="(object, j) in fermentation" :key="j">{{ object }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="beer-additions" v-if="beer.recipe[beer.currentbatch ? beer.currentbatch : 1].additions">
                        <table>
                            <thead>
                                <tr>
                                    <th>Additions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(additions, i) in beer.recipe[beer.currentbatch ? beer.currentbatch : 1].additions.slice(1)" :key="i">
                                    <td v-for="(addition, j) in additions" :key="j">{{ addition }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <ul class="beer-recipe" :id="beer.id" v-else-if="beer.ingredients">
                    <li>
                        <strong>Ingredients:</strong>
                        <ul v-if="typeof beer.ingredients[1] === 'string'">
                            <li v-for="ingredient in beer.ingredients.slice(1)" :key="ingredient">
                                {{ ingredient }}
                            </li>
                        </ul>
                        <ul v-else>
                            <li v-for="ingredient in beer.ingredients[beer.currentbatch].slice(1)" :key="ingredient">
                                {{ ingredient }}
                            </li>
                        </ul>
                    </li>
                    <li v-if="beer.instructions">
                        <strong>Instructions:</strong>
                        <ol v-if="typeof beer.instructions[1] === 'string'">
                            <li v-for="instruction in beer.instructions.slice(1)" :key="instruction">
                                {{ instruction }}
                            </li>
                        </ol>
                        <ol v-else>
                            <li v-for="instruction in beer.instructions[beer.currentbatch].slice(1)" :key="instruction">
                                {{ instruction }}
                            </li>
                        </ol>
                    </li>
                </ul>

                <BeerStats :beer="beer"></BeerStats>

                <ul class="beer-return-link">
                    <li v-if="slugs[slugs.indexOf(beer.slug) + 1]">
                        <router-link ref="prevLink" :to="slugs[slugs.indexOf(beer.slug) + 1]">
                            &laquo;
                            {{ slugs[slugs.indexOf(beer.slug) + 1].replace('-', ' ') }}
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/">
                            Home
                        </router-link>
                    </li>
                    <li v-if="slugs[slugs.indexOf(beer.slug) - 1]">
                        <router-link ref="nextLink" :to="slugs[slugs.indexOf(beer.slug) - 1]">
                            {{ slugs[slugs.indexOf(beer.slug) - 1].replace('-', ' ') }}
                            &raquo;
                        </router-link>
                    </li>
                </ul>
            </div>
        </article>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import * as config from '/firebase.config'
import fullImage from '../assets/labels/*.full.jpg'
import BeerStats from './BeerStats.vue'
import '../beer.scss'

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default {
    name: 'Beer',
    components: {
        BeerStats
    },
    data() {
        return {
            beers: [],
            fullImage: fullImage,
            slugs: [],
            beerName: []
        }
    },
    metaInfo() {
        return {
            title: this.beerName
        }
    },
    mounted() {
        this.loadBeer(this.$route.params.slug)
    },
    methods: {
        loadBeer(slug) {
            let loading = this.$findRefByName('loading')

            if (loading.hidden) loading.hidden = false

            if (sessionStorage.beerList) {
                const beerList = JSON.parse(sessionStorage.getItem('beerList'))

                beerList.filter(beer => {
                    this.slugs.push(beer.slug)
                    if (beer.slug === slug) {
                        this.beers.push(beer)
                        this.beerName.push(beer.name)
                    }
                })

                if (!this.beers.length) this.$router.push('/')
                if (!loading.hidden) loading.hidden = true
                return
            }

            const db = firebase.database()

            db.ref('/').once('value').then(snap => {
                let promises = []
                let allBeers = []

                snap.forEach(beer => {
                    allBeers.push(beer.val())
                    this.slugs.push(beer.val().slug)
                    if (beer.val().slug !== slug) return
                    promises.push(
                        this.beers.push(beer.val()),
                        this.beerName.push(beer.val().name)
                    )
                })

                sessionStorage.setItem('beerList', JSON.stringify(allBeers))

                Promise.all(promises).then(() => {
                    if (!this.beers.length) this.$router.push('/')
                    if (!loading.hidden) loading.hidden = true
                })
            })
        }
    }
}
</script>
