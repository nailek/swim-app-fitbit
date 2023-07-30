import * as document from "document";
import * as fs from "./fileManagement";
import * as viewManager from "./viewManager"
import * as statusManagement from "./statusManagement";
import { me } from "appbit";
import * as componentTextLeftRight from "./componentTextLeftRight";

const exitConfirmation = "main-confirmation-exit";

export function setView() {
  //TODO: Move to own js
  let mainFree = document.getElementById("main-free");
  let mainPlanned = document.getElementById("main-planned");
  let mainSeeWorkouts = document.getElementById("main-see-workouts");
  let mainSync = document.getElementById("main-sync");
  let mainDeleteLogs = document.getElementById("main-delete-logs");
  let mainDeleteAll = document.getElementById("main-delete-all");

  mainFree.addEventListener("click", (evt) => {
    viewManager.toFreeWorkout();
  });

  mainPlanned.addEventListener("click", (evt) => {
    viewManager.toPlannedWorkout();
  });
  
  mainSeeWorkouts.addEventListener("click", (evt) => {
    viewManager.toViewWorkouts();
  });

  mainSync.addEventListener("click", (evt) => {
    statusManagement.setUp("main-status");
    statusManagement.setStandByText("Waiting");
    fs.sendWorkoutLogs();
    //TODO One after other
    setTimeout(fs.requestWorkoutFileCompanion(), 3000);
  });

  setExitButtons();
  
  mainDeleteLogs.addEventListener("click", (evt) => {
    fs.cleanUpWorkoutFiles();
  });
  
  mainDeleteAll.addEventListener("click", (evt) => {
    fs.cleanUpAllFiles();
  });
}

function setExitButtons() {
  let mainExit = document.getElementById("main-exit");
  mainExit.addEventListener("click", (evt) => {
    componentTextLeftRight.show(exitConfirmation);
  });
  
  const functionYes = function() {
    console.log("Get the F out");
    me.exit();
  }
  
  const functionNo = function() {
    componentTextLeftRight.hide(exitConfirmation);
  }
  
  componentTextLeftRight.setUp(exitConfirmation, "Exit app?", "Yes", "No",
                    functionYes, functionNo)
  componentTextLeftRight.setLeftClass(exitConfirmation,"alarm-fill");
  componentTextLeftRight.setRightClass(exitConfirmation,"application-fill");
}