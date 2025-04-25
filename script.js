const input = document.getElementById('drinkInput');
const list = document.getElementById('drinkList');
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx4icXnuR3FmW8EQYRsWNC008UIJNNLPEnX7_WwzShzebGbeJMOWbM10nAm6GTvW4fvRw/exec'; // <-- Use the Web App URL from Apps Script

let drinks = [];

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fetchDrinks() {
  fetch(SHEETS_URL)
    .then(res => res.json())
    .then(data => {
      // Skip header row
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

function renderDrinks() {
  list.innerHTML = '';
  drinks.forEach(drink => {
    const li = document.createElement('li');
    li.style.backgroundColor = drink.finished ? 'hsl(0, 80%, 70%)' : 'hsl(140, 80%, 70%)';

    const container = document.createElement('div');
    container.className = 'drink-container';

    const nameTime = document.createElement('div');
    nameTime.className = 'name-time';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = drink.name;

    const time = document.createElement('div');
    time.className = 'time';
    time.textContent = formatTime(drink.time);

    const icon = document.createElement('i');
    icon.className = 'bx bxs-check-square';
    icon.style.cursor = 'pointer';
    icon.style.color = drink.finished ? 'hsl(0, 100%, 30%)' : 'hsl(140, 100%, 30%)';

    icon.onclick = () => {
      fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finish',
          index: drink.index
        })
      }).then(fetchDrinks);
    };

    nameTime.appendChild(name);
    nameTime.appendChild(time);
    container.appendChild(nameTime);
    container.appendChild(icon);
    li.appendChild(container);
    list.appendChild(li);
  });
}

function addDrink() {
  const name = input.value.trim();
  if (!name) return;

  const drink = {
    action: 'add',
    name,
    time: new Date().toISOString(),
    finished: false
  };

  fetch(SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(drink)
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
