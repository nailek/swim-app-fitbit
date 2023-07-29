import { display } from "display";
import * as document from "document";
import { preferences } from "user-settings";
import { battery } from "power";
import * as clockManager from "./clockManager";

// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
export function printTime(runningTime) {
  let mins = zeroPad(Math.floor(runningTime/60));
  let secs = zeroPad(Math.floor(runningTime%60));
  return `${mins}:${secs}`;
}

export function getAvg(time, lapDistance) {
  //TODO: Adapt to prefered distance
  let defaultDistanceAvg = time*100/lapDistance;
  return printTime(defaultDistanceAvg);
}

export function formatDate(date) {
  let stringData = "dd/MM/yyyy hh:mm:ss";
  console.log(`formatDate ${date}`)
  stringData = stringData
                .replace("dd", date.getDate())
                .replace('MM', date.getMonth()+1)
                .replace('yyyy', date.getFullYear())
                .replace('hh', date.getHours())
                .replace('mm', date.getMinutes())
                .replace('ss', date.getSeconds());
  return stringData;
}

export function keepOnRough() {
  display.addEventListener("change", () => {
     if (display.on) {
     } else {
       display.poke();
     }
  });
}

export function setEquipmentHideShow(equipData, equipID, finsID, paddlesID, pullBuoyID, kickboardID, snorkelID) {
  let hasEquipment = false;
  const workoutEquipment = getElement(equipID);

  let fins = workoutEquipment.getElementById(finsID);
  let paddles = workoutEquipment.getElementById(paddlesID);
  let pullbuoy = workoutEquipment.getElementById(pullBuoyID);
  let kickboard = workoutEquipment.getElementById(kickboardID);
  let snorkel = workoutEquipment.getElementById(snorkelID);
  fins.style.display = "none";
  paddles.style.display = "none";
  pullbuoy.style.display = "none";
  kickboard.style.display = "none";
  snorkel.style.display = "none";
  if (equipData.fins) {
    fins.style.display = "inherit";
    hasEquipment = true;
  }
  if (equipData.paddles) {
    paddles.style.display = "inherit";
    hasEquipment = true;
  }
  if (equipData.pullbuoy) {
    pullbuoy.style.display = "inherit";
    hasEquipment = true;
  }
  if (equipData.kickboard) {
    kickboard.style.display = "inherit";
    hasEquipment = true;
  }
  if (equipData.snorkel) {
    snorkel.style.display = "inherit";
    hasEquipment = true;
  }
  if (hasEquipment) {
    workoutEquipment.style.display = "inherit";
  }
  else {
    workoutEquipment.style.display = "none";
  }
}

export function getElement(element) {
  if(typeof element === 'string') {
    return document.getElementById(element);
  } 
  else {
    return element;
  }
}

export function keepHeaderUpdated() {
  clockManager.toGranularitySeconds();
  clockManager.startClock(updateHeaderFunc);

  //setTimeout(clockManager.toGranularityMinutes, 1500);
}

export const updateHeaderFunc = (evt) => {
  updateTime(evt);
  updateBatteryHeader();
}

export function updateTime(evt) {
  let timeElements = document.getElementsByClassName("time-text");
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = zeroPad(hours);
  }
  let mins = zeroPad(today.getMinutes());
  for (let element of timeElements) {
    element.text = `${hours}:${mins}`;
  }
}

export function updateBatteryHeader() {
  let batteryText = Math.floor(battery.chargeLevel) + "%";
  var batteryElements = document.getElementsByClassName("battery-text");
  for(var element of batteryElements) {
    element.text = `${batteryText}`;
  }
}

export function historyToRoot() {
  document.history.go(-document.history.length+1);
}

/*Retribution:
https://www.flaticon.com/free-icon/fins_8979834
<a href="https://www.flaticon.com/free-icons/fins" title="fins icons">Fins icons created by Freepik - Flaticon</a>
https://www.flaticon.com/free-icon/snorkling_2972107
<a href="https://www.flaticon.com/free-icons/diving" title="diving icons">Diving icons created by Freepik - Flaticon</a>
https://www.flaticon.com/free-icon/hand-print_1706297
<a href="https://www.flaticon.com/free-icons/hand-print" title="hand print icons">Hand print icons created by Freepik - Flaticon</a>
https://www.flaticon.com/free-icon/pool-kickboard_2281766
<a href="https://www.flaticon.com/free-icons/pool-kickboard" title="pool kickboard icons">Pool kickboard icons created by Freepik - Flaticon</a>
https://www.flaticon.com/free-icon/summer_82156#
<a href="https://www.flaticon.com/free-icons/swimming-pool" title="swimming pool icons">Swimming pool icons created by Freepik - Flaticon</a>


https://www.flaticon.com/free-icon/swimming_3145016 Back
https://www.flaticon.com/free-icon/swimming_3144985 Buttefly
https://www.flaticon.com/free-icon/swim_495803
https://www.flaticon.com/free-icon/swimming_3144982 Front
https://www.flaticon.com/free-icon/swimming_7246731

App icon
https://www.flaticon.com/free-icon/humanpictos_1721158?term=swim&related_id=1721158
<a href="https://www.flaticon.com/free-icons/swim" title="swim icons">Swim icons created by Freepik - Flaticon</a>
*/