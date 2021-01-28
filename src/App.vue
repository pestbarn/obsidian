<template>
    <div id="app">
        <header>
            <ObsidianLogo></ObsidianLogo>
            <img src="assets/logotype.svg" class="logotype">
            <h1>
                Craft Brewery
            </h1>

            <footer>
                <ul>
                    <li>
                        <a href="https://github.com/pestbarn/obsidian">
                            github
                        </a>
                    </li>
                    <li>
                        <a href="https://untappd.com/ObsidianCraftBrewery">
                            untappd
                        </a>
                    </li>
                </ul>
            </footer>
        </header>

        <img src="assets/loading.svg" id="loading">

        <div class="main">
            <article class="beer" v-for="beer in beers.slice().reverse()" :key="beer.id">
                <div class="beer-content">
                    <ul class="beer-info">
                        <li>
                            <h2>
                                {{ beer.name }}
                            </h2>
                        </li>
                        <li>
                            <strong>{{ beer.style }}</strong>
                        </li>
                        <li>
                            {{ typeof beer.abv === 'string' ? beer.abv : beer.abv[beer.currentbatch] }}
                            <span v-if="beer.ibu"> - {{ typeof beer.abv === 'string' ? beer.ibu : beer.ibu[beer.currentbatch] }} IBU</span>
                        </li>
                        <li v-if="beer.currentbatch">
                            <em v-if="!beer.onetime">Current batch: {{ beer.currentbatch }}</em>
                        </li>
                        <li v-if="beer.description">
                            &mdash;
                            <p>{{ beer.description }}</p>
                        </li>
                        <li v-if="beer.ingredients">&mdash;</li>
                        <li v-else>In production</li>
                        <li v-if="beer.url" class="view-on-untappd">
                            <a :href="`https://untappd.com/b/${ beer.url }`">
                                View on Untappd
                            </a>
                        </li>
                        <li>
                            <a href="" @click.prevent="showRecipe(beer.id)" v-if="beer.ingredients">
                                {{ showHideRecipe }} recipe
                            </a>
                        </li>
                    </ul>
                    <ul class="beer-recipe" :id="beer.id" v-if="beer.ingredients">
                        <li>
                            <h3>
                                How to brew {{ beer.name }}
                                <span v-if="beer.currentbatch && beer.currentbatch > 1">(batch {{ beer.currentbatch }})</span>
                            </h3>
                        </li>
                        <li>
                            <strong>Ingredients:</strong>
                            <ul v-if="typeof beer.ingredients[1] === 'string'">
                                <li v-for="ingredient in beer.ingredients" :key="ingredient">
                                    {{ ingredient }}
                                </li>
                            </ul>
                            <ul v-else v-for="ingredient in beer.ingredients[beer.currentbatch]" :key="ingredient">
                                <li>{{ ingredient }}</li>
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
                </div>
                <figure class="beer-label" :data-label="beer.id">
                    <VuePureLightbox
                        :thumbnail="`${images[beer.id]}`"
                        :images="[`${fullImage[beer.id]}`]"
                    />
                </figure>
                <div class="preload-image" style="display: none; visibility: hidden;">
                    <img :src="`${fullImage[beer.id]}`">
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import ObsidianLogo from './components/ObsidianLogo.vue';
import VuePureLightbox from 'vue-pure-lightbox';
import firebase from 'firebase/app';
import 'firebase/database';
import * as config from '../firebase.config';
import anime from 'animejs';
import './prefixfree.min.js';
import images from 'assets/labels/*.square.jpg';
import fullImage from 'assets/labels/*.full.jpg';

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export default {
    name: 'App',
    components: {
        VuePureLightbox,
        ObsidianLogo
    },
    data() {
        return {
            beers: [],
            images: images,
            fullImage: fullImage,
            showHideRecipe: 'Show'
        };
    },
    mounted() {
        this.loadBeers();

        anime({
            targets: '.logo path',
            easing: 'easeInOutSine',
            strokeDashoffset: [ anime.setDashoffset, 0 ],
            duration: (el, i) => i * 750,
            delay: 1500
        });
    },
    methods: {
        loadBeers() {
            const db = firebase.database();

            db.ref('/').once('value').then(snap => {
                let promises = [];

                snap.forEach(beer => {
                    promises.push(
                        this.beers.push(beer.val())
                    );
                });

                Promise.all(promises).then(() =>
                    document.getElementById('loading').remove()
                );
            });
        },
        showRecipe(id) {
            const el = document.getElementById(id);
            const label = document.querySelector(`[data-label="${id}"] img`);
            const showHide = this.showHideRecipe;

            el.style.display === 'block'
                ? (el.style.display = 'none')
                : (el.style.display = 'block');

            showHide === 'Show'
                ? this.showHideRecipe = 'Hide'
                : this.showHideRecipe = 'Show';

            if (document.body.offsetWidth >= 1024) {
                const transform = (label.style.transform === '' || label.style.transform === 'scale(1)');

                anime({
                    targets: label,
                    easing: 'easeOutElastic',
                    elasticity: 600,
                    duration: transform ? 1000 : 600,
                    delay: transform ? 100 : 0,
                    scale: transform ? 2 : 1
                });
            }
        }
    }
};
</script>

<style>
    @import url('./main.css');
</style>
