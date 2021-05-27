import firebase from 'firebase';
import { FIREBASE_CONFIG } from './config';

const app = !firebase.apps.length ?
    firebase.initializeApp(FIREBASE_CONFIG) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider }