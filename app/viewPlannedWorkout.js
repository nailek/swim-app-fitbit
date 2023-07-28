import * as document from "document";
import {toMain, toStartWorkout} from "./viewManager";
import {getReadWorkoutFile} from "./fileManagement";
import * as exerciseStats from "./componentViewExerciseStats";

let initiated = false;

export function setView() {
  let back = document.getElementById("plan-back");
  
  back.addEventListener("click", (evt) => {
    toMain();
  });
}
export function setTextRaw() {
  let planRaw = document.getElementById("plan-text-prep");
  let workutData = getReadWorkoutFile();
  console.log(`Testing setText Planned ${JSON.stringify(workutData)}`)
  if(workutData != undefined) {
    if(workutData[0] == undefined) {
    planRaw.text = `There was an issue: ${workutData.msg}`;
    }
    planRaw.text = JSON.stringify(workutData[0].rawWorkout);
  }
  else {
    planRaw.text = "No workout synced";
  }
}

export function setPlanView() {
  //let planRaw = document.getElementById("plan-text-prep");
  let workutData = getReadWorkoutFile();
  console.log(`Testing setText Planned`)
  if(workutData != undefined) {
    if(workutData[0] == undefined) {
      //planRaw.text = `There was an issue: ${workutData.msg}`;
      console.log(`There was an issue: ${workutData.msg}`)
      return;
    }
    
    let start = document.getElementById("plan-start");
    start.addEventListener("click", (evt) => {
      
    });
    exerciseStats.setViewExerciseStats("plan-exercise-stats", prepWorkoutData(workutData[0].rawWorkout));
    
  }
  else {
    //planRaw.text = "No workout synced";
    console.log("No workout synced")
  }
}

function prepWorkoutData(workoutData) {
  let data = {workoutData};
  console.log(`Test Ex:${JSON.stringify(workoutData)}`)
  for(let exercise of workoutData) {
    workoutData.type="plan";
  }
  data.numElements = workoutData.length;
  //console.log(`   Prepped: ${JSON.stringify(data)}`)
  return data;
}
