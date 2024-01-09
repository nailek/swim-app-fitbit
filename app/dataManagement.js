import * as document from "document";
import * as fileManagement from "./fileManagement";

let workouts = []; //Free Workout ONLY

export function hasPreviousExercise() {
	return Object.keys(workouts).length > 0;	
}

export function getNewExerciseData() {
  workouts[workouts.length] = {dirId: workouts.length, exercises:[]};
  
  return getLastExerciseData();
}

export function getLastExerciseData() {
  return workouts[workouts.length-1];
}

export function saveWorkout(workoutData) {
  if (isValidWorkout(workoutData)) {
    //console.log(`Save... ${JSON.stringify(workoutData)}`);
    fileManagement.saveNewWorkout(workoutData, true);
  }
  //console.log(`Delete, not valid ${workoutData.dirId}`);
    //TODO: What is this?
  deleteWorkoutData(workoutData.dirId);
}

export function saveUnfinishedWorkout(workoutData) {
    console.log("Save Unfinished Workout:");
    if (isValidWorkout(workoutData)) {
        console.log(`   Save... ${JSON.stringify(workoutData)}`);
        fileManagement.saveNewWorkout(workoutData, false);
    }
    else {
        console.log(`  Not valid workload: ${workoutData.dirId}`);
    }
}

export function saveUnfinishedExercises() {
	for (let workout of workouts) {
    if (workout != undefined & workout.exercises.length > 0) {
      fillSummary(getLastExercise(workout));
      workout.isUnfinished = true;
      getLastExercise(workout).isUnfinished = true;
      saveWorkout(workout, false);
    } else {
      deleteWorkoutData(workout.dirId);
    }
  }
}

export function loadUnfinishedExercises() {
	//TODO: Implement
}

function deleteWorkoutData(workoutID) {
  workouts.splice(workoutID);
}

// --- Utils --- //
function getLastExercise(workout) {
  return workout.exercises[workout.exercises.length-1];
}

function isValidWorkout(workoutData) {
  return workoutData != undefined 
     & workoutData.exercises.length > 0
     & workoutData.exercises[0].startTime != undefined
}

export function getTotalTime(laps) {
    let total = 0;
    for (let lap of laps) {
      total += lap.runningTime;
    }
    return total;
}

export function fillSummary(exercise) {
  let summary = exercise.summary;
  let laps = exercise.laps;
  let lapRest = 0;
  summary.runningTime = 0;
  summary.avgLapRest = 0;
  summary.distance = 0;
  summary.numLaps = laps.length;
  //TODO: Do something with this?
  laps[laps.length-1].lapRest = 0;
  for (let lap of laps) {
    summary.runningTime += lap.runningTime;
    summary.distance += lap.distance;
    lapRest += lap.lapRest;
  }
  summary.avgLapRest = Math.floor(lapRest/summary.numLaps);
}

export function printWorkout(dirId) {
  console.log(`Printing: `, JSON.stringify(workouts[dirId]))
}
