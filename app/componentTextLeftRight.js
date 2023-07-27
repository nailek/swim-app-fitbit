import * as document from "document";

/*
Example full set up

componentTextLeftRight.setUp("component-id", "Finished?", "Yes", "No",
                  functionYes, functionNo)
componentTextLeftRight.setLeftClass("component-id","navigation-fill");
componentTextLeftRight.setRightClass("component-id","application-fill");
*/

export function setUp(componentId, text, textLeft, textRight, funcLeft, funcRight) {
  let component = getElement(componentId);
  let textElement = component.getElementById("text");
  let buttonLeft = component.getElementById("text-left");
  let buttonRight = component.getElementById("text-right");
  
  textElement.text = text;
  
  buttonLeft.addEventListener("click", funcLeft);
  buttonLeft.text = textLeft;

  buttonRight.addEventListener("click", funcRight);
  buttonRight.text = textRight;
}

export function setLeftClass(componentId, newClass) {
  let component = getElement(componentId);
  let buttonLeft = component.getElementById("text-left");
  buttonLeft.class="text-button bottom left "+newClass;
}

export function setRightClass(componentId, newClass) {
  let component = getElement(componentId);
  let buttonRight = component.getElementById("text-right");
  buttonRight.class="text-button bottom right "+newClass;
}

export function hide(componentId) {
  let component = getElement(componentId);
  component.style.display = "none"
}

export function show(componentId) {
  let component = getElement(componentId);
  component.style.display = "inherit"
}

function getElement(element) {
  if(typeof element === 'string') {
    return document.getElementById(element);
  } 
  else {
    return element;
  }
}