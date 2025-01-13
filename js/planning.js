// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getDatabase, ref, set, update, child, get, remove }
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDKbqiPJ6a-c3KwAC856uxFCa-F9eJ4Lw",
    authDomain: "webdev-3-77770.firebaseapp.com",
    databaseURL: "https://webdev-3-77770-default-rtdb.firebaseio.com",
    projectId: "webdev-3-77770",
    storageBucket: "webdev-3-77770.firebasestorage.app",
    messagingSenderId: "389459481710",
    appId: "1:389459481710:web:9af5534ea0e5a64609427f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth();

const db = getDatabase(app);


// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById('userLink');   //User name for navbar
let signOutLink = document.getElementById('signOut')  // Sign out link
let welcome = document.getElementById('welcome');     // Welcome header
let currentUser = null;                               // Initialize current user to null 


// ----------------------- Get User's Name'Name ------------------------------
function getUserName(){

  // Grab value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem('keepLoggedIn');

  // Grab the user information from the signIn.JS
  if(keepLoggedIn == 'yes'){
    currentUser = JSON.parse(localStorage.getItem('user'));
  }
  else {
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser(){
  sessionStorage.removeItem('user');              // Clear session storage
  localStorage.removeItem('user');                // Clear local storage
  localStorage.removeItem('keepLoggedIn)');       // Clear logged in setting


  signOut(auth).then(() => {
    //Sign out successful
  }).catch((error) => {
    // Error occured 
  });

  window.location = 'home.html'
}


// ------------------------Set (insert) data into FRD ------------------------
function setData(userID, year, month, day, attendees){
  // Must use brackets around variable name to use it as a key
  set(ref(db, 'users/' + userID + '/data/' + year + '/' + month), {
    [day]: attendees
})
.then(() => {
  alert('Thanks for your registration!')
})
.catch((error) => {
  alert ('There was an erorr. Error: ' + error);
});
}


// -------------------------Update data in database --------------------------
function updateData(userID, year, month, day, attendees){
  // Must use brackets around variable name to use it as a key
  update(ref(db, 'users/' + userID + '/data/' + year + '/' + month), {
    [day]: attendees
})
.then(() => {
  alert('Thanks for updating your visit!')
})
.catch((error) => {
  alert ('There was an erorr. Error: ' + error);
});
}

// ----------------------Get a datum from FRD (single data point)---------------
function getData(userID, year, month, day){
  
  let yearVal = document.getElementById('yearVal');
  let monthVal = document.getElementById('monthVal');
  let dayVal = document.getElementById('dayVal');
  let attendVal = document.getElementById('attendVal');

  const dbref = ref(db);  // firebase parameter for requesting data

  // provide the path through the nodes to the data requested
  get(child(dbref, 'users/' + userID + '/data/' + year + '/' + month)).then((snapshot) => {
    if(snapshot.exists()){
      yearVal.textContent = year;
      monthVal.textContent = month;
      dayVal.textContent = day;
      
      // to get specific value from a key: snapshot.value()[key]
      attendVal.textContent = snapshot.val()[day]

    } else{
      alert('No data found')
    }
  })
  .catch((error) => {
    alert('unseccessful, error' + error);
  })


}

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph

async function getDataSet(userID, year){
  
  let yearVal = document.getElementById('setYearVal');
  // let monthVal = document.getElementById('setMonthVal');
  yearVal.textContent = `Year: ${year}`;
  // monthVal.textContent = `Month: ${month}`;

  const monthsArray = [];
  const monthlyTotals = [];

  // const days = [];
  // const attends = [];

  const dbref = ref(db);


  try {
    const snapshot = await get(child(dbref, 'users/' + userID + '/data/' + year));
    
    if (snapshot.exists()) {
      // For each month found under that year
      snapshot.forEach((monthSnapshot) => {
        // monthKey might be "Jan", "Feb", or "03", etc.
        const monthKey = monthSnapshot.key;

        // Sum up the daily attendance in this month
        let sumForMonth = 0;
        monthSnapshot.forEach((daySnapshot) => {
          if(daySnapshot.val()>0) {
            sumForMonth ++;
          }
        });

        // Store results in arrays
        monthsArray.push(monthKey);
        monthlyTotals.push(sumForMonth);
      });
    } else {
      alert('No months found for the given year.');
      return;
    }
    } catch (error) {
      alert('Unsuccessful. Error: ' + error);
      return;
    }
    console.log(monthsArray)
    console.log(monthlyTotals)
    // Create or update the scatter chart
    createMonthlyScatterChart(monthsArray, monthlyTotals);
  }
    
  
  
  function createMonthlyScatterChart(monthsArray, monthlyTotals) {
    const monthMap = {
      "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4,
      "May": 5, "Jun": 6, "Jul": 7, "Aug": 8,
      "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
    };
    
      const dataPoints = monthsArray.map((m, i) => {
      const xVal = monthMap[m];           
      const yVal = monthlyTotals[i];    
      return { x: xVal, y: yVal };
    });

    console.log(dataPoints)

    const ctx = document.getElementById('scatterChart');
  
    if (window.myScatterChart) {
      window.myScatterChart.destroy();
    }
  
    window.myScatterChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Visits',
            font: {
              family:'REM',
            },
            data: dataPoints,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Month',
              font: {
                family:'REM', 
              }
            },
            min: 1,
            max: 12,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                const monthNames = [
                  '',
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];
                return monthNames[value]; 
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Total Visits per Month',
              font: {
                family:'REM',
              }
            },
            type: 'linear',
            suggestedMin: 0,
            suggestedMax: 31,
            tick: {
              maxTickLimit: 31,
              stepSize: 5,
              callback: function(value) {
                return Number.isInteger(value) ? value : '';
              },
              font: {
                  size: 12,
                  family:'REM',
              }
          },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Yearly Visit Schedule',
            font: {
              size: 20,
              family:'REM',
            },
            padding: { top: 10, bottom: 10 },
          },
          legend: {
            position: 'top',
            font: {
              
            }
          },
        },
      },
    });
  }

// -------------------------Delete a day's data from FRD ---------------------

function deleteData(userID, year, month, day) {
  
  // Clarification Message
  const confirmDelete = confirm(`Are you sure you want to delete the data for ${year}/${month}/${day}?`);
  
  // Proceed if the user confirms
  if (confirmDelete) {
    remove(ref(db, 'users/' + userID + '/data/' + year + '/' + month + '/' + day))
      .then(() => {
        alert('Aw, sorry you canceled your visit.');
      })
      .catch((error) => {
        alert('Unsuccessful, error: ' + error);
      });
  } else {
    alert('Deletion canceled');
  }
}

// --------------------------- Home Page Loading -----------------------------
window.onload = function(){


  // ------------------------- Set Welcome Message -------------------------
  getUserName();    // Get current user's first name
  if(currentUser == null){
    userLink.innerText = "Create New Account";
    userLink.classList.replace('nav-link', 'btn')
    userLink.classList.add('btn-primary');
    userLink.href = 'register.html';

    signOutLink.innerText = 'Sign In';
    signOutLink.classList.repkace('nav-link', 'btn');
    signOutLink.classList.add('btn-success');
    signOutLink.href = 'signIn.html';
  }
  else{
    userLink.innerText = currentUser.firstname;
    welcome.innerText = 'Welcome ' + currentUser.firstname; 
    userLink.classList.replace('btn', 'nav-ink')
    userLink.classList.add('btn-primary');
    userLink.href = '#';

    signOutLink.innerText = 'Sign Out';
    signOutLink.classList.repkace('btn', 'nav-link');
    signOutLink.classList.add('btn-success');
    document.getElementById('signOut').onclick = function(){
      signOutUser();
    }
  }

}
  
  // Get, Set, Update, Delete Sharkriver Temp. Data in FRD
  // Set (Insert) data function call
  document.getElementById('set').onclick = function(){
    const year = document.getElementById('year').value
    const month = document.getElementById('month').value
    const day = document.getElementById('day').value
    const attendees = document.getElementById('attendees').value
    const userID = currentUser.uid;
    
    setData(userID, year, month, day, attendees);
  }

  // Update data function call
  
  document.getElementById('update').onclick = function(){
    const year = document.getElementById('year').value
    const month = document.getElementById('month').value
    const day = document.getElementById('day').value
    const attendees = document.getElementById('attendees').value
    const userID = currentUser.uid;
    
    updateData(userID, year, month, day, attendees);
  }
  // Get a datum function call
  
  document.getElementById('get').onclick = function(){
    const year = document.getElementById('getYear').value
    const month = document.getElementById('getMonth').value
    const day = document.getElementById('getDay').value
    const userID = currentUser.uid;

    getData(userID, year, month, day);

  };

  // Get a data set function call
  document.getElementById('getDataSet').onclick = function(){
    const year = document.getElementById('getSetYear').value;
    const userID = currentUser.uid;

    getDataSet(userID, year);
  };
  // Delete a single day's data function call
  document.getElementById('delete').onclick = function(){
    const year = document.getElementById('delYear').value
    const month = document.getElementById('delMonth').value
    const day = document.getElementById('delDay').value
    const userID = currentUser.uid;

    deleteData(userID, year, month, day);

  }

