// script.js
let plantData = [];
fetch("https://script.google.com/macros/s/AKfycbx1u-OS9-MZYabqxLMAsB14iI27soBw8C13imJC0XDRkEIkSSj9MsP4IQlHnsDsquqGOA/exec?page=data")
  .then(res => res.json())
  .then(data => plantData = data);

function showSuggestions() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";
  if (!input) return;

  const matched = plantData.filter(p => p.name.toLowerCase().includes(input) || p.sci.toLowerCase().includes(input));
  matched.slice(0, 5).forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.name + " (" + p.sci + ")";
    li.onclick = () => {
      document.getElementById("searchInput").value = p.name;
      suggestions.innerHTML = "";
    };
    suggestions.appendChild(li);
  });
}

function submitSearch() {
  const keyword = document.getElementById("searchInput").value.trim();
  if (!keyword) return alert("กรุณากรอกชื่อพืช");
  window.location.href = `PlantInfoDisplay.html?keyword=${encodeURIComponent(keyword)}`;
}

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

if (location.pathname.includes("PlantInfoDisplay.html")) {
  const keyword = getQueryParam("keyword");
  fetch("https://script.google.com/macros/s/AKfycbx1u-OS9-MZYabqxLMAsB14iI27soBw8C13imJC0XDRkEIkSSj9MsP4IQlHnsDsquqGOA/exec?page=data")
    .then(res => res.json())
    .then(data => {
      const plant = data.find(p => p.name === keyword || p.sci === keyword);
      if (!plant) return;

      document.getElementById("plantInfo").innerHTML = `
        <img src="${plant.img}" width="200"><br>
        <strong>Species ID:</strong> ${plant.id}<br>
        <strong>Name:</strong> ${plant.name}<br>
        <strong>Sub Category:</strong> ${plant.sub}<br>
        <strong>Genus:</strong> ${plant.genus}<br>
        <strong>Scientific name:</strong> ${plant.sci}<br>
        <strong>Plant Morphology:</strong> ${plant.morph}<br>
        <strong>Barcode:</strong> ${plant.bar}<br>
      `;
    });
}

function submitReport(event) {
  event.preventDefault();
  const name = document.getElementById("plantInfo").querySelector("strong:nth-child(4)").textContent.split(": ")[1];
  const sci = document.getElementById("plantInfo").querySelector("strong:nth-child(10)").textContent.split(": ")[1];
  const bar = document.getElementById("plantInfo").querySelector("strong:nth-child(12)").textContent.split(": ")[1];
  const zone = document.getElementById("zone").value;
  const qty = parseInt(document.getElementById("quantity").value);
  const disease = document.getElementById("disease").value;
  const treatment = document.getElementById("treatment").value;
  const status = document.getElementById("status").value;
  const caretaker = document.getElementById("caretaker").value;
  const reporter = document.getElementById("reporter").value;

  for (let i = 1; i <= qty; i++) {
    const payload = {
      name, sci, bar,
      id: `${bar}-${String(i).padStart(4, "0")}`,
      zone, disease, treatment, status, caretaker, reporter
    };
    fetch("https://script.google.com/macros/s/AKfycbx1u-OS9-MZYabqxLMAsB14iI27soBw8C13imJC0XDRkEIkSSj9MsP4IQlHnsDsquqGOA/exec?page=report", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
  alert("รายงานสำเร็จ");
}
