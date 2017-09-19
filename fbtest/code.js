"use strict";

firebase.initializeApp({
    apiKey: "AIzaSyBL_g03YJ05_bDTjj8wC-g4-UzHLu3G-QI",
    authDomain: "test-80f6f.firebaseapp.com",
    databaseURL: "https://test-80f6f.firebaseio.com",
    projectId: "test-80f6f",
    storageBucket: "",
    messagingSenderId: "547873247400"
});

const ref = firebase.database().ref("test");
ref.push({ key: "value" });