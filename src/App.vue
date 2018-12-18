<template>
    <div id="app">
        <header>
            <img src="./assets/logotype.svg" class="logotype">
            <img src="./assets/logo.svg">
            <h1>
                {{ subtitle }}
            </h1>
        </header>

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
                    <li>&mdash;</li>
                    <li>
                        <a :href="`https://untappd.com/b/${ beer.url }`">
                            View on Untappd<sup>↗</sup>
                        </a>
                    </li>
                    <li>
                        <a href="" @click.prevent="showRecipe(beer.id)">Show recipe</a>
                    </li>
                </ul>
                <ul class="beer-recipe" :id="beer.id">
                    <li><strong>Ingredients:</strong>
                        <ul>
                            <li v-for="ingredient in beer.ingredients.slice(1)" :key="ingredient">
                                {{ ingredient }}
                            </li>
                        </ul>
                    </li>
                    <li><strong>Instructions:</strong>
                        <ol>
                            <li v-for="instruction in beer.instructions.slice(1)" :key="instruction">
                                {{ instruction }}
                            </li>
                        </ol>
                    </li>
                </ul>
            </div>
            <figure class="beer-label">
                <img :src="`dist/${beer.id}.png`">
            </figure>
        </article>
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
    </div>
</template>

<script>
    import firebase from 'firebase';
    import * as config from '../firebase.config';

    firebase.initializeApp(config);

    export default {
        name: 'app',
        data() {
            return {
                subtitle: 'Craft Brewery',
                beers: []
            }
        },
        mounted() {
            this.loadBeers();
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

                el.style.display === 'block' ?
                    el.style.display = 'none' :
                    el.style.display = 'block';
            }
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Allerta+Stencil|Lato');
    @import url('main.css');
</style>
