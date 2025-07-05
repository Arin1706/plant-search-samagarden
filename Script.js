let plants = [];

window.onload = async function () {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbx1u-OS9-MZYabqxLMAsB14iI27soBw8C13imJC0XDRkEIkSSj9MsP4IQlHnsDsquqGOA/exec?page=suggest"
  );
  plants = await res.json();

  const input = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("suggestions");

  input.addEventListener("input", function () {
    const keyword = input.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";
    if (!keyword) {
      suggestionsBox.style.display = "none";
      return;
    }

    const filtered = plants.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.scientific.toLowerCase().includes(keyword)
    );

    filtered.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = `${p.name} (${p.scientific})`;
      li.onclick = () => {
        input.value = p.name;
        suggestionsBox.style.display = "none";
      };
      suggestionsBox.appendChild(li);
    });

    suggestionsBox.style.display = filtered.length ? "block" : "none";
  });
};

function submitSearch() {
  const keyword = document.getElementById("searchInput").value.trim();
  if (!keyword) {
    alert("กรุณาพิมพ์ชื่อพืชก่อนค้นหา");
    return;
  }
  window.location.href = `?page=PlantInfoDisplay&keyword=${encodeURIComponent(keyword)}`;
}
