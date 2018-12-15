<template>
    <div id="app">
        <header>
            <img src="./assets/logotype.svg" class="logotype">
            <img src="./assets/logo.svg">
            <h1>
                <span style="display: none;">
                    Obsidian
                </span>
                {{ subtitle }}
            </h1>
            <p>Uppsala, Sweden</p>
        </header>

        <img src="./assets/loading.svg" id="loading">

        <article class="beer" v-for="beer in beers" :key="beer.id">
            <figure class="beer-label">
                <img :src="`dist/${beer.id}.png`">
            </figure>
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
                        <a href="" @click.prevent="showRecipe(beer.id)">Recipe 🍺</a>
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
        </article>
        <footer>
            <ul>
                <li>
                    <a href="https://github.com/pestbarn/obsidian">
                        Github
                    </a>
                </li>
                <li>
                    <a href="https://untappd.com/ObsidianCraftBrewery">
                        Untappd
                    </a>
                </li>
                <li>
                    <a href="https://freepik.com/free-vector/shiny-geometric-shapes-pattern_1112735.htm"
                        title="Background pattern 'Shiny geometric shapes pattern' created by @visnezh / Freepik">
                        Pattern design
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

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Allerta+Stencil|Lato');
    @import url('main.css');

    .logotype {
        width: 12.5rem;
        margin-left: -5rem;

        @media screen and (max-width: 768px) {
            margin-left: 0;
        }
    }

    #app {
        font-family: 'Lato', Helvetica, Arial, sans-serif;
        text-align: center;
        margin: 0 auto;

        @media screen and (max-width: 980px) {
            margin: 1.5rem 0 0;
        }
    }

    h1 {
        font-family: 'Allerta Stencil';

        @media screen and (max-width: 980px) {
            font-size: 1.75rem;
            margin-top: .5rem;
        }
    }

    hr {
        margin: 5rem 0;
        border-color: #1c140d;

        @media screen and (max-width: 980px) {
            margin: 2rem 0;
        }
    }

    a {
        color: #1c140d;
        font-weight: 600;

        &:hover {
            color: #1c140d;
            cursor: pointer;
        }
    }

    ul {
        list-style: none;
        margin: 0;

        li {
            padding: .1rem 0;
        }
    }

    img {
        max-width: 100%;
    }
</style>
