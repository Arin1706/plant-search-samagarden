const API_BASE = "https://script.google.com/macros/s/REPLACE_WITH_YOUR_SCRIPT_ID/exec";

const input = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");
const plantDetail = document.getElementById("plantDetail");
const diseaseForm = document.getElementById("diseaseForm");
const noResult = document.getElementById("noResult");

input.addEventListener("input", async () => {
  const query = input.value.trim();
  if (query.length === 0) return (suggestionsBox.innerHTML = "");

  const res = await fetch(`${API_BASE}?page=suggest&query=${encodeURIComponent(query)}`);
  const suggestions = await res.json();

  suggestionsBox.innerHTML = "";
  suggestions.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.scientific})`;
    li.onclick = () => {
      input.value = item.name;
      suggestionsBox.innerHTML = "";
      fetchPlantData(item.name);
    };
    suggestionsBox.appendChild(li);
  });
});

function submitSearch() {
  const keyword = input.value.trim();
  if (keyword) {
    fetchPlantData(keyword);
  } else {
    alert("กรุณากรอกชื่อต้นไม้ก่อนค้นหา");
  }
}

async function fetchPlantData(keyword) {
  const res = await fetch(`${API_BASE}?page=data&keyword=${encodeURIComponent(keyword)}`);
  const data = await res.json();

  if (!data || !data.name) {
    plantDetail.classList.add("hidden");
    noResult.classList.remove("hidden");
    return;
  }

  noResult.classList.add("hidden");
  plantDetail.classList.remove("hidden");

  document.getElementById("plantImage").src = convertGoogleDriveImage(data.image);
  document.getElementById("speciesId").textContent = data.speciesId;
  document.getElementById("name").textContent = data.name;
  document.getElementById("subcate").textContent = data.subcate;
  document.getElementById("genus").textContent = data.genus;
  document.getElementById("scientific").textContent = data.scientific;
  document.getElementById("morphology").textContent = data.morphology;
  document.getElementById("barcode").textContent = data.barcode;

  diseaseForm.dataset.barcode = data.barcode;
  diseaseForm.dataset.name = data.name;
  diseaseForm.dataset.scientific = data.scientific;
}

function convertGoogleDriveImage(url) {
  const match = url.match(/\\/d\\/([a-zA-Z0-9_-]+)\\//);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

diseaseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const quantity = parseInt(document.getElementById("quantity").value);
  const body = {
    name: diseaseForm.dataset.name,
    scientific: diseaseForm.dataset.scientific,
    barcode: diseaseForm.dataset.barcode,
    zone: document.getElementById("zone").value,
    quantity,
    description: document.getElementById("description").value,
    treatment: document.getElementById("treatment").value,
    status: document.getElementById("status").value,
    caretaker: document.getElementById("caretaker").value,
    reporter: document.getElementById("reporter").value
  };

  const res = await fetch(`${API_BASE}?page=submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const result = await res.text();
  alert(result);
  diseaseForm.reset();
});
