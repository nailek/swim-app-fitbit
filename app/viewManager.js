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
let freeWorkout = document.getElementById("free-screen");
let planWorkout = document.getElementById("plan-screen");
let workoutClock = document.getElementById("workout-screen");
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
  freeWorkout.style.display="none";
  planWorkout.style.display="none";
  workoutClock.style.display="none";
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
  document.addEventListener("keypress", backButtonBehaviour);
}

export function setListeners() {
  clockManager.startClock((evt) => {utils.updateTime(evt)});
  viewMain.setView();
  
  preventBackButton();
 
  viewFreeWorkout.setView();
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
  allNone();
  freeWorkout.style.display="inherit";
  clockManager.toGranularityOff();
  
  viewFreeWorkout.setViewNextWorkout();
}

export function toFreeWorkoutNextExercise(workoutData) {
  allNone();
  freeWorkout.style.display="inherit";
  clockManager.toGranularityOff();
  
  viewFreeWorkout.setViewNextExercise(workoutData);
}

export function toPlannedWorkout() {
  allNone();
  planWorkout.style.display="inherit";
  clockManager.toGranularityOff();
}

export function toStartWorkout(workoutData) {
  allNone();
  workoutClock.style.display="inherit";
  clockManager.toGranularitySeconds();
  
  viewWorkoutClock.startTimer(workoutData);
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