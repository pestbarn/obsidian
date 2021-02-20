<template>
    <div id="app" v-touch:swipe="swipeHandler">
        <header>
            <ObsidianLogo></ObsidianLogo>
            <router-link to="/">
                <img src="assets/logotype.svg" class="logotype">
            </router-link>
            <h1>
                <router-link to="/">
                    Craft Brewery
                </router-link>
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
            <router-view :key="$route.params.slug" ref="routerView"></router-view>
        </div>
    </div>
</template>

<script>
import ObsidianLogo from './components/ObsidianLogo.vue'
import anime from 'animejs'
import './prefixfree.min.js'

export default {
    name: 'App',
    components: {
        ObsidianLogo
    },
    metaInfo: {
        titleTemplate: (titleChunk) => {
            return titleChunk ? `${titleChunk} - Obsidian Craft Brewery` : 'Obsidian Craft Brewery'
        }
    },
    mounted() {
        anime({
            targets: '.logo path',
            easing: 'easeInOutSine',
            strokeDashoffset: [ anime.setDashoffset, 0 ],
            duration: (el, i) => i * 750,
            delay: 500
        })
    },
    methods: {
        swipeHandler(dir) {
            // Navigate directly from beer to beer with swipes

            if (!this.$route.name) return

            let goTo

            if (dir === 'left') goTo = this.$refs.routerView.$refs.nextLink
            if (dir === 'right') goTo = this.$refs.routerView.$refs.prevLink

            if (!goTo) return

            this.$router.push(goTo[0].to)
        }
    }
}
</script>
