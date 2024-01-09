import * as document from "document";
import {toStartWorkout, toEditWorkout} from "./viewManager";
import * as componentPlusMinSelect from "./componentPlusMinSelect";
import * as componentStrokeSelect from "./componentStrokeSelect";
import * as componentEquipmentSelect from "./componentEquipmentSelect";
import * as dataManagement from "./dataManagement";
import {getUnfinishedWorkoutFile} from "./fileManagement";

let lapSizes = [10,15,25,33,50,"Varied","Open water"]
let lapSizeIndex = 2;
let lapCount = 4;

let workoutData;

//Call only once
export function setView() {
  let back = document.getElementById("free-back");
  let startWorkout = document.getElementById("free-start-workout");

  let unfinishedWorkoutData = getUnfinishedWorkoutFile();
  if (unfinishedWorkoutData !== undefined) {
    startWorkout.text = "Resume";
  }
  else {
    startWorkout.text = "Start";
  }
  
  back.addEventListener("click", (evt) => {
    //console.log("Free before back "+document.history.length)
    document.history.back();
    //console.log("Free after back "+document.history.length)
  });
  
  startWorkout.addEventListener("click", (evt) => {
    goToStartWorkout();
  });
  
  let next = document.getElementById("free-next");
  let end = document.getElementById("free-end");
  
  next.addEventListener("click", (evt) => {
    goToStartWorkout();
  });
  
  end.addEventListener("click", (evt) => {
    if (workoutData.exercises.length > 0) {
      dataManagement.saveWorkout(workoutData);
    }
    toEditWorkout(workoutData);
  });
  
  setLapSizeButtons();
  setLapTotalButtons();
  componentStrokeSelect.setUp("free-stroke-select");
}

function goToStartWorkout() {
  let summary = {
    equipment: componentEquipmentSelect.getSelected("free-equipment-select"),
    stroke: componentStrokeSelect.getSelectedStroke("free-stroke-select"),
    distance: lapSizes[lapSizeIndex]*lapCount
  }

  let unfinishedWorkoutData = getUnfinishedWorkoutFile();
  if (unfinishedWorkoutData !== undefined) {
    console.log(`Unfinished Workout`);
    workoutData = unfinishedWorkoutData;
  }

  workoutData.exercises.push({summary});
  //console.log(`pushed Exercise`, JSON.stringify(workoutData.exercises.length));
  dataManagement.printWorkout(workoutData.dirId);
  toStartWorkout(workoutData);
}

export function setViewNextWorkout() {
  document.getElementById("free-start-menu").style.display = "inherit";
  document.getElementById("free-next-menu").style.display = "none";
  workoutData = dataManagement.getNewExerciseData();
}

export function setViewNextExercise(workoutDataVar) {
  document.getElementById("free-start-menu").style.display = "none";
  document.getElementById("free-next-menu").style.display = "inherit";
  workoutData = workoutDataVar;
}

function setLapSizeButtons() {
  let minFunc = (evt) => {
    if (lapSizeIndex > 0) {
      lapSizeIndex -= 1;
    }
    componentPlusMinSelect.setText("free-lap-size", lapSizes[lapSizeIndex]);
    auxResetLapTotalText();
  }
  let plusFunc = (evt) => {
    if (lapSizeIndex < lapSizes.length-1) {
      lapSizeIndex += 1;
    }
    componentPlusMinSelect.setText("free-lap-size", lapSizes[lapSizeIndex]);
    auxResetLapTotalText();
  }
  
  componentPlusMinSelect.setListeners("free-lap-size", minFunc, plusFunc);
  
  componentPlusMinSelect.setTexts("free-lap-size", "Pool Length", lapSizes[lapSizeIndex]);
  
  auxResetLapTotalText();
}

function setLapTotalButtons() {
  let minFunc = (evt) => {
    if (lapCount > 1) {
      lapCount -= 1;
    }
    auxResetLapTotalText();
  };
  let plusFunc = (evt) => {
    if (lapCount < 1001) {
      lapCount += 1;
    }
    auxResetLapTotalText();
  };
  
  componentPlusMinSelect.setListeners("free-lap-total", minFunc, plusFunc);
  
}

function auxResetLapTotalText(){
  let total;
  if (typeof(lapSizes[lapSizeIndex]) != 'number') {
    total = lapSizes[lapSizeIndex];
  }
  else {
    total = lapSizes[lapSizeIndex]*lapCount;
  }
  componentPlusMinSelect.setTexts("free-lap-total", total, lapCount);
}
