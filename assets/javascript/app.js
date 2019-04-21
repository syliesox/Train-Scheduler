// Initialize Firebase
var config = {
    apiKey: "AIzaSyBTzhzUCQsqCr0VuYEuA5FnYOshWA-cfM8",
    authDomain: "gt-lol-bd963.firebaseapp.com",
    databaseURL: "https://gt-lol-bd963.firebaseio.com",
    projectId: "gt-lol-bd963",
    storageBucket: "gt-lol-bd963.appspot.com",
    messagingSenderId: "268481167716"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  //Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    // Prevents refresh  
    event.preventDefault();

      // Grabs user input
      var trainName = $("#train-name-input").val().trim();
      var trainDestination = $("#destination-input").val().trim();
      var trainStart = moment($("#first-train-input").val().trim(), "HH:mm").format("hh:mm A");
      var trainFreq = $("#frequency-input").val().trim();

      // Creates local temp object for holding train data
      var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFreq
      };

      // Uploads train data to the databse
      database.ref().push(newTrain);

      // Logs everything to the console
      console.log(newTrain.name);
      console.log(newTrain.destination);
      console.log(newTrain.start);
      console.log(newTrain.frequency);

      alert("Train successfully added");

      // Clears all of the text-boxes
      $("train-name-input").val("");
      $("destination-input").val("");
      $("frequency-input").val("");
  })

  // Create firebase event for adding trains to the database and a row in the html when the user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());

      // Store everything into a variable
      var trainName = childSnapshot.val().name;
      var trainDestination = childSnapshot.val().destination;
      var trainStart = childSnapshot.val().start;
      var trainFreq = childSnapshot.val().frequency;

      // Train info
      console.log(trainName);
      console.log(trainDestination);
      console.log(trainStart);
      console.log(trainFreq);

      // Calculating times
      // Time that the first train starts
      var firstTrainConverted = moment(trainStart, "HH:mm");
      console.log("First train: " + firstTrainConverted);

      // Current time
      var currentTime = moment();
      console.log("Current time: " + currentTime);

      // Difference between current time and first train
      var trainTimeDiff = moment().diff(moment(firstTrainConverted), "minutes");
      console.log("Difference time: " + trainTimeDiff);

      // Remainder of time left over
      var remainder = trainTimeDiff % trainFreq;
      console.log("Remainder: " + remainder);

      // Minutes until next train
      var timeRemaining = trainFreq - remainder;
      console.log("Minutes until next train: " + timeRemaining);

      // When the next train will arrive
      var nextTrain = moment().add(timeRemaining, "minutes").format("hh:mm A");
      console.log("Next train will arrive: " + nextTrain);

      // Create a new row in data table
      var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainStart),
        $("<td>").text(trainFreq),
        $("<td>").text(nextTrain),
        $("<td>").text(timeRemaining),
        $("<button value='remove-entry' class='remove-entry btn btn-danger btn-sm'>" + "remove" + "</td>")
      );

      // Add new row to the display table
      $("#train-table > tbody").append(newRow);

      // When remove button is clicked
      $("tbody").on("click", ".remove-entry", function () {
        $(this).closest('tr').remove();
        console.log("row removed");
        getKey = $(this).parent().attr('id');
        console.log("this is the key: " + getKey);
        database.ref().child(getKey).remove();
      });
  });