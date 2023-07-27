import * as document from "document";
import * as utils from "../common/utils";
import * as fileManagement from "./fileManagement";
import * as dataManagement from "./dataManagement";

const editDistance = document.getElementById("edit-distance");
const editTimer = document.getElementById("edit-timer");
const editAvg = document.getElementById("edit-avg");
const editEquipment = document.getElementById("edit-equipment");


/*TODO: Masive clean up, 
 - Include "workout-data" from viewChooseWorkout
 - Allow to delete name
 - See workout name
 - Allow button items dynamic (end, back, next)
 - Display notes of work plan
*/
export function setViewExerciseStats(displayID, data) {
  let workoutData = data.workoutData;
  
  let editDisplay = document.getElementById(displayID);
  //console.log(`Edit:`);
  //console.log(JSON.stringify(editDisplay));
  //console.log(`Num ${NUM_ELEMS}`);
  editDisplay.delegate = {
    getTileInfo: (index) => {
      return {
        type: "exercise-stats",
        index: index
      };
    },
    configureTile: (tile, info) => {
      //console.log(`Index: ${info.index} -> Is type ${workoutData[info.index].type}`);
      if (info.type == "exercise-stats") {
        if(workoutData[info.index].type == "exercise") {
          setExerciseStatsElementExercise(tile, workoutData[info.index].exercise);
        }
        else if(workoutData[info.index].type == "lap") {
          setExerciseStatsElementLap(tile, workoutData[info.index]);
        }
        else {
          setExerciseStatsElementPlan(tile, workoutData[info.index]);
        }
      }
    }
  };

  // length must be set AFTER delegate
  console.log(`elements: ${data.numElements}`);
  editDisplay.length = data.numElements;
}

function setExerciseStatsElementExercise(tile, exercise) {
  let summary = exercise.summary;
  //console.log(`   Exercise ${JSON.stringify(exercise)}`);
  tile.getElementById("distance").text = `${summary.distance}m`; //TODO: Add m/y
  tile.getElementById("style").text = summary.stroke;
  tile.getElementById("timer").text = `Time:${utils.printTime(summary.runningTime)}`;
  let exerciseElement = tile.getElementById("equipment");
  utils.setEquipmentHideShow(summary.equipment, exerciseElement, "e-fins", "e-paddles", "e-pull-buoy", "e-kickboard", "e-snorkel");
  tile.getElementById("avg").text = `(Avg100)${utils.getAvg(summary.runningTime, summary.distance)}`;
  tile.getElementById("laps").text = `Total(x${exercise.laps.length})`;
  if (summary.numLaps > 1) {
    tile.getElementById("avg-rest").text = `Avg Lap Rest:${utils.printTime(summary.avgLapRest)}`;
  } else {
    tile.getElementById("avg-rest").text = ``;
  }
}

function setExerciseStatsElementLap(tile, data) {
  let summary = data.summary;
  let lapData = data.lap;
  let lapIndex = data.lapIndex;
  //console.log(`  Lap ${lapIndex}`);
  //console.log(`  -${JSON.stringify(data)}`);
  tile.getElementById("distance").text = `${lapData.distance}m`; //TODO: Add m/y
  tile.getElementById("style").text = summary.stroke;
  tile.getElementById("timer").text = `Time:${utils.printTime(lapData.runningTime)}`;
  let exerciseElement = tile.getElementById("equipment");
  utils.setEquipmentHideShow(summary.equipment, exerciseElement, "e-fins", "e-paddles", "e-pull-buoy", "e-kickboard", "e-snorkel");
  tile.getElementById("avg").text = `(Avg100)${utils.getAvg(lapData.runningTime, lapData.distance)}`;
  tile.getElementById("laps").text = `#${lapIndex}`;
  tile.getElementById("avg-rest").text = `Rest: ${utils.printTime(lapData.lapRest)}`;
  tile.getElementById("start-line").style.display = "none";
}

function setExerciseStatsElementPlan(tile, data) {
  //TODO: Allow for notes
  //console.log(`  Data`);
  //console.log(`  -${JSON.stringify(data)}`);
  let distance = data.numLaps > 1 ? `${data.numLaps}x` : "";
  tile.getElementById("distance").text = `${distance}${data.distance}m`; //TODO: Add m/y
  tile.getElementById("style").text = data.stroke;
  if(data.runningTime != "") {
    tile.getElementById("timer").text = `${utils.printTime(data.runningTime)}/100m`;
  }
  let exerciseElement = tile.getElementById("equipment");
  utils.setEquipmentHideShow(data.equipment, exerciseElement, "e-fins", "e-paddles", "e-pull-buoy", "e-kickboard", "e-snorkel");
  tile.getElementById("avg").text = data.strokeDrill;
  //tile.getElementById("laps").text = `#${lapIndex}`;
  if(data.avgLapRest != "") {
    tile.getElementById("avg-rest").text = `Rest: ${utils.printTime(data.avgLapRest)}`; //TODO:Change name?
  }
}
