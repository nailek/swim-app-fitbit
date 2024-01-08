import * as document from "document";
import { encode, decodeFirst } from "cbor";
import { inbox, outbox } from "file-transfer";
import * as fs from "fs";
import * as statusManagement from "./statusManagement";
import * as messaging from "messaging";
import * as clockManager from "../common/clockManager";
import * as viewPlannedWorkout from "./viewPlannedWorkout"

let searchFile;
let workoutLogFilename = "workout-log-";
let workoutUnfinishedLogFilename = "workout-log-unfinished-";

export function sendWorkoutLogs() {
  statusManagement.setUp("main-status");
  
  //TODO: Demand to be listened
  //TODO: Companion respond if saved to API -> Device: Delete file
  
  let fileNames = getListWorkoutFilenames();
  if (fileNames.length > 0) {
    const data = {
      title: 'WakeUp' //Useful?
    }

    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(data);
    }
    for(let fileName of fileNames) {
      //console.log(`Sending file: ${JSON.stringify(fileNames)}`)
      sendFile(`${fileNames}`);
    }
    //console.log(`Sent: ${fileNames.length} new workouts. Nothing else found`);
    statusManagement.addStatus(`Sent: ${fileNames.length} workouts`);
  }
  else {
    statusManagement.addStatus(`No new workouts to sync`);
  }
  
}

export function saveTestFile() {
  fs.writeFileSync(`Test.cbor`,{"test":"test"},'cbor');
  fs.writeFileSync(`Test.txt`,{"test":"test"},'cbor');
  fs.writeFileSync(`TestJson.txt`,"Test",'utf-8');
}

export function sendTestFile() {
  sendFile(`Test.cbor`);
}

function sendFile(fileName, data) {
  outbox
    .enqueueFile(`/private/data/${fileName}`)
    .then(ft => {
      console.log(`Transfer of ${ft.name} successfully queued.`);
    })
    .catch(err => {
      console.log(`Failed to schedule file ${fileName} for transfer: ${err}`);
    });
}

export function setListenerReceiveFile() {
  //TODO: Set status if file is not saved to storage
  
  // Event occurs when new file(s) are received  
  inbox.onnewfile = () => {
    clockManager.toGranularitySeconds();
    statusManagement.setUp("main-status");
    //console.log("New file!");
    let fileName;
    let found = false;
    do {
      // If there is a file, move it from staging into the application folder
      fileName = inbox.nextFile();
      if (fileName) {
        //console.log(`Received File: ${fileName}`);
        statusManagement.addStatus(`Received: ${fileName}`);
        statusManagement.standByTextOff();
        found = true;
      }
    } while (fileName);
    if (!found) {
      statusManagement.addStatus(`Error: No file syncronized`);
    }
  };
}

export function setListenerReceiveMessages() {
  messaging.peerSocket.addEventListener("open", (evt) => {
    console.log("Ready to send or receive messages");
  });
}

export function requestWorkoutFileCompanion() {
  //TODO: demand file to be sent  
  const data = {
      title: 'RequestWorkout',
      currentWorkoutID: ""
    }
  
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN && data != undefined) {
    // Send the data to peer as a message
    messaging.peerSocket.send(data);
  }
}

export function getReadWorkoutFile() {
  let fileName = "workout.cbor";
  let data = readFile(fileName, "cbor")
  return data;
}

export function getReadAllWorkoutFiles() {
  //TODO: Use getListWorkoutFilenames
  let data = [];
  const listDir = fs.listDirSync("/private/data");
  //console.log("Listing files...")
  let dirIter;
  while((dirIter = listDir.next()) && !dirIter.done) {
    //console.log(`  F: ${dirIter.value}`);
    //console.log(`Pre`);
    let workout = readFile(dirIter.value, 'cbor')
    //console.log(`Post: ${JSON.stringify(workout)}`);
    if(workout.exercises != undefined && workout.exercises.length > 0) {
      data.push(workout);
    }
  }
  //console.log(`See ${data.length} workouts`);
  return data;
}

function readFile(fileName, type) {
  if (!fs.existsSync(fileName)) {
    return undefined;
  }
  let data = fs.readFileSync(fileName, type);
  //console.log(`Read: ${fileName}`)
  //console.log(`-> ${JSON.stringify(data)}`)
  return data;
}

//Automatic save ongoing workout on app exit.
export function saveNewWorkout(workoutData, isFinished = true) {
  let fileName = workoutLogFilename;
  if (!isFinished) {
    fileName = workoutUnfinishedLogFilename;
  }
  let index = 0;
  let found = true;
  while (found) {
    if (fs.existsSync(`/private/data/${fileName}${index}.cbor`)) {
      index++;    
    }
    else {
      //console.log(`Write Log ${fileName}${index}.cbor`)
      fs.writeFileSync(`${fileName}${index}.cbor`,workoutData,'cbor');
      found = false;
    }
  }
}

export function cleanUpAllFiles() {
  const listDir = fs.listDirSync("/private/data");
  let dirIter;
  while((dirIter = listDir.next()) && !dirIter.done) {
    //console.log(`Deleting: ${dirIter.value}`);
    fs.unlinkSync(dirIter.value);
  }
}

export function cleanUpWorkoutFiles() {
  const listDir = fs.listDirSync("/private/data");
  let dirIter;
  while((dirIter = listDir.next()) && !dirIter.done) {
    if (dirIter.value.slice(0, 11) == "workout-log") {
      //console.log(`Deleting: ${dirIter.value}`);
      fs.unlinkSync(dirIter.value);
    }
  }
}

export function getListWorkoutFilenames() {
  let fileNames = [];
  try {
    const listDir = fs.listDirSync("/private/data");
    //console.log("Listing files...");
    let dirIter;
    while((dirIter = listDir.next()) && !dirIter.done) {
      if(dirIter.value.indexOf(workoutLogFilename) != -1 
         || dirIter.value.indexOf(workoutUnfinishedLogFilename) != -1) {
         fileNames.push(dirIter.value);
      }
    }
    //console.log(`Getting ${fileNames.length} workouts`);
  }
  catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`)
  }
  return fileNames;
}