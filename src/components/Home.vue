<template>
    <div>
        <article class="beer" v-for="beer in beers.slice().reverse()" :key="beer.id">
            <div class="beer-content">
                <ul class="beer-info">
                    <li>
                        <h2>
                            <router-link :to="{ name: 'beer', params: { slug: beer.slug }}">
                                {{ beer.name }}
                            </router-link>
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
                        <router-link :to="{ name: 'beer', params: { slug: beer.slug }}">
                            View recipe
                        </router-link>
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
</template>

<script>
import VuePureLightbox from 'vue-pure-lightbox';
import firebase from 'firebase/app';
import 'firebase/database';
import * as config from '/firebase.config';
import images from '../assets/labels/*.square.jpg';
import fullImage from '../assets/labels/*.full.jpg';

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export default {
    name: 'Home',
    components: {
        VuePureLightbox
    },
    data() {
        return {
            beers: [],
            images: images,
            fullImage: fullImage
        };
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
        }
    }
};
</script>