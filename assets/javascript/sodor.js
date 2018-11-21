// Initialize Firebase
var config = {
    apiKey: "AIzaSyDhOii2LFO9w-B407hNVVWIrg7gbfbdxLE",
    authDomain: "sodor-d0f2f.firebaseapp.com",
    databaseURL: "https://sodor-d0f2f.firebaseio.com",
    projectId: "sodor-d0f2f",
    storageBucket: "sodor-d0f2f.appspot.com",
    messagingSenderId: "29575778510"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Gets user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    // Logs everything to console
    console.log("Train Name: " + newTrain.name);
    console.log("Destination: " + newTrain.destination);
    console.log("First Train: " + newTrain.firstTrain);
    console.log("Frequency: " + newTrain.frequency);

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {

    var csv = childSnapshot.val();

    // Store everything into a variable.
    var trainName = csv.name;
    var destination = csv.destination;
    var firstTrain = csv.firstTrain;
    var frequency = csv.frequency;

    var currentTime = moment().format("HH:mm");


    // Calculate train times

    console.log("FirstTrain: " + firstTrain);

    var firstTrainRevised = moment(firstTrain, "HH:mm").subtract(1, "years");  //to determine if first train of day has happened

    console.log("firstTrainConverted " + firstTrainRevised.format("HH:mm"));

    console.log("Current Time: " + currentTime);

    var diffTime = moment().diff(moment(firstTrainRevised), "minutes");

    console.log("diffTime: " + diffTime);

    var remainder = diffTime % frequency;

    console.log("remainder: " + remainder);

    var minAway = frequency - remainder;

    console.log("minAway: " + minAway);

    var nextTrain = moment().add(minAway, "minutes").format("HH:mm");

    console.log("Arrival Time: " + nextTrain);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

});






