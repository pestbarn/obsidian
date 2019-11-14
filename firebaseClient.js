// https://howtofirebase.com/save-and-query-firebase-data-ed73fb8c6e3a
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://obsidian-beer.firebaseio.com'
});
