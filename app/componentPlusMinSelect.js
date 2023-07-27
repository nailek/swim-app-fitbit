import * as document from "document";

//TODO: Improve performance save components searched?
//TODO: Allow text to modify checkbox

export function setListeners(componentId, minFunc, plusFunc) {
  let component = document.getElementById(componentId);
  component.getElementById("pm-minus").addEventListener("click", minFunc);
  component.getElementById("pm-plus").addEventListener("click", plusFunc);
}

export function setTexts(componentId, title, text) {
  let component = document.getElementById(componentId);
  if (title != undefined) {
    auxSetTitle(component, title);
  }
  if (text != undefined) {
    auxSetText(component, text);
  }
}

export function setTitle(componentId, text) {
  let component = document.getElementById(componentId);
  if (title != undefined) {
    auxSetTitle(component, title);
  }
}

export function setText(componentId, text) {
  let component = document.getElementById(componentId);
  if (text != undefined) {
    auxSetText(component, text);
  }
}

function auxSetTitle(component, title) {
    component.getElementById("pm-title").text = title;
}

function auxSetText(component, text) {
    component.getElementById("pm-text").text = text;
}