// noinspection JSVoidFunctionReturnValueUsed

import * as document from "document";
import * as fileManager from "./fileManagement";
import * as utils from "../common/utils";
import * as clockManager from "../common/clockManager";
import * as statusManagement from "./statusManagement";
import * as viewMain from "./viewMain"
import * as viewFreeWorkout from "./viewFreeWorkout"
import * as viewWorkoutClock from "./viewWorkoutClock";
import * as viewPlannedWorkout from "./viewPlannedWorkout"
import * as viewEditWorkout from "./viewEditWorkout"
import * as viewViewWorkouts from "./viewChooseWorkout"
import * as dataManagement from "./dataManagement";

let main = document.getElementById("main-screen");

let isAppInitiated = false;
//Force set up?

function allNone() {
  if(!isAppInitiated) {
    setListeners();
    isAppInitiated = true;
  }
  main.style.display="none";
}

const backButtonBehaviourPrevent = (evt) => {
  console.log("Key pressed: " + evt.key + " Behaviour Prevent");  
  if (evt.key === "back") {
    evt.preventDefault();
  }
}
const backButtonBehaviourBack = (evt) => {
  console.log("Key pressed: " + evt.key + " Behaviour Back");  
  if (evt.key === "back") {
    evt.preventDefault();
    try {
      utils.viewBack();
    }
    catch (error) {
      console.error(` Error: ${error}. Are you already in home page?`);
      //Probably in home page
    }
  }
}
const backButtonBehaviourRoot = (evt) => {
  console.log("Key pressed: " + evt.key + " Behaviour Root");  
  if (evt.key === "back") {
    evt.preventDefault();
    utils.historyToRoot();
  }
}

export function backButtonBehaviour(behaviour = "prevent") {
  //document.removeEventListener("keypress", backButtonBehaviourRoot);
  //document.removeEventListener("keypress", backButtonBehaviourPrevent);
  //document.removeEventListener("keypress", backButtonBehaviourBack);
  if(document.history.length > 2) {
    if(behaviour == "back") {
      document.addEventListener("keypress", backButtonBehaviourBack);
      return;
    }
    if(behaviour == "root") {
      document.addEventListener("keypress", backButtonBehaviourRoot);
      return;
    }
  }
  document.addEventListener("keypress", backButtonBehaviourPrevent);
}

export function swipeBehaviour(backgroundId, behaviour = "prevent") {
  console.log(`BackSwipe: ${backgroundId}`)
  let background = document.getElementById(backgroundId);
  if(document.history.length > 2) {
    if (behaviour == "back") {
      console.log("   - Allow");
      return;
    }
    if (behaviour == "prevent") {
      document.addEventListener("beforeunload",  (evt) => {
        console.log("   - Prevent");
        evt.preventDefault();
  
        // reset the position of the second view
        background.animate("enable");
        // or, reset the X coordinate
      });
      return;
    }
  }
  let backgroundMain = document.getElementById("background");
  document.addEventListener("beforeunload",  (evt) => {
    console.log("   - Show Help");
    evt.preventDefault();
    // reset the position of the second view
    background.animate("enable");
    toggleShowHelp();
    if (backgroundMain !== undefined && backgroundMain !== null) {
      //backgroundMain.x = 0;
    }
    // or, reset the X coordinate
  });
}

//Outdated? No.. multiple views are bullshit
export function toggleShowHelp() {
  let help = document.getElementById("plan-screen");
  if (help === null || help === undefined) {
    toPlannedWorkout()
  }
}

export function setListeners() {
  utils.keepHeaderUpdated();

  backButtonBehaviour();
  swipeBehaviour("background", "help");
  viewMain.setView();
  
  fileManager.setListenerReceiveFile();
  fileManager.setListenerReceiveMessages();
}

export function toMain() {
  allNone();
  main.style.display="inherit";
  clockManager.toGranularitySeconds();
  
  /*TODO: Add know number of files?
  let logNum = fileManager.getListWorkoutFilenames().length;
  let element = document.getElementById("main-log-num");
  element.text = `L: ${logNum}`;
  */
}

export function toFreeWorkout() {
  document.location.assign("free.view").then(() => {
    console.log("Free: "+document.history.length)
    backButtonBehaviour("back");
    //swipeBehaviour("free-background", "back");
    
    viewFreeWorkout.setView();
    utils.keepHeaderUpdated();
    viewFreeWorkout.setViewNextWorkout();
  });
}

export function toFreeWorkoutNextExercise(workoutData) {
  dataManagement.saveUnfinishedWorkout(workoutData);
  document.location.assign("free.view").then(() => {
    console.log("Free Next: "+document.history.length)
    backButtonBehaviour();
   
    viewFreeWorkout.setView();
    utils.keepHeaderUpdated();
    viewFreeWorkout.setViewNextExercise(workoutData);
  });
}

export function toPlannedWorkout() {
  document.location.assign("plan.view").then(() => {
    console.log("Planned: "+document.history.length)
    backButtonBehaviour("back");
    //swipeBehaviour("plan-background");
    clockManager.toGranularitySeconds();

    viewPlannedWorkout.setView();
    viewPlannedWorkout.setPlanView();
  });
}

export function toStartWorkout(workoutData) {
  document.location.assign("workout.view").then(() => {
    console.log("Start: "+document.history.length)
    backButtonBehaviour();
    swipeBehaviour("workout-background");
    clockManager.toGranularitySeconds();
    viewWorkoutClock.startTimer(workoutData);
  });
}

export function toEditWorkout(workout, goBack = false) {
  document.location.assign("edit-workout.view").then(() => {
    console.log("Edit: "+document.history.length)
    if(!goBack) {
      backButtonBehaviour();
      swipeBehaviour("edit-workout-background");
    } 
    else {
      backButtonBehaviour("back");
      //swipeBehaviour("", "back");
    }
    utils.keepHeaderUpdated();
    
    viewEditWorkout.setView(workout, goBack);
  });
}

export function toViewWorkouts() {
  if (viewViewWorkouts.hasWorkouts()) {
    document.location.assign("view-workout.view").then(() => {
      console.log("View: "+document.history.length)
      backButtonBehaviour("root");
      utils.keepHeaderUpdated();
      
      viewViewWorkouts.setView();
    });
  }
  else {
    clockManager.toGranularitySeconds();
    statusManagement.setUp("main-status");
    statusManagement.addStatus(`There are no workouts to see`);
  }
}