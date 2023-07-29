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
import { me } from "appbit";
import * as componentTextLeftRight from "./componentTextLeftRight";

let main = document.getElementById("main-screen");
let planWorkout = document.getElementById("plan-screen");

let isAppInitiated = false;
//Force set up?

function allNone() {
  if(!isAppInitiated) {
    setListeners();
    isAppInitiated = true;
  }
  main.style.display="none";
  planWorkout.style.display="none";
  clockManager.stopClock(viewMain.updateBatteryHeader);
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
      document.history.back();
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
  console.log("PreventBack");
  document.removeEventListener("keypress", backButtonBehaviourRoot);
  document.removeEventListener("keypress", backButtonBehaviourPrevent);
  document.removeEventListener("keypress", backButtonBehaviourBack);
  if(behaviour == "back") {
    document.addEventListener("keypress", backButtonBehaviourBack);
  }
  else if(behaviour == "root") {
    document.addEventListener("keypress", backButtonBehaviourRoot);
  }
  else {
    document.addEventListener("keypress", backButtonBehaviourPrevent);
  }
}

export function swipeBehaviour(backgroundId, behaviour = "prevent") {
  if (behaviour == "back") {
    return;
  }
  document.addEventListener("beforeunload",  (evt) => {
    console.log("PreventBackSwipe");
    evt.preventDefault();
    // reset the position of the second view
    document.getElementById(backgroundId).animate("enable");
    // or, reset the X coordinate
  });
}

export function setListeners() {
  utils.keepHeaderUpdated();
  viewMain.setView();
  
  backButtonBehaviour();
 
  viewPlannedWorkout.setView();
  fileManager.setListenerReceiveFile();
  fileManager.setListenerReceiveMessages();
  viewPlannedWorkout.setPlanView();
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
  document.location.assign("free.view").then(() => {
    console.log("Free Next: "+document.history.length)
    backButtonBehaviour();
   
    viewFreeWorkout.setView();
    utils.keepHeaderUpdated();
    viewFreeWorkout.setViewNextExercise(workoutData);
  });
}

export function toPlannedWorkout() {
  allNone();
  planWorkout.style.display="inherit";
  clockManager.toGranularityOff();
}

export function toStartWorkout(workoutData) {
  document.location.assign("workout.view").then(() => {
    console.log("Start: "+document.history.length)
    backButtonBehaviour();
    console.log(document.history.length)
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