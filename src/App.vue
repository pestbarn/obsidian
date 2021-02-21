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

        <img src="assets/loading.svg" id="loading" ref="loading">

        <div class="main" ref="main">
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

            if (dir === 'left') {
                let goTo = this.$refs.routerView.$refs.nextLink
                if (!goTo) return

                this.swipeTo('left', 150, goTo)
            }

            if (dir === 'right') {
                let goTo = this.$refs.routerView.$refs.prevLink
                if (!goTo) return

                this.swipeTo('right', 150, goTo)
            }
        },
        swipeTo(dir, dur, goTo) {
            const main = this.$refs.main

            // Reset main to default classlist
            main.classList = 'main'

            const transition = `${dur}ms transform`
            main.style.transition = transition

            main.classList.add(`to-${dir}`)

            const opposite = dir === 'left' ? 'right' : 'left'

            setTimeout(() => {
                // After swipe has finished (dur), disable transition to make
                // the element "jump" to the opposite side
                main.style.transition = ''

                setTimeout(() => {
                    // Element has transitioned to one side; push new route
                    // and start opposite transition
                    main.classList = `main from-${opposite}`
                    this.$router.push(goTo[0].to)

                    setTimeout(() => {
                        // Element has jumped to opposite side, reapply
                        // transition and reset to default class
                        main.style.transition = transition
                        main.classList = 'main'
                    }, (dur / 10))
                }, (dur / 10))
            }, dur)
        }
    }
}
</script>
