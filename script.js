const input = document.getElementById('drinkInput');
const list = document.getElementById('drinkList');
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycby2r-i4ejJu5C_UN_Bg3_uj2jYLffTnwcWx4qiAzJmqx0g2Cs5K0JuoIeDdPUdZcFjYfw/exec';

let drinks = [];

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fetchDrinks() {
  fetch(SHEETS_URL)
    .then(res => res.json())
    .then(data => {
      drinks = data.slice(1).map((row, index) => ({
        name: row[0],
        time: row[1],
        finished: row[2] === true || row[2] === "TRUE",
        index: index
      }));
      renderDrinks();
    })
    .catch(err => {
      console.error("Fetch error:", err);
    });
}

function addDrink() {
  const name = input.value.trim();
  if (!name) return;

  fetch(SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add', name, time: new Date().toISOString(), finished: false })
  }).then(() => {
    input.value = '';
    fetchDrinks();
  });
}

function clearDrinks() {
  if (!confirm("Are you sure you want to clear the log?")) return;

  fetch(SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'clear' })
  }).then(fetchDrinks);
}

// Call this on page load
fetchDrinks();
