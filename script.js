const SHEET_API = "https://script.google.com/macros/s/AKfycbx1u-OS9-MZYabqxLMAsB14iI27soBw8C13imJC0XDRkEIkSSj9MsP4IQlHnsDsquqGOA/exec"; // เปลี่ยนลิงก์ API ของราสเอง

let plantList = [];

async function fetchPlantList() {
  const res = await fetch(SHEET_API + "?page=data");
  plantList = await res.json();
}

// 🔍 Autocomplete
function showSuggestions() {
  const input = document.getElementById("searchInput");
  const suggestionBox = document.getElementById("suggestions");
  const keyword = input.value.toLowerCase();

  suggestionBox.innerHTML = "";
  if (!keyword) return;

  const filtered = plantList.filter(
    plant =>
      plant[1].toLowerCase().includes(keyword) || // Name
      plant[4].toLowerCase().includes(keyword)    // Scientific Name
  );

  filtered.forEach(plant => {
    const li = document.createElement("li");
    li.textContent = `${plant[1]} (${plant[4]})`;
    li.onclick = () => {
      input.value = plant[1];
      suggestionBox.innerHTML = "";
    };
    suggestionBox.appendChild(li);
  });
}

// 👉 กดปุ่มค้นหา
function submitSearch() {
  const keyword = document.getElementById("searchInput").value.trim();
  if (keyword) {
    window.location.href = `PlantInfoDisplay.html?keyword=${encodeURIComponent(keyword)}`;
  }
}

// 👉 แสดงข้อมูลพืช
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
        <strong>Scientific name:</strong> ${plant.sci}<br>
        <strong>Barcode:</strong> <span id="barcode">${plant.bar}</span><br>
      `;
    });
}

// 📤 ส่งรายงานโรคพืช
function submitReport(e) {
  e.preventDefault();
  const form = document.getElementById("reportForm");
  const qty = parseInt(form.quantity.value);
  const barcode = document.getElementById("barcode").textContent;

  for (let i = 1; i <= qty; i++) {
    const payload = {
      name: document.querySelector("strong:nth-child(2)").nextSibling.textContent.trim(),
      sci: document.querySelector("strong:nth-child(6)").nextSibling.textContent.trim(),
      barcode: barcode,
      plantid: `${barcode}-${String(i).padStart(4, "0")}`,
      zone: form.zone.value,
      quantity: qty,
      symptom: form.symptom.value,
      treatment: form.treatment.value,
      status: form.status.value,
      caretaker: form.caretaker.value,
      reporter: form.reporter.value,
    };

    fetch(SHEET_API + "?page=report", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  document.getElementById("submitStatus").innerText = "✅ รายงานสำเร็จแล้ว";
  form.reset();
}

// โหลดลิสต์พืชตอนเปิดหน้า
window.onload = fetchPlantList;
