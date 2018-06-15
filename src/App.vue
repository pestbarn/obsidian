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
        </header>
        <p>Uppsala, Sweden</p>

        <hr>

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
                        <strong>
                            <a :href="`https://untappd.com/b/${ beer.url }`">
                                View on Untappd
                            </a>
                        </strong>
                    </li>
                    <li>{{ beer.style }}</li>
                    <li>{{ beer.abv }}</li>
                    <li>&mdash;</li>
                    <li>
                        <a href="" @click.prevent="showRecipe(beer.id)">(toggle recipe)</a>
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
            fetch('http://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then(result => {
                this.loadBeers();
            });
        },
        computed: {
            val: function() { console.dir(this.beers) }
        },
        methods: {
            loadBeers() {
                const db = firebase.database();

                db.ref('/').once('value').then(snap => {
                    snap.forEach(beer => {
                        const thisBeer = beer.val();
                        this.beers.push(thisBeer);
                    });
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
    @import url('https://fonts.googleapis.com/css?family=Allerta+Stencil|Glegoo');

    :root {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 16px;
        color: #666;
    }

    .logotype {
        width: 12.5rem;
        margin-left: -5rem;

        @media screen and (max-width: 768px) {
            margin-left: 0;
        }
    }

    #app {
        font-family: 'Glegoo', Helvetica, Arial, sans-serif;
        text-align: center;
        max-width: 80rem;
        margin: 3.75rem auto;
    }

    h1 {
        font-family: 'Allerta Stencil';

        @media screen and (max-width: 768px) {
            font-size: 1.75rem;
            margin-top: .5rem;
        }
    }

    hr {
        margin: 5rem 0;
        border-color: #999;
    }

    a {
        color: hotpink;

        &:hover {
            color: deeppink;
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

    article {
        margin: 2rem 0;

        > ul,
        .beer-recipe > ul {
            padding: 0;
        }
    }

    .beer {
        display: grid;
        grid-template-columns: 40vw 50vw;
        grid-gap: 2.5rem;
        align-items: start;

        a,
        ul {
            grid-column: 2;
        }

        @media screen and (max-width: 768px) {
            grid-template-columns: 100vw;
        }
    }

    .beer-label {
        padding: 1rem;

        img {
            border: 1px solid #999;
        }

        @media screen and (max-width: 768px) {
            max-width: 75vw;
            justify-self: center;
        }
    }

    .beer-info,
    .beer-recipe {
        text-align: left;
        font-size: .875rem;
    }

    .beer-recipe {
        display: none;
    }

    footer {
        margin-top: 5rem;
        padding-top: 5rem;
        border-top: 1px solid #999;

        a {
            text-transform: uppercase;
        }
        ul {
            padding: 0;
        }
        li {
            display: inline-block;
            padding-right: 2rem;
        }
    }
</style>
