import * as cbor from "cbor";
import { inbox, outbox } from "file-transfer";
import { WorkoutAPI } from "./workoutAPI";
import * as messaging from "messaging";

let userID;
    
async function receiveAllFiles() {
  console.log(`Receiving files...`);
  let file;
  while (file = await inbox.pop()) {
    console.log(`Save to API: ${file}`);
    try {
      const payload = await file.cbor();
      setWorkoutLogToAPI(userID, payload)
    } 
    catch (error) {
      console.error(`Error receiving files: ${error}`);
    }
  }
}

export function receiveMessages() {
  messaging.peerSocket.addEventListener("message", (evt) => {
    console.log(`Message received: ${JSON.stringify(evt.data)}`);
    if (evt.data.title == "RequestWorkout") { //TODO: Use global variables....
      getWorkoutFromAPI(userID).then(workoutJson => {
      var sendId = sendWorkoutToDevice(workoutJson)
      });
    }
  });
}

export function setInbox(idUser) {
  userID = idUser;
  inbox.addEventListener("newfile", receiveAllFiles);
}

export function getWorkoutFromAPI(userID) {
  let testAPI = new WorkoutAPI(userID);
  return new Promise((resolve, reject) => {
    testAPI.getWorkout(userID)
      .then(result => {resolve(result)});
  });
}

function setWorkoutLogToAPI(userID, workoutData) {
  let testAPI = new WorkoutAPI(userID);
  return new Promise((resolve, reject) => {
    testAPI.setWorkoutLog(userID, workoutData)
      .then(result => {resolve(result)});
  });
}

export function sendWorkoutToDevice(workoutJson) {
  sendJsonToDevice("workout.cbor", workoutJson);
}

export function sendJsonToDevice(filename, json) {
  console.log(`Sending file ${filename}... `);
  if (json == undefined) {
    throw new Error(`Workout data not found`);
  }
  outbox
    .enqueue(filename, cbor.encode(json))
    .catch((err) => {
      throw new Error(`Failed to queue ${filename}. Error: ${err}`);
    });
}

export function sendFileTest() {
  console.log("Sending test file...");
  let data = new Uint8Array(26);
  for (let counter = 0; counter < data.length; counter++) {
    data[counter] = "a".charCodeAt(0) + counter;
  }
  outbox.enqueue("workout.txt", data);
}