<template>
    <div id="app">
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
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import ObsidianLogo from './components/ObsidianLogo.vue';
import anime from 'animejs';
import './prefixfree.min.js';

export default {
    name: 'App',
    components: {
        ObsidianLogo
    },
    mounted() {
        anime({
            targets: '.logo path',
            easing: 'easeInOutSine',
            strokeDashoffset: [ anime.setDashoffset, 0 ],
            duration: (el, i) => i * 750,
            delay: 1500
        });
    }
};
</script>
