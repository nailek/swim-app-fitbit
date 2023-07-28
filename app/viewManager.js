import * as document from "document";
import * as fileManager from "./fileManagement";
import * as utils from "../common/utils";
import * as clockManager from "./clockManager";
import * as viewMain from "./viewMain"
import * as viewFreeWorkout from "./viewFreeWorkout"
import * as viewWorkoutClock from "./viewWorkoutClock";
import * as viewPlannedWorkout from "./viewPlannedWorkout"
import * as viewEditWorkout from "./viewEditWorkout"
import * as viewViewWorkouts from "./viewChooseWorkout"
import { me } from "appbit";
import * as componentTextLeftRight from "./componentTextLeftRight";

let main = document.getElementById("main-screen");
let planWorkout = document.getElementById("plan-screen");
let editWorkout = document.getElementById("edit-screen");
let viewWorkouts = document.getElementById("view-screen");

let isAppInitiated = false;
//Force set up?

function allNone() {
  if(!isAppInitiated) {
    setListeners();
    isAppInitiated = true;
  }
  main.style.display="none";
  planWorkout.style.display="none";
  editWorkout.style.display="none";
  viewWorkouts.style.display="none";
  clockManager.stopClock(viewMain.updateMainHeader);
}

const backButtonBehaviour = (evt) => {
  console.log("Key pressed: " + evt.key);  
  if (evt.key === "back") {
    evt.preventDefault();
  }
}



export function preventBackButton() {
  console.log("PreventBack");
  document.addEventListener("keypress", backButtonBehaviour);
}

export function swipeBehaviour(backgroundId, behaviour = "prevent") {
  document.addEventListener("beforeunload",  (evt) => {
    console.log("PreventBackSwipe");
    evt.preventDefault();
    // reset the position of the second view
    document.getElementById(backgroundId).animate("enable");
    // or, reset the X coordinate
  });
}

export function setListeners() {
  clockManager.startClock((evt) => {utils.updateTime(evt)});
  viewMain.setView();
  
  preventBackButton();
 
  viewPlannedWorkout.setView();
  fileManager.setListenerReceiveFile();
  fileManager.setListenerReceiveMessages();
  viewPlannedWorkout.setPlanView();
}

export function toMain() {
  allNone();
  main.style.display="inherit";
  clockManager.toGranularitySeconds();
  clockManager.startClock(viewMain.updateMainHeader);
  
  /*TODO: Add know number of files?
  let logNum = fileManager.getListWorkoutFilenames().length;
  let element = document.getElementById("main-log-num");
  element.text = `L: ${logNum}`;
  */
}

export function toFreeWorkout() {
  document.location.assign("free.view").then(() => {
    preventBackButton();
    //swipeBehaviour("free-background", "back");
    
    viewFreeWorkout.setView();
    clockManager.stopClock(viewMain.updateMainHeader);
    clockManager.toGranularityOff();
    viewFreeWorkout.setViewNextWorkout();
  });
}

export function toFreeWorkoutNextExercise(workoutData) {
  document.location.assign("free.view").then(() => {
    preventBackButton();
   
    viewFreeWorkout.setView();
    clockManager.stopClock(viewMain.updateMainHeader);
    clockManager.toGranularityOff();
    viewFreeWorkout.setViewNextExercise(workoutData);
  });
}

export function toPlannedWorkout() {
  allNone();
  planWorkout.style.display="inherit";
  clockManager.toGranularityOff();
}

export function toStartWorkout(workoutData) {
  console.log(document.history.length)
  document.location.assign("workout.view").then(() => {
    preventBackButton();
    console.log(document.history.length)
    swipeBehaviour("workout-background");
    clockManager.toGranularitySeconds();
    viewWorkoutClock.startTimer(workoutData);
  });
}

export function toEditWorkout(workout) {
  allNone();
  editWorkout.style.display="inherit";
  clockManager.toGranularityOff();
  
  viewEditWorkout.setView(workout);
}

export function toViewWorkouts() {
  allNone();
  viewWorkouts.style.display="inherit";
  clockManager.toGranularityOff();
  
  viewViewWorkouts.setView();
}