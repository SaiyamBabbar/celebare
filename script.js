let textElement = document.getElementById("textElement");
let canvas = document.getElementById("canvas");
let undoStack = [];
let redoStack = [];

saveState();

function saveState() {
  const state = {
    html: canvas.innerHTML,
    style: window.getComputedStyle(textElement).cssText,
  };
  undoStack.push(state);
}

function restoreState(state) {
  canvas.innerHTML = state.html;
  textElement = document.getElementById("textElement");
  textElement.style.cssText = state.style;
}

function makeBold() {
  if (window.getComputedStyle(textElement).fontWeight === "700") {
    textElement.style.fontWeight = "normal";
  } else {
    textElement.style.fontWeight = "bold";
  }
  saveState();
}

function makeUnderline() {
  if (
    window.getComputedStyle(textElement).textDecoration ===
    "underline solid rgb(0, 0, 0)"
  ) {
    textElement.style.textDecoration = "none";
  } else {
    textElement.style.textDecoration = "underline";
  }
  saveState();
}

function changeFont() {
  let font = document.getElementById("fontSelect").value;
  textElement.style.fontFamily = font;
  saveState();
}

function increaseFontSize() {
  let fontSize = parseInt(window.getComputedStyle(textElement).fontSize);
  textElement.style.fontSize = fontSize + 2 + "px";
  saveState();
}

function decreaseFontSize() {
  let fontSize = parseInt(window.getComputedStyle(textElement).fontSize);
  textElement.style.fontSize = fontSize - 2 + "px";
  saveState();
}

let isDragging = false;
let shiftX, shiftY;

textElement.addEventListener("mousedown", (event) => {
  isDragging = true;
  shiftX = event.clientX - textElement.getBoundingClientRect().left;
  shiftY = event.clientY - textElement.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    textElement.style.left = pageX - shiftX + "px";
    textElement.style.top = pageY - shiftY + "px";
  }

  document.addEventListener("mousemove", onMouseMove);

  document.addEventListener("mouseup", onMouseUp);

  function onMouseMove(event) {
    if (isDragging) {
      moveAt(event.pageX, event.pageY);
    }
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    saveState();
  }

  textElement.ondragstart = function () {
    return false;
  };
});

document.getElementById("undo").onclick = function () {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    let lastState = undoStack[undoStack.length - 1];
    restoreState(lastState);
  }
};

document.getElementById("redo").onclick = function () {
  if (redoStack.length > 0) {
    let state = redoStack.pop();
    restoreState(state);
    undoStack.push(state);
  }
};

function addText() {
  let newTextElement = document.createElement("div");
  newTextElement.setAttribute("contenteditable", "true");
  newTextElement.className = "text";
  newTextElement.innerHTML = "New Text";
  newTextElement.style.position = "absolute";
  newTextElement.style.top = "150px";
  newTextElement.style.left = "150px";
  newTextElement.style.fontSize = "14px";
  canvas.appendChild(newTextElement);

  newTextElement.addEventListener("mousedown", (event) => {
    isDragging = true;
    shiftX = event.clientX - newTextElement.getBoundingClientRect().left;
    shiftY = event.clientY - newTextElement.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      newTextElement.style.left = pageX - shiftX + "px";
      newTextElement.style.top = pageY - shiftY + "px";
    }

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(event) {
      if (isDragging) {
        moveAt(event.pageX, event.pageY);
      }
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      saveState();
    }

    newTextElement.ondragstart = function () {
      return false;
    };
  });
}
