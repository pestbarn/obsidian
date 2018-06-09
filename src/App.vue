<template>
    <div id="app">
        <header>
            <img src="./assets/logotype.svg" class="logotype">
            <img src="./assets/logo.svg">
            <h1>{{ subtitle }}</h1>
        </header>
        <p>Uppsala, Sweden</p>

        <hr>

        <article class="beer">
            <figure class="beer-label">
                <img src="./assets/01.abbey.abattoir.png">
            </figure>
            <ul class="beer-info">
                <li>
                    <a href="https://untappd.com/b/obsidian-craft-brewery-abbey-abattoir/2684494">
                        <strong>
                            Abbey Abattoir
                        </strong>
                    </a>
                </li>
                <li>Belgian Tripel</li>
                <li>7.0%</li>
                <li>&mdash;</li>
                <li><strong>Ingredients:</strong>
                    <ul>
                        <li>4 kg Pilsner malt</li>
                        <li>460g Belgian candi sugar</li>
                        <li>460g Carapils malt</li>
                        <li>60g Tettnanger (Hallertau)</li>
                        <li>2 l yeast starter (Whitelabs WLP500)</li>
                        <li>20 l water</li>
                    </ul>
                </li>
                <li><strong>Instructions:</strong>
                    <ol>
                        <li>
                            Place half of water in refrigerator to cool in sanitized container
                        </li>
                        <li>
                            Tie 460g Carapils in large mesh grain bag and place in 10 liters of water
                        </li>
                        <li>
                            Begin to heat, remove bag when temperature reaches 77°C
                        </li>
                        <li>
                            Bring to boil &ndash; slowly add 900g Pilsner malt
                        </li>
                        <li>
                            When boil begins, add all hops in a mesh bag
                        </li>
                        <li>
                            After 45 min of boiling, add remaining Pilsner malt and Belgian candi sugar
                        </li>
                        <li>
                            After 60 min, remove from heat
                        </li>
                        <li>
                            Cool wort below 29°C and transfer to sanitized fermentor &ndash; top off with refrigerated water
                        </li>
                        <li>
                            Take gravity reading &ndash; you're aiming for <strong>~1.075</strong>
                        </li>
                        <li>
                            Carefully pour yeast starter into cooled wort (below 21°C), agitate vigorously
                        </li>
                        <li>
                            Ferment in dark place, keep ambient temperature between 20 and 21°C
                        </li>
                        <li>
                            After primary fermentation (two consistent gravity readings), transfer to secondary bucket, clean and sanitize primary fermentors, and pour back for conditioning &ndash; store as cool as possible
                        </li>
                        <li>
                            Bottle after another two to four weeks, prime with candi sugar (6g / liter)
                        </li>
                    </ol>
                </li>
            </ul>
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
    export default {
        name: 'app',
        data() {
            return {
                subtitle: 'Craft Brewery'
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
    }

    #app {
        font-family: 'Glegoo', Helvetica, Arial, sans-serif;
        text-align: center;
        max-width: 80rem;
        margin: 3.75rem auto;
    }

    h1 {
        font-family: 'Allerta Stencil';
    }

    hr {
        margin: 5rem 0;
        border-color: #999;
    }

    a {
        color: hotpink;

        &:hover {
            color: deeppink;
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

        > ul {
            padding: 0;
        }
    }

    .beer {
        display: grid;
        grid-template-columns: 30vw 50vw;
        grid-gap: 5rem;
    }

    .beer-label {
        border: 1px solid #999;
        padding: 1rem;
    }

    .beer-info {
        text-align: left;
        font-size: .875rem;
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
