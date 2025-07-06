const input = document.getElementById("plantInput");
const suggestionsContainer = document.getElementById("suggestions");

input.addEventListener("input", async () => {
  const keyword = input.value.trim();
  if (!keyword) {
    suggestionsContainer.innerHTML = "";
    return;
  }

  const response = await fetch(
    `https://script.google.com/macros/s/AKfycbzKoNvt3JGqKzT-L1RvA7dL5uTqtAox5mDLtRMfu6-I-vMnhDHOv7dsUlxpoaFBkRI1/exec?page=suggest&query=${encodeURIComponent(keyword)}`
  );
  const data = await response.json();

  suggestionsContainer.innerHTML = "";
  data.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = item;
    div.addEventListener("click", () => {
      input.value = item;
      suggestionsContainer.innerHTML = "";
    });
    suggestionsContainer.appendChild(div);
  });
});

function submitSearch() {
  const keyword = input.value.trim();
  if (keyword) {
    window.location.href = `?page=PlantInfoDisplay&keyword=${encodeURIComponent(keyword)}`;
  } else {
    alert("กรุณากรอกชื่อต้นไม้ก่อนค้นหา");
  }
}
