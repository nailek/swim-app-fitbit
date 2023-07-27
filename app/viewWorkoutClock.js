import * as document from "document";
import * as utils from "../common/utils";
import * as clockManager from "./clockManager";
import {toFreeWorkoutNextExercise} from "./viewManager";
import {display} from "display";
import * as dataManagement from "./dataManagement";
import * as componentTextLeftRight from "./componentTextLeftRight";

let runningTime;
let totalDistanceSet;
let isStopped;

let refWorkoutData;
let refExercise;
let refSummary;
let refLaps;
let startStopCount;

let settingWakeUpTime = 9;

//Running
const workoutDistance = document.getElementById("workout-distance");
const workoutTime = document.getElementById("workout-time"); 
const workoutRunningMenu = document.getElementById("workout-running");

const workoutTimer = document.getElementById("workout-timer");
const workoutAvg = document.getElementById("workout-avg");
const workoutTotalTimer = document.getElementById("workout-timer-total");

//Ended
const workoutEndMenu = document.getElementById("workout-end");

const workoutEndTime = document.getElementById("workout-end-time"); 
const workoutEndNextLap = document.getElementById("workout-end-next-lap");
const workoutEndDistance = document.getElementById("workout-end-distance");
const workoutEndStyle = document.getElementById("workout-end-style");
const workoutEndTimer = document.getElementById("workout-end-timer");
const workoutEndTimerTotal = document.getElementById("workout-end-timer-total");
const workoutEndLapCount = document.getElementById("workout-end-lap-count");
const workoutEndStartStopCount = document.getElementById("workout-end-start-stop-count");
const workoutEndAvg = document.getElementById("workout-end-avg");
const workoutEndRestTime = document.getElementById("workout-end-rest-time");

//TODO: Fix Varied, open water display

// --- Init Screen --- //
export function startTimer(workoutData) {
  refWorkoutData = workoutData;
  //console.log(`Test ${workoutData.exercises.length}`)
  refExercise = workoutData.exercises[workoutData.exercises.length-1];
  refSummary = refExercise.summary;
  refExercise.startTime = utils.formatDate(new Date());
  refExercise.laps = []
  refLaps = refExercise.laps;
  
  prepareNextLap(refSummary.distance);
  if (refSummary.distance != undefined) {
    workoutDistance.text = refSummary.distance;
  }
  updateTimer();
  statusStartTimer();
  
  document.addEventListener("keypress", backButtonBehaviour);
}
// --- Init Screen --- //

// --- Events --- //
const runningTimer = (evt) => {
  refLaps[refLaps.length-1].runningTime++;
  updateTimer(evt);
  if(refLaps[refLaps.length-1].runningTime%settingWakeUpTime==settingWakeUpTime-1) { 
    display.poke();
    
    document.getElementById("background").x = 0;  
  }
}

const runningRestTimer = (evt) => {
  refLaps[refLaps.length-1].lapRest++;
  workoutEndRestTime.text = `Rest: ${utils.printTime(refLaps[refLaps.length-1].lapRest)}`;
  if(refLaps[refLaps.length-1].lapRest%settingWakeUpTime==settingWakeUpTime-1) {
    display.poke();
  }
}

const backButtonBehaviour = (evt) => {
  console.log("Key pressed: " + evt.key);
  if (evt.key === "back") {
    
    if (isStopped === false) {
      statusPauseTimer();
    } 
    else {
      statusStartTimer();
    }
  }
}

workoutEndNextLap.addEventListener("click", () => {
  prepareNextLap(refLaps[refLaps.length-1].distance);
  statusStartTimer();
});

componentTextLeftRight.setUp("workout-end-confirmation-exit", "Finished?", "Yes", "No", 
      () => {statusEndExercise();}, 
      () => {statusStartTimer();})
componentTextLeftRight.setLeftClass("workout-end-confirmation-exit","navigation-fill");
componentTextLeftRight.setRightClass("workout-end-confirmation-exit","application-fill");

// --- Events --- //

// --- Set States ---//
function statusPauseTimer() {
  clockManager.stopClock(runningTimer);
  clockManager.startClock(runningRestTimer);
  isStopped = true;
  workoutEndMenu.style.display="inherit";
  workoutRunningMenu.style.display="none";
  setPausedView();
}

function statusStartTimer() {
  clockManager.startClock(runningTimer);
  clockManager.stopClock(runningRestTimer);
  isStopped = false;
  workoutEndMenu.style.display="none";
  workoutRunningMenu.style.display="inherit";
  refLaps[refLaps.length-1].lapRest = 0;
  startStopCount++;
}

function statusEndExercise() {
  clockManager.stopClock(runningRestTimer);
  isStopped = false;
  workoutEndMenu.style.display="none";
  workoutRunningMenu.style.display="inherit";
  refLaps[refLaps.length-1].lapRest = 0;
  
  dataManagement.fillSummary(refExercise);
  refExercise.endTime = utils.formatDate(new Date());
  toFreeWorkoutNextExercise(refWorkoutData);
  document.removeEventListener("keypress", backButtonBehaviour);
}
// --- Set States ---//

// --- Functions --- //
function prepareNextLap(distance) {
  let lap = {runningTime:0, lapRest:0, distance:distance}
  refLaps.push(lap);
  workoutTotalTimer.text = "";
  updateTimer();
  startStopCount = 0;
}

function updateTimer(evt) {
  workoutTimer.text = utils.printTime(refLaps[refLaps.length-1].runningTime);
  
  if (refLaps[refLaps.length-1].distance != undefined) {
    //TODO: Allow settings for default distance
    workoutAvg.text = "Avg: "+utils.getAvg(refLaps[refLaps.length-1].runningTime, refLaps[refLaps.length-1].distance);
  }
  if (refLaps.length > 1) {
    workoutTotalTimer.text = `Total ${utils.printTime(dataManagement.getTotalTime(refLaps))}`;
  }
}

function setPausedView() {
  workoutEndDistance.text = `Distance: ${refLaps[refLaps.length-1].distance}`; //metric or imperial?
  workoutEndStyle.text = refSummary.stroke;
  workoutEndTimer.text = `Time: ${utils.printTime(refLaps[refLaps.length-1].runningTime)}`  
  if (refLaps.length > 1) {
    workoutEndTimerTotal.text = `Total: ${utils.printTime(dataManagement.getTotalTime(refLaps))}`;
  } else {
    workoutEndTimerTotal.text = "";
  }
  workoutEndLapCount.text = `x${refLaps.length}`;
  workoutEndStartStopCount.text = `?x${startStopCount}`; //TODO: Add to data??
  workoutEndAvg.text = `Avg(100m): ${utils.getAvg(refLaps[refLaps.length-1].runningTime, refLaps[refLaps.length-1].distance)}`;
  utils.setEquipmentHideShow(refSummary.equipment, "workout-end-equipment", "e-fins", "e-paddles", "e-pull-buoy", "e-kickboard", "e-snorkel");
  workoutEndRestTime.text = "Rest: 00:00";
}

// --- Functions --- //