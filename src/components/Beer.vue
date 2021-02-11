<template>
    <div>
        <article class="beer beer-detailed-view" v-for="beer in beers.slice().reverse()" :key="beer.id">
            <div class="beer-content">
                <figure class="beer-label" :data-label="beer.id">
                    <VuePureLightbox
                        :thumbnail="`${fullImage[beer.id]}`"
                        :images="[`${fullImage[beer.id]}`]"
                    />
                </figure>
                <ul class="beer-info">
                    <li>
                        <h2>
                            {{ beer.name }}
                        </h2>
                    </li>
                    <li>
                        <strong>{{ beer.style }}</strong>
                        <span v-if="beer.currentbatch">|
                            <em v-if="!beer.onetime">Current batch: {{ beer.currentbatch }}</em>
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
                <ul class="beer-recipe" :id="beer.id" v-if="beer.ingredients">
                    <li>
                        <strong>Ingredients:</strong>
                        <ul v-if="typeof beer.ingredients[1] === 'string'">
                            <li v-for="ingredient in beer.ingredients" :key="ingredient">
                                {{ ingredient }}
                            </li>
                        </ul>
                        <ul v-else>
                            <li v-for="ingredient in beer.ingredients[beer.currentbatch]" :key="ingredient">{{ ingredient }}</li>
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
                    <li>
                        <router-link to="/">
                            &laquo; Home
                        </router-link>
                    </li>
                </ul>
            </div>
        </article>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import * as config from '/firebase.config';
import fullImage from '../assets/labels/*.full.jpg';
import VuePureLightbox from 'vue-pure-lightbox';
import BeerStats from './BeerStats.vue';

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export default {
    name: 'Beer',
    components: {
        VuePureLightbox,
        BeerStats
    },
    data() {
        return {
            beers: [],
            fullImage: fullImage
        };
    },
    mounted() {
        this.loadBeer(this.$route.params.slug);
    },
    methods: {
        loadBeer(slug) {
            const db = firebase.database();

            db.ref('/').once('value').then(snap => {
                let promises = [];

                snap.forEach(beer => {
                    if (beer.val().slug !== slug) return;
                    promises.push(
                        this.beers.push(beer.val())
                    );
                });

                Promise.all(promises).then(() => {
                    if (!this.beers.length) this.$router.push('/');
                    if (document.getElementById('loading')) document.getElementById('loading').remove();
                });
            });
        },
    }
};
</script>
