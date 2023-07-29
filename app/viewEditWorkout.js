import * as document from "document";
import * as utils from "../common/utils";
import * as exerciseStats from "./componentViewExerciseStats";

export function setView(workoutData, goBack = false) {
  let done = document.getElementById("edit-done");
  
  if(!goBack) {
    done.addEventListener("click", utils.historyToRoot);
  }
  else {
    done.addEventListener("click", () => document.history.back());
  }
  exerciseStats.setViewExerciseStats("edit-exercise-stats", prepWorkoutData(workoutData));
}

function prepWorkoutData(workoutDataRaw) {
  let workoutData = [];
  let data = {workoutData};
  for(let exercise of workoutDataRaw.exercises) {
    //console.log(`Test Ex:${data.length}`)
    workoutData.push({exercise, type:"exercise"});
    if(exercise.laps.length > 1) {
      for(let i = 0; i < exercise.laps.length; i++) {
        //console.log(`Test Lap:${i}`)
        workoutData.push({
          summary:exercise.summary,
          lap:exercise.laps[i],        
          "lapIndex":i+1,
          type:"lap"});
      }
    }
  }
  data.numElements = workoutData.length;
  console.log(`   Prepped: ${data.numElements}`)
  console.log(JSON.stringify(data))
  return data;
}
