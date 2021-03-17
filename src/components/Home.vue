<template>
    <div ref="beer-container">
        <article class="beer" v-for="beer in beers.slice().reverse()" :key="beer.id">
            <div class="beer-content">
                <ul class="beer-info">
                    <li>
                        <h2>
                            <router-link :to="{ name: 'beer', params: { slug: beer.slug }}" @click.native="toTop">
                                {{ beer.name }}
                            </router-link>
                        </h2>
                    </li>
                    <li>
                        <strong>{{ beer.style }}</strong>
                        <span v-if="beer.currentbatch">|
                            <em>Current batch: {{ beer.currentbatch }}</em>
                        </span>
                    </li>
                    <li v-if="beer.description">
                        <p class="beer-description">{{ beer.description }}</p>
                    </li>
                    <li>
                        <router-link :to="{ name: 'beer', params: { slug: beer.slug }}" @click.native="toTop">
                            View recipe
                        </router-link>
                    </li>
                </ul>
            </div>
            <figure class="beer-label" :data-label="beer.id">
                <router-link :to="{ name: 'beer', params: { slug: beer.slug }}" @click.native="toTop">
                    <img :src="images[beer.id]">
                </router-link>
            </figure>

            <BeerStats :beer="beer"></BeerStats>

            <div class="preload-image">
                <img :src="`${fullImage[beer.id]}`">
            </div>
        </article>
    </div>
</template>

<script>
import BeerStats from './BeerStats.vue'
import firebase from 'firebase/app'
import 'firebase/database'
import * as config from '/firebase.config'
import images from '../assets/labels/*.square.jpg'
import fullImage from '../assets/labels/*.full.jpg'

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default {
    name: 'Home',
    components: {
        BeerStats
    },
    data() {
        return {
            beers: [],
            images: images,
            fullImage: fullImage
        }
    },
    mounted() {
        this.loadBeers()
        this.toTop()
    },
    methods: {
        toTop() {
            window.scrollTo(0, 0)
        },
        loadBeers() {
            let loading = this.$findRefByName('loading')
            const debug = 0

            if (sessionStorage.beerList && !debug) {
                const array = [...JSON.parse(sessionStorage.getItem('beerList'))]

                array.sort(this.compare)
                this.beers = array
                if (!loading.hidden) loading.hidden = true
                return
            }

            const db = firebase.database()

            db.ref('/').once('value').then(snap => {
                const array = []

                snap.forEach(beer => {
                    array.push(beer.val())
                })

                array.sort(this.compare)
                array.forEach(val => this.beers.push(val))

                sessionStorage.setItem('beerList', JSON.stringify(this.beers))
                if (!loading.hidden) loading.hidden = true
            })
        },
        compare(a, b) {
            const dateA = a.brewday.slice(-1)[0].date
            const dateB = b.brewday.slice(-1)[0].date

            if (dateA < dateB) return -1
            if (dateA > dateB) return 1
            return 0
        }
    }
}
</script>
