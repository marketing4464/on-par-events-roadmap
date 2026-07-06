const storageKey = "on-par-events-roadmap-draft";
const typeOptions = ["trivia", "bingo", "confirmed", "paid", "marketing", "deadline"];
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const activeFilters = new Set(["trivia", "bingo", "confirmed", "paid", "marketing"]);

let roadmap;

const elements = {
  dateRange: document.querySelector("#dateRange"),
  summary: document.querySelector("#summary"),
  calendar: document.querySelector("#calendar"),
  revenueBeats: document.querySelector("#revenueBeats"),
  operatingNotes: document.querySelector("#operatingNotes"),
  sources: document.querySelector("#sources"),
  printButton: document.querySelector("#printButton"),
  editButton: document.querySelector("#editButton"),
  dialog: document.querySelector("#editorDialog"),
  editorRows: document.querySelector("#editorRows"),
  addEventButton: document.querySelector("#addEventButton"),
  saveDraftButton: document.querySelector("#saveDraftButton"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  resetDraftButton: document.querySelector("#resetDraftButton")
};

async function loadRoadmap() {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    return JSON.parse(saved);
  }

  const response = await fetch("src/data/events.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load event data.");
  }
  return response.json();
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderSummary() {
  elements.summary.innerHTML = "";
  roadmap.summary.forEach((item) => {
    const metric = document.createElement("article");
    metric.className = "metric";
    metric.innerHTML = `<strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span>`;
    elements.summary.appendChild(metric);
  });
}

function renderMonth(monthData) {
  const { year, month, label, note } = monthData;
  const monthIndex = month - 1;
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const startOffset = first.getDay();
  const totalCells = Math.ceil((startOffset + last.getDate()) / 7) * 7;
  const section = document.createElement("section");
  section.className = "month";

  const title = document.createElement("div");
  title.className = "month-title";
  title.innerHTML = `<strong>${escapeHtml(label)}</strong><span>${escapeHtml(note)}</span>`;
  section.appendChild(title);

  const weekdays = document.createElement("div");
  weekdays.className = "weekdays";
  weekdayLabels.forEach((day) => {
    const div = document.createElement("div");
    div.className = "weekday";
    div.textContent = day;
    weekdays.appendChild(div);
  });
  section.appendChild(weekdays);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  for (let index = 0; index < totalCells; index += 1) {
    const date = new Date(year, monthIndex, index - startOffset + 1);
    const inMonth = date.getMonth() === monthIndex;
    const cell = document.createElement("div");
    cell.className = inMonth ? "day" : "day outside";

    const dateLabel = document.createElement("div");
    dateLabel.className = "date";
    dateLabel.textContent = inMonth ? date.getDate() : "";
    cell.appendChild(dateLabel);

    if (inMonth) {
      const dayEvents = roadmap.events
        .filter((event) => event.date === isoDate(date) && activeFilters.has(event.type))
        .sort((a, b) => a.title.localeCompare(b.title));

      dayEvents.forEach((event) => {
        const item = document.createElement("span");
        item.className = `event ${event.type}`;
        item.innerHTML = `${escapeHtml(event.title)}<small>${escapeHtml(event.status)} | ${escapeHtml(event.detail)}</small>`;
        cell.appendChild(item);
      });
    }

    grid.appendChild(cell);
  }

  section.appendChild(grid);
  return section;
}

function renderCalendar() {
  elements.calendar.innerHTML = "";
  roadmap.months.forEach((month) => elements.calendar.appendChild(renderMonth(month)));
}

function renderSidebar() {
  elements.revenueBeats.innerHTML = "";
  roadmap.revenueBeats.forEach((beat) => {
    const div = document.createElement("div");
    div.className = "focus-row";
    div.innerHTML = `<h3>${escapeHtml(beat.month)}</h3><p><strong>${escapeHtml(beat.title)}</strong>: ${escapeHtml(beat.copy)}</p>`;
    elements.revenueBeats.appendChild(div);
  });

  elements.operatingNotes.innerHTML = "";
  roadmap.operatingNotes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    elements.operatingNotes.appendChild(li);
  });

  elements.sources.innerHTML = "";
  roadmap.sources.forEach((source, index) => {
    const separator = index === roadmap.sources.length - 1 ? "" : " | ";
    const link = document.createElement(source.url ? "a" : "span");
    link.textContent = source.label;
    if (source.url) {
      link.href = source.url;
    }
    elements.sources.appendChild(link);
    elements.sources.append(separator);
  });
}

function render() {
  elements.dateRange.textContent = roadmap.dateRange;
  renderSummary();
  renderCalendar();
  renderSidebar();
}

function renderEditor() {
  elements.editorRows.innerHTML = "";
  roadmap.events
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((event, index) => {
      const row = document.createElement("tr");
      row.dataset.index = String(roadmap.events.indexOf(event));
      row.innerHTML = `
        <td><input type="date" data-field="date" value="${escapeAttribute(event.date)}"></td>
        <td><input type="text" data-field="title" value="${escapeAttribute(event.title)}"></td>
        <td>
          <select data-field="type">
            ${typeOptions.map((type) => `<option value="${type}" ${type === event.type ? "selected" : ""}>${type}</option>`).join("")}
          </select>
        </td>
        <td><input type="text" data-field="status" value="${escapeAttribute(event.status)}"></td>
        <td><textarea data-field="detail">${escapeHtml(event.detail)}</textarea></td>
        <td><button type="button" class="delete-button" data-delete="${index}">Delete</button></td>
      `;
      elements.editorRows.appendChild(row);
    });
}

function syncEditorData() {
  elements.editorRows.querySelectorAll("tr").forEach((row) => {
    const event = roadmap.events[Number(row.dataset.index)];
    if (!event) return;
    row.querySelectorAll("[data-field]").forEach((input) => {
      event[input.dataset.field] = input.value;
    });
  });
}

function saveDraft() {
  syncEditorData();
  localStorage.setItem(storageKey, JSON.stringify(roadmap, null, 2));
  render();
  renderEditor();
}

function addEvent() {
  syncEditorData();
  roadmap.events.push({
    date: new Date().toISOString().slice(0, 10),
    title: "New Event",
    type: "marketing",
    status: "Proposed",
    detail: ""
  });
  renderEditor();
}

function exportJson() {
  syncEditorData();
  const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "events.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    roadmap = JSON.parse(String(reader.result));
    localStorage.setItem(storageKey, JSON.stringify(roadmap, null, 2));
    render();
    renderEditor();
  });
  reader.readAsText(file);
}

function resetDraft() {
  localStorage.removeItem(storageKey);
  location.reload();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

document.querySelectorAll("[data-filter]").forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) {
      activeFilters.add(input.dataset.filter);
    } else {
      activeFilters.delete(input.dataset.filter);
    }
    renderCalendar();
  });
});

elements.printButton.addEventListener("click", () => window.print());
elements.editButton.addEventListener("click", () => {
  renderEditor();
  elements.dialog.showModal();
});
elements.addEventButton.addEventListener("click", addEvent);
elements.saveDraftButton.addEventListener("click", saveDraft);
elements.exportButton.addEventListener("click", exportJson);
elements.resetDraftButton.addEventListener("click", resetDraft);
elements.importInput.addEventListener("change", () => {
  const [file] = elements.importInput.files;
  if (file) {
    importJson(file);
  }
});
elements.editorRows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  const row = button.closest("tr");
  const index = Number(row.dataset.index);
  roadmap.events.splice(index, 1);
  renderEditor();
});

try {
  roadmap = await loadRoadmap();
  render();
} catch (error) {
  elements.dateRange.textContent = error.message;
}
