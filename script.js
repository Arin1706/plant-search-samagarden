const SHEET_API = "https://script.google.com/macros/s/AKfycbx1u-OS9-MZYabqxLMAsB14iI27soBw8C13imJC0XDRkEIkSSj9MsP4IQlHnsDsquqGOA/exec";

let plantList = [];

async function fetchPlantList() {
  const res = await fetch(SHEET_API + "?page=data");
  plantList = await res.json();
}

function showSuggestions() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";

  if (!input) return;

  const match = plantList.filter(p =>
    p.name.toLowerCase().includes(input) || p.sci.toLowerCase().includes(input)
  );

  match.slice(0, 8).forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} (${p.sci})`;
    li.onclick = () => {
      document.getElementById("searchInput").value = p.name;
      suggestions.innerHTML = "";
    };
    suggestions.appendChild(li);
  });
}

function submitSearch() {
  const keyword = document.getElementById("searchInput").value.trim();
  if (keyword) {
    window.location.href = `PlantInfoDisplay.html?keyword=${encodeURIComponent(keyword)}`;
  }
}

// Display Plant Info
if (location.pathname.includes("PlantInfoDisplay.html")) {
  const keyword = new URLSearchParams(location.search).get("keyword");
  fetch(SHEET_API + "?page=data")
    .then(res => res.json())
    .then(data => {
      const plant = data.find(p => p.name === keyword || p.sci === keyword);
      if (!plant) return;

      document.getElementById("plantDetail").innerHTML = `
        <img src="${plant.img}" width="200"><br>
        <strong>Species ID:</strong> ${plant.id}<br>
        <strong>Name:</strong> ${plant.name}<br>
        <strong>Sub Category:</strong> ${plant.sub}<br>
        <strong>Genus:</strong> ${plant.genus}<br>
        <strong>Scientific name:</strong> ${plant.sci}<br>
        <strong>Plant Morphology:</strong> ${plant.morph}<br>
        <strong>Barcode:</strong> <span id="barcode">${plant.bar}</span><br>
      `;
    });
}

function submitReport(e) {
  e.preventDefault();
  const form = document.getElementById("reportForm");
  const qty = parseInt(form.quantity.value);
  const barcode = document.getElementById("barcode").textContent;

  for (let i = 1; i <= qty; i++) {
    const payload = {
      name: document.querySelector("strong:nth-child(4)").nextSibling.textContent.trim(),
      sci: document.querySelector("strong:nth-child(10)").nextSibling.textContent.trim(),
      barcode: barcode,
      plantid: `${barcode}-${String(i).padStart(4, "0")}`,
      zone: form.zone.value,
      quantity: qty,
      symptom: form.symptom.value,
      treatment: form.treatment.value,
      status: form.status.value,
      caretaker: form.caretaker.value,
      reporter: form.reporter.value
    };

    fetch(SHEET_API + "?page=report", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  document.getElementById("submitStatus").innerText = "✅ รายงานสำเร็จแล้ว";
  form.reset();
}

window.onload = fetchPlantList;
