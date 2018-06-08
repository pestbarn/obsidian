<template>
    <div id="app">
        <img src="./assets/logotype.svg" style="width: 200px">
        <img src="./assets/logo.svg">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {
                msg: 'Obsidian Craft Brewery'
            }
        }
    }
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Allerta+Stencil|Glegoo');
    #app {
        font-family: 'Glegoo', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1 {
        font-family: 'Allerta Stencil';
    }

    a {
        color: #42b983;
    }
</style>
