/*
 * Entry point for the companion app
 */
import * as fileManagement from "./fileManagement";

//console.log("Companion code started");

var userID = "63de7df3aa86075000034261";

fileManagement.setInbox(userID);
fileManagement.receiveMessages();
/*
fileManagement.getWorkoutFromAPI(userID).then(workoutJson => {
  var sendId = setTimeout(fileManagement.sendWorkoutToDevice(workoutJson), 20000);
});*/
