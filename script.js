const form = document.getElementById("memory-form");
const timeline = document.getElementById("timeline");
const clearAllBtn = document.getElementById("clear-all");
const searchInput = document.getElementById("search");
const darkToggle = document.getElementById("toggle-dark");
const exportJsonBtn = document.getElementById("export-json");
const exportTxtBtn = document.getElementById("export-txt");

let memories = JSON.parse(localStorage.getItem("memories")) || [];

function displayMemories(filter = "") {
  timeline.innerHTML = "";

  const filtered = memories.filter(m =>
    m.title.toLowerCase().includes(filter.toLowerCase()) ||
    m.date.includes(filter)
  );

  if (filtered.length === 0) {
    timeline.innerHTML = "<p>No memories found.</p>";
    return;
  }

  filtered
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((memory, index) => {
      const div = document.createElement("div");
      div.className = "memory";

      div.innerHTML = `
        <h3>${memory.title}</h3>
        <small>${new Date(memory.date).toDateString()}</small>
        <p>${memory.description}</p>
        <div class="category">📌 ${memory.category}</div>
        ${memory.image ? `<img src="${memory.image}" alt="Memory Image"/>` : ""}
        <button onclick="deleteMemory(${index})">Delete</button>
      `;

      timeline.appendChild(div);
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const reader = new FileReader();
  const file = document.getElementById("image").files[0];

  reader.onload = function () {
    const newMemory = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      date: document.getElementById("date").value,
      category: document.getElementById("category").value,
      image: file ? reader.result : ""
    };

    memories.push(newMemory);
    localStorage.setItem("memories", JSON.stringify(memories));
    displayMemories();
    form.reset();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload(); // Handle case with no image
});

function deleteMemory(index) {
  memories.splice(index, 1);
  localStorage.setItem("memories", JSON.stringify(memories));
  displayMemories();
}

clearAllBtn.addEventListener("click", () => {
  if (confirm("Clear all memories?")) {
    memories = [];
    localStorage.removeItem("memories");
    displayMemories();
  }
});

searchInput.addEventListener("input", () => {
  displayMemories(searchInput.value);
});

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function downloadFile(filename, content) {
  const a = document.createElement("a");
  const blob = new Blob([content], { type: "text/plain" });
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

exportJsonBtn.addEventListener("click", () => {
  const jsonData = JSON.stringify(memories, null, 2);
  downloadFile("memories.json", jsonData);
});

exportTxtBtn.addEventListener("click", () => {
  const text = memories.map(m => `Title: ${m.title}\nDate: ${m.date}\nCategory: ${m.category}\nDescription: ${m.description}\n\n`).join("");
  downloadFile("memories.txt", text);
});

displayMemories();
