/*
 * Entry point for the watch app
 */
import * as document from "document";
import * as utils from "../common/utils";
import {toMain} from "./viewManager";
import * as dataManagement from "./dataManagement";
import { me } from "appbit";

me.appTimeoutEnabled = false;

toMain();

let isShowHelp = false;
let background = document.getElementById("background");

let viewId = 0;
utils.keepOnRough(); //TODO: Improve

//Implement this shit, save data during session...
//https://community.fitbit.com/t5/SDK-Development/issue-with-activation-events/m-p/4921853
document.addEventListener("unload", (evt) => {
  console.log("Saving unfinished..");
  dataManagement.saveUnfinishedExercises();
});

//Works but kills all listeners...
let thisIsStupid = (evt) => {
  //console.log("Test Swipe");
  //console.log("Stupid: "+document.history.length);
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