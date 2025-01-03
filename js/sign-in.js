// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getDatabase, ref, set, update, child, get }
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJ7i7nE08rD_OnUl6JNdCf-TGUGYBV-Dw",
    authDomain: "wang-se2425-firebase-dem-ed51a.firebaseapp.com",
    databaseURL: "https://wang-se2425-firebase-dem-ed51a-default-rtdb.firebaseio.com",
    projectId: "wang-se2425-firebase-dem-ed51a",
    storageBucket: "wang-se2425-firebase-dem-ed51a.firebasestorage.app",
    messagingSenderId: "825777387898",
    appId: "1:825777387898:web:7ec753b015d89579c23ec3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth();

const db = getDatabase(app)


// ---------------------- Sign-In User ---------------------------------------//
document.getElementById('signIn').onclick = function () {

    // Get user's email and passwork for sign in
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Attempt to sign user in
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //Create user credential & store user ID
            const user = userCredential.user;

            // Log sign-in
            // update - will onl add the last_login information and won't overwrite anything else
            let logDate = new Date();
            update(ref(db, 'users/' + user.uid + '/accountInfo'), {
                last_login: logDate,

            })
                .then(() => {
                    // User signed in successfully
                    alert('User signed in successfully!')

                    // Get snapshot of all the user info (including uid) to
                    // the login() function and store in session or local storage
                    get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
                        if (snapshot.exists()) {
                            // console.log(snapshot.val()); 
                            logIn(snapshot.val());
                        } else {
                            console.log("User does not exist");
                        }
                    })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    // Sign in failed
                    alert(error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
}


// --------------- Keep User Logged In ------------//
function logIn(user) {
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

    // Session storage is temporary (only while session is active)
    // Information saved as a string (must convert JS object to a string)
    // Session starge will be cleard with a signOut() function is home.js
    if (!keepLoggedIn) {
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'home.html';
    }

    // Local storage is permanent (keep user logged in even if browser is closed)
    // Local storage will be cleared a signOut() function in home.js
    else {
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'home.html';
    }

}