/*
 * Entry point for the watch app
 */
import * as document from "document";
import * as utils from "../common/utils";
import {toMain} from "./viewManager";
import * as fileManagement from "./fileManagement";
import * as dataManagement from "./dataManagement";
import { me } from "appbit";
import { display } from "display";

me.appTimeoutEnabled = false;

//setListeners();
toMain();

let isShowHelp = false;
let background = document.getElementById("background");
let help = document.getElementById("plan-screen");

let viewId = 0;
utils.keepOnRough(); //TODO: Improve

document.addEventListener("beforeunload", (evt) => {
  // prevent the actual swipe unload event
  evt.preventDefault();
  toggleShowHelp();
});

//Implement this shit, save data during session...
//https://community.fitbit.com/t5/SDK-Development/issue-with-activation-events/m-p/4921853
document.addEventListener("unload", (evt) => {
  console.log("Saving unfinished..");
  dataManagement.saveUnfinishedExercises();
});


//Outdated? No.. multiple views are bullshit
function toggleShowHelp() {
  if (help.style.display == "none") {
    help.style.display = "inherit";
    //help.animate("enable");
    background.x = 0;
    isShowHelp = true;
  }
  else {
    help.animate("disable");
    background.x = 0;
    help.style.display = "none";
    //help.x = 0;
    isShowHelp = false;
  }
}

//Works but kills all listeners...
let thisIsStupid = (evt) => {
  console.log("Test Swipe");
  console.log(document.history.length);
  // prevent the actual swipe unload event
  evt.preventDefault();
  if (viewId == 0) {
    document.location.assign("view1.view").then(setSwipe());
    viewId = 1;
  } else {
    background.x = 0;
    setSwipe();
    viewId = 0;
  }
}

function setSwipe() {
  document.addEventListener("beforeunload", thisIsStupid);
}