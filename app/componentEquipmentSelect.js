import * as document from "document";

export function getSelected(component) {
  component = getElement(component);
   
  let equipment = {fins: false, paddles: false, pullbuoy: false, kickboard: false, snorkel: false};
  let elements = component.getElementsByClassName("checkbox");
  for (let element of elements) {
    if (element.value == 1) {
      if (element.id == "e-fins") {
        equipment.fins = true;
      }
      if (element.id == "e-paddles") {
        equipment.paddles = true;
      }
      if (element.id == "e-pull-buoy") {
        equipment.pullbuoy = true;
      }
      if (element.id == "e-kickboard") {
        equipment.kickboard = true;
      }
      if (element.id == "e-snorkel") {
        equipment.snorkel = true;
      }
    }
  }
  
  
  //TODO: Fixxxxxxxxxxxxxx REMOVEEE
  //equipment = {fins: false, paddles: true, pullbuoy: false, kickboard: true, snorkel: true};
  
  return equipment;
}

function getElement(element) {
  if(typeof element === 'string') {
    return document.getElementById(element);
  } 
  else {
    return element;
  }
}
