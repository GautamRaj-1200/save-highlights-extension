let popupDiv;

document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection().toString().trim();
  if (selection.length > 0) {
    showSavePopup(event.pageX, event.pageY, selection);
  }
});

function showSavePopup(x, y, text) {
  removePopup();

  popupDiv = document.createElement("div");
  popupDiv.innerText = "Save Highlight?";
  popupDiv.className = "highlight-popup";
  popupDiv.style.top = `${y}px`;
  popupDiv.style.left = `${x}px`;
  popupDiv.onclick = () => saveHighlight(text);

  document.body.appendChild(popupDiv);

  // Remove popup after 5 seconds if user doesn't click
  setTimeout(removePopup, 5000);
}

function removePopup() {
  if (popupDiv) {
    popupDiv.remove();
    popupDiv = null;
  }
}

function saveHighlight(text) {
  chrome.storage.local.get({ highlights: [] }, (result) => {
    const highlights = result.highlights;
    highlights.push({ text, time: Date.now() });
    chrome.storage.local.set({ highlights });
  });
  removePopup();
}
