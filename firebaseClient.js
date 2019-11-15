// https://howtofirebase.com/save-and-query-firebase-data-ed73fb8c6e3a
const firebase = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://obsidian-beer.firebaseio.com'
});

const ref = firebase.app().database().ref();
ref.once('value')
    .then(function(snap) {
        console.log('snap.val()', snap.val());
    });
