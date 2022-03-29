<template>
    <transition name="slide-fade" appear>
        <article class="beer beer-detailed-view" v-for="beer in beers.slice().reverse()" :key="beer.id">
            <div class="beer-content">
                <div class="beer-visuals">
                    <figure class="beer-photo" :data-label="beer.id" v-if="beer.photo">
                        <img :src="photo[beer.id]">
                    </figure>
                    <figure class="beer-label" :data-label="beer.id">
                        <img :src="fullImage[beer.id]">
                    </figure>
                </div>
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
                            Brewday: {{ formatDate(beer.brewday[beer.currentbatch ? beer.currentbatch : 1].date) }}
                        </span>
                    </li>
                    <li v-if="beer.description">
                        <p class="beer-description">{{ beer.description }}</p>
                    </li>
                    <li v-if="beer.url" class="view-on-untappd">
                        <a :href="`https://untappd.com/b/${ beer.url }`">
                            <span v-if="beerRating">
                                {{ beerRating }}/5 on Untappd
                            </span>
                            <span v-else>
                                View on Untappd
                            </span>
                        </a>
                    </li>
                </ul>

                <div class="beer-ingredients" v-if="beer.recipe">
                    <BeerIngredients :beer="beer" />
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
    </transition>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import * as config from '/firebase.config'
import fullImage from '../assets/labels/*.full.jpg'
import photo from '../assets/photos/*.jpg'
import BeerIngredients from './BeerIngredients.vue'
import BeerStats from './BeerStats.vue'
import '../beer.scss'
const UntappdClient = require('node-untappd')

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default {
    name: 'Beer',
    components: {
        BeerIngredients,
        BeerStats
    },
    data() {
        return {
            beers: [],
            fullImage: fullImage,
            photo: photo,
            slugs: [],
            beerID: [],
            beerName: [],
            beerRating: null
        }
    },
    metaInfo() {
        return {
            title: this.beerName
        }
    },
    beforeMount() {
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

                    if (beer.slug !== slug) return

                    beer.url && this.beerID.push(beer.url.split('/')[1])
                    this.beers.push(beer)
                    this.beerName.push(beer.name)
                })

                if (!this.beers.length) this.$router.push('/')
                if (!loading.hidden) loading.hidden = true

                this.loadRatings()
                if (localStorage.getItem('freedomUnits')) this.unitConversions()
                return
            }

            firebase.database().ref('/').once('value').then(snap => {
                let promises = []
                let allBeers = []

                snap.forEach(beer => {
                    allBeers.push(beer.val())
                    this.slugs.push(beer.val().slug)

                    if (beer.val().slug !== slug) return

                    promises.push(
                        beer.val().url && this.beerID.push(beer.val().url.split('/')[1]),
                        this.beers.push(beer.val()),
                        this.beerName.push(beer.val().name)
                    )
                })

                this.loadRatings()
                if (localStorage.getItem('freedomUnits')) this.unitConversions()
                sessionStorage.setItem('beerList', JSON.stringify(allBeers))

                Promise.all(promises).then(() => {
                    if (!this.beers.length) this.$router.push('/')
                    if (!loading.hidden) loading.hidden = true
                })
            })
        },

        loadRatings() {
            const env = require('/.env.js')
            const untappd = new UntappdClient()

            untappd.setClientId(env.UNTAPPD_CLIENTID)
            untappd.setClientSecret(env.UNTAPPD_CLIENTSECRET)

            const bID = this.beerID
            if (sessionStorage[bID]) {
                this.setRating(JSON.parse(sessionStorage[bID]))
                return
            }

            if (!bID.length) return

            untappd.beerInfo((err, obj) => {
                const response = obj.response.beer
                const storage = {
                    beerID: response.bid,
                    ratingCount: response.rating_count,
                    ratingScore: response.rating_score
                }

                sessionStorage.setItem(bID, JSON.stringify(storage))

                this.setRating(JSON.parse(sessionStorage[bID]))
            }, { BID: bID })
        },

        setRating(obj) {
            const ratingScore = obj.ratingScore
            if (!ratingScore) return

            this.beerRating = ratingScore
        },

        formatDate(date) {
            const year = parseInt(String(date).slice(0, 4))
            const month = parseInt(String(date).slice(4, 6))
            const day = parseInt(String(date).slice(6, 8))

            return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        },

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
}
</script>
