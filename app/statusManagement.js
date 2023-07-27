import * as document from "document";
import * as utils from "../common/utils";
import * as clockManager from "./clockManager";

let statusElement;
let statusBuffer = [];
let stoppingTimes;
let timeOfStatus = 3;
let standByText = "";

const animationStatus = (evt) => {
  console.log(`Status ${JSON.stringify(statusBuffer)} - ${stoppingTimes}`);
  if(statusElement == undefined || stoppingTimes <= 0) {
    stopAnimation();
  }
  let number = evt.date.getSeconds()%timeOfStatus;
  if(statusBuffer.length > 0) {
    if(number != 0) {
      return;
    }
    statusElement.text = statusBuffer[statusBuffer.length-1];
    statusBuffer.pop();
  }
  else if(standByText != "" && stoppingTimes > 0) {
    console.log(`stopingTimes ${stoppingTimes}`)
    stoppingTimes--;
    let text = standByText;
    for (let i = 0; i < number; i++) {
      text += ".";
    }
    statusElement.text = text;
  } 
  else {
    stopAnimation();
  }
}

export function setUp(elementID) {
  let element = utils.getElement(elementID);
  if (element == statusElement) {
    if (stoppingTimes == 0) {
      clockManager.startClock(animationStatus);
    }
    stoppingTimes == 15;
    return;
  }
  statusElement = element;
  
  clockManager.startClock(animationStatus);
  stoppingTimes = 15;
}

export function stopAnimation(text = " ") {
  stoppingTimes = 0;
  console.log("Stop Status Set");
  clockManager.stopClock(animationStatus);
  if(statusElement != undefined) {
    console.log(`  hey ${text}`);
    statusElement.text = text;
  }
}

export function setStandByText(text = "") {
  standByText = text;
  stoppingTimes = 15;
}

export function standByTextOff() {
  standByText = "";
}

export function addStatus(text) {
  statusBuffer.unshift(text);
}
