import * as document from "document";
import * as utils from "../common/utils";
import * as clockManager from "../common/clockManager";

let statusElement;
let statusBuffer = [];
let timeOfStatus = 3;
let runningTimer = timeOfStatus;
let standByText = "";
let standByTimer = 15;

const animationStatus = (evt) => {
  console.log(`Status ${JSON.stringify(statusBuffer)} - ${runningTimer} - Standby: ${standByText}`);
  if (statusElement === undefined) {
    stopAnimation();
    return;
  }
  if (statusBuffer.length === 0) {
    if (isStandByMode()) {
      if (standByTimer > 0) {
        console.log(`runningTimer ${standByTimer}`)
        standByTimer--;
        let text = standByText;
        for (let i = 0; i < standByTimer%3; i++) {
          text += ".";
        }
        statusElement.text = text;
      }
      else {
        standByText = "";
        stopAnimation();
      }
    }
    else {
      stopAnimation();
    }
    return;
  }
  if(runningTimer <= 0){
    statusBuffer.pop();
    runningTimer = timeOfStatus;
    (evt) => animationStatus(evt);
    return;
  }
  statusElement.text = statusBuffer[statusBuffer.length-1];
  runningTimer--;
  standByTimer--;
}

export function setUp(elementID) {
  statusElement = utils.getElement(elementID);
  
  clockManager.startClock(animationStatus);
}

export function stopAnimation(text = " ") {
  runningTimer = timeOfStatus;
  console.log("Stop Status Animation");
  clockManager.stopClock(animationStatus);
  if(statusElement != undefined) {
    statusElement.text = text;
  }
}

export function setStandByText(text = "") {
  console.log(`setStandByText ${text}`)
  standByText = text;
  standByTimer = 15;
}

export function standByTextOff() {
  standByText = "";
}

export function addStatus(text) {
  if(statusBuffer.length == 0) {
    runningTimer = timeOfStatus;
  }
  statusBuffer.unshift(text);
}

function isStandByMode() {
  return standByText !== "";
}

function setStandByTextTime() {
  standByTimer = 15;
}