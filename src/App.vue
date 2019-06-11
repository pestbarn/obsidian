<template>
    <div id="app">
        <header>
            <svg xmlns="http://www.w3.org/2000/svg" width="612" height="612" viewBox="665.573 0 612 612" class="logotype">
                <g fill="none" stroke="#1c140d" stroke-width="7">
                    <path d="M60.866 267.515L289 551.49 135.5 243.833l-56.667-35.667zM76.833 184.2l52.05 32.599L280.25 66.25l-95.002-8.431z" />
                </g>
                <g>
                    <path fill="#181818" stroke="#916947" stroke-width="7" d="M1119.573 244.804l-148 307.686-148.5-307.718 148.5-85.606z" />
                    <path fill="#181818" stroke="#916947" stroke-width="7" d="M820.902 216.803L971.564 66.142l150.661 150.661-150.661 150.662z" />
                    <path fill="#181818" stroke="#916947" stroke-width="7" d="M823.073 244.772l148.5-85.606 148 85.638" />
                    <path fill="#181818" stroke="#916947" stroke-width="7" d="M1025.179 265.167l-53.75 102.295-54.5-102.295 54.5-48.368z" />
                    <g fill="#181818" stroke="#916947" stroke-width="7">
                        <path d="M1216.706 267.515L988.573 551.49l153.5-307.657 56.667-35.667zM1200.74 184.2l-52.05 32.599L997.323 66.25l95.001-8.431z" />
                    </g>
                    <g fill="#181818" stroke="#916947" stroke-width="7">
                        <path d="M726.439 267.515L954.573 551.49l-153.5-307.657-56.667-35.667zM742.406 184.2l52.049 32.599L945.823 66.25l-95.002-8.431z" />
                    </g>
                </g>
            </svg>
            <img src="./assets/logo.svg">
            <h1>
                {{ subtitle }}
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

        <img src="./assets/loading.svg" id="loading">

        <div class="main">

            <article class="beer" v-for="beer in beers" :key="beer.id">
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
                            <span v-if="beer.ibu" style="display: none;"> - {{ typeof beer.abv === 'string' ? beer.ibu : beer.ibu[beer.currentbatch] }} IBU</span>
                        </li>
                        <li v-if="beer.currentbatch">
                            <em v-if="beer.onetime">(one-off brew)</em>
                            <em v-else>Current batch: {{ beer.currentbatch }}</em>
                        </li>
                        <li v-if="beer.description">
                            &mdash;
                            <p>{{ beer.description }}</p>
                        </li>
                        <li v-if="beer.ingredients">&mdash;</li>
                        <li v-else>In production</li>
                        <li v-if="beer.url">
                            <a :href="`https://untappd.com/b/${ beer.url }`">
                                View on Untappd
                            </a>
                        </li>
                        <li>
                            <a href="" @click.prevent="showRecipe(beer.id)" v-if="beer.ingredients">Show/hide recipe</a>
                        </li>
                    </ul>
                    <ul class="beer-recipe" :id="beer.id" v-if="beer.ingredients">
                        <li>
                            <h3>
                                How to brew {{ beer.name }}
                                <span v-if="beer.currentbatch !== '1'">(batch {{ beer.currentbatch }})</span>
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
                    <img :src="`dist/${beer.id}.png`">
                </figure>
            </article>

        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import * as config from '../firebase.config';
import anime from 'animejs';
import './prefixfree.min.js';

firebase.initializeApp(config);

export default {
    name: 'App',
    data() {
        return {
            subtitle: 'Craft Brewery',
            beers: []
        };
    },
    mounted() {
        this.loadBeers();

        anime({
            targets: '.logotype path',
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
            const label = document.querySelector(`[data-label="${id}"]`);

            el.style.display === 'block'
                ? (el.style.display = 'none')
                : (el.style.display = 'block');

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
    @import url('https://fonts.googleapis.com/css?family=Allerta+Stencil|Lato');
    @import url('main.css');
</style>
