const container = document.getElementById("highlights-container");
const clearAllBtn = document.getElementById("clear-all");
const summarizeAllBtn = document.createElement("button");
summarizeAllBtn.innerText = "Summarize All";
summarizeAllBtn.style.width = "100%";
summarizeAllBtn.style.marginTop = "10px";
summarizeAllBtn.onclick = summarizeAllHighlights;

container.parentElement.appendChild(summarizeAllBtn);

function loadHighlights() {
  chrome.storage.local.get({ highlights: [] }, (result) => {
    container.innerHTML = "";
    const highlights = result.highlights;

    highlights.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "highlight-item";

      const textDiv = document.createElement("div");
      textDiv.innerText = item.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerText = "Delete";
      deleteBtn.onclick = () => deleteHighlight(index);

      div.appendChild(textDiv);
      div.appendChild(deleteBtn);

      container.appendChild(div);
    });
  });
}

function deleteHighlight(index) {
  chrome.storage.local.get({ highlights: [] }, (result) => {
    const highlights = result.highlights;
    highlights.splice(index, 1);
    chrome.storage.local.set({ highlights }, loadHighlights);
  });
}

clearAllBtn.addEventListener("click", () => {
  chrome.storage.local.set({ highlights: [] }, loadHighlights);
});

loadHighlights();

async function summarizeAllHighlights() {
  chrome.storage.local.get({ highlights: [] }, async (result) => {
    const allText = result.highlights.map((item) => item.text).join("\n");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sss",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `Summarize the text: ${allText}`,
      }),
    });

    const data = await response.json();
    alert(data.output[0].content[0].text);
  });
}
