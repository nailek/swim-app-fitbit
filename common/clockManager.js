import * as document from "document";
import clock from "clock";

clock.granularity = "seconds";

let functions = new Map();

export function startClock(tickFunction) {
  functions.set(tickFunction.name, tickFunction);
  clock.addEventListener("tick", tickFunction);
}

export function stopClock(tickFunction) {
  functions.delete(tickFunction.name, tickFunction);
  clock.removeEventListener("tick", tickFunction);
}

export function isRunning(tickFunction) {
  return functions.has(tickFunction.name, tickFunction);
}

export function toGranularitySeconds() {
  clock.granularity = "seconds";
}

export function toGranularityMinutes() {
  clock.granularity = "minutes";
}

export function toGranularityOff() {
  clock.granularity = "off";
}
