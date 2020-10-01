import firebase from 'firebase'

  // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXinYs_9YAQt52hMbGdKHVj25cYjQkTRo",
    authDomain: "project-planner-cbb54.firebaseapp.com",
    databaseURL: "https://project-planner-cbb54.firebaseio.com",
    projectId: "project-planner-cbb54",
    storageBucket: "project-planner-cbb54.appspot.com",
    messagingSenderId: "66734991453",
    appId: "1:66734991453:web:d27f39a9d059c8853545b4"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore()