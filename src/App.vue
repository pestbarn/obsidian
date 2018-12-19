<template>
    <div id="app">
        <header>
            <svg xmlns="http://www.w3.org/2000/svg" width="612" height="612" viewBox="665.573 0 612 612" class="logotype">
                <path fill="none" stroke="#1c140d" stroke-width="2.9999700000000002" d="M155.335 216.8L305.997 66.137l150.662 150.661-150.662 150.662z" />
                <path fill="none" stroke="#1c140d" stroke-width="3" d="M359.75 265.167L306 367.462l-54.5-102.295 54.5-48.368z" />
                <path fill="none" stroke="#1c140d" stroke-width="3" d="M454 244.804L306 552.49 157.5 244.772 306 159.166z" />
                <g fill="none" stroke="#1c140d" stroke-width="3">
                    <path d="M551.134 267.515L323 551.49l153.5-307.657 56.667-35.667zM535.167 184.2l-52.05 32.599L331.75 66.25l95.002-8.431z" />
                </g>
                <g fill="none" stroke="#1c140d" stroke-width="3">
                    <path d="M60.866 267.515L289 551.49 135.5 243.833l-56.667-35.667zM76.833 184.2l52.05 32.599L280.25 66.25l-95.002-8.431z" />
                </g>
                <g>
                    <path stroke="#fff" stroke-width="10" d="M1119.573 244.804l-148 307.686-148.5-307.718 148.5-85.606z" />
                    <path stroke="#fff" stroke-width="9.9999" d="M820.902 216.803L971.564 66.142l150.661 150.661-150.661 150.662z" />
                    <path fill="none" stroke="#fff" stroke-width="10" d="M823.073 244.772l148.5-85.606 148 85.638" />
                    <path stroke="#fff" stroke-width="10" d="M1025.179 265.167l-53.75 102.295-54.5-102.295 54.5-48.368z" />
                    <g stroke="#fff" stroke-width="3">
                        <path d="M1216.706 267.515L988.573 551.49l153.5-307.657 56.667-35.667zM1200.74 184.2l-52.05 32.599L997.323 66.25l95.001-8.431z" />
                    </g>
                    <g stroke="#fff" stroke-width="3">
                        <path d="M726.439 267.515L954.573 551.49l-153.5-307.657-56.667-35.667zM742.406 184.2l52.049 32.599L945.823 66.25l-95.002-8.431z" />
                    </g>
                </g>
            </svg>
            <img src="./assets/logo.svg">
            <h1>
                {{ subtitle }}
            </h1>
        </header>

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

        <img src="./assets/loading.svg" id="loading">

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
                    <li>{{ beer.abv }}</li>
                    <li v-if="beer.ingredients">&mdash;</li>
                    <li v-else>In production</li>
                    <li v-if="beer.url">
                        <a :href="`https://untappd.com/b/${ beer.url }`">
                            View on Untappd<sup>↗</sup>
                        </a>
                    </li>
                    <li>
                        <a href="" @click.prevent="showRecipe(beer.id)" v-if="beer.ingredients">Show/hide recipe</a>
                    </li>
                </ul>
                <ul class="beer-recipe" :id="beer.id" v-if="beer.ingredients">
                    <li>
                        <strong>Ingredients:</strong>
                        <ul>
                            <li v-for="ingredient in beer.ingredients.slice(1)" :key="ingredient">
                                {{ ingredient }}
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Instructions:</strong>
                        <ol>
                            <li v-for="instruction in beer.instructions.slice(1)" :key="instruction">
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
</template>

<script>
import firebase from 'firebase';
import * as config from '../firebase.config';
import anime from 'animejs';

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
            targets: '.logotype g path',
            easing: 'easeInOutSine',
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 1500,
            delay: 2500
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
