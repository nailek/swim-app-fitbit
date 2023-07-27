import * as document from "document";
import * as utils from "../common/utils";
import * as fileManagement from "./fileManagement";
import {toMain, toEditWorkout} from "./viewManager";

let NUM_ELEMS;

export function setView() {
  /**
  TODO: #view-popup
  let done = document.getElementById("view-done");
  
  eventListenerDone = (evt) => {
    dataManagement.saveWorkout(workoutData);
    done.removeEventListener("click", eventListenerDone);
    toMain();
  }
  done.addEventListener("click", eventListenerDone);
  */
  let workoutDatas = fileManagement.getReadAllWorkoutFiles()
  if(workoutDatas.length > 0) {
    setViewExerciseStats(prepWorkoutData(workoutDatas));
  }
  else {
    toMain();
  }
}

//TODO: Order by date!
function prepWorkoutData(workoutDatas) {
  let data = [];
  for(let workoutData of workoutDatas) {
    let equipment = {fins: false, paddles: false, pullbuoy: false, kickboard: false, snorkel: false};
    let workout = {distance: 0, runningTime: 0, equipment, workoutData}
    workout.startData = workoutData.exercises[0].startTime;
    //TODO: Add calc rest??
    for(let exercise of workoutData.exercises) {
      //console.log(`  Prep Workout: ${JSON.stringify(workout)}`)
      workout.distance += exercise.summary.distance;
      workout.runningTime += exercise.summary.runningTime;
      let equipment = exercise.summary.equipment;
      workout.equipment.fins ||= equipment.fins;
      workout.equipment.paddles ||= equipment.paddles;
      workout.equipment.pullbuoy ||= equipment.pullbuoy;
      workout.equipment.kickboard ||= equipment.kickboard;
      workout.equipment.snorkel ||= equipment.snorkel;
    }
    data.push(workout);
  }
  //console.log(`   Prepped: ${JSON.stringify(data)}`)
  
  NUM_ELEMS = data.length;
  return data;
}

//TODO add to componentViewExerciseStats??
function setViewExerciseStats(data) {
  let editDisplay = document.getElementById("view-exercise-virtual-list");
  //console.log(`Edit:`);
  //console.log(JSON.stringify(data));
  //console.log(`Num ${NUM_ELEMS}`);
  editDisplay.delegate = {
    getTileInfo: (index) => {
      return {
        type: "workout-data",
        index: index
      };
    },
    configureTile: (tile, info) => {
      if (info.type == "workout-data") {
        //console.log(`Index: ${info.index}`);
        setExerciseStatsElement(tile, data[info.index]);
      }
    }
  };

  // length must be set AFTER delegate
  editDisplay.length = NUM_ELEMS;
}

function setExerciseStatsElement(tile, data) {
  //console.log(`   Exercise ${JSON.stringify(data)}`);
  tile.getElementById("distance").text = `${data.distance}m`; //TODO: Add m/y
  tile.getElementById("date").text = data.startData;
  tile.getElementById("timer").text = `Time:${utils.printTime(data.runningTime)}`;
  let exerciseElement = tile.getElementById("equipment");
  utils.setEquipmentHideShow(data.equipment, exerciseElement, "e-fins", "e-paddles", "e-pull-buoy", "e-kickboard", "e-snorkel");
  let touch = tile.getElementById("touch");
  touch.addEventListener("click", (evt) => {
    toEditWorkout(data.workoutData);
  });
}