import * as document from "document";

export function setUp(componentId) {
  let component = getElement(componentId);
  setListeners(component);
}

//TODO: Add allow settings order strokes?
function setListeners(component) {
  let strokeCheckboxListener = (evt) => {
    clearOtherStrokeCheckbox(component);
  }
  
  let elements = component.getElementsByClassName("checkbox");
  for (let element of elements) {
    if (element.class.indexOf("non-stroke") == -1) {
      element.addEventListener("click", strokeCheckboxListener);
    }
  }
}

function clearOtherStrokeCheckbox(component) {
    let elements = component.getElementsByClassName("checkbox");
    for (let element of elements) {
      if (element.class.indexOf("non-stroke") == -1) {
        element.value = 0;
      }
    }
}

export function getSelectedStroke(component) {
  component = getElement(component);
  let selectedStroke = "";
  let isDrill = false;
  let elements = component.getElementsByClassName("checkbox");
  for (let element of elements) {
    if (element.value == 1) {
      if (element.id == "s-drill") {
        isDrill = true;
      } else {
        let elementsText = component.getElementById(element.id+"-text");
        selectedStroke = elementsText.text;
      }
    }
  }
  if (isDrill) {
    selectedStroke += " Drill";
  }
  return selectedStroke;
}

function getElement(element) {
  if(typeof element === 'string') {
    return document.getElementById(element);
  } 
  else {
    return element;
  }
}
