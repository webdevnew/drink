const input = document.getElementById('drinkInput');
const list = document.getElementById('drinkList');

let drinks = JSON.parse(localStorage.getItem('drinks')) || [];

// Function to format time
function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Render the drinks on the list
function renderDrinks() {
  list.innerHTML = '';  // Clear the list first
  
  // Loop through each drink
  drinks.forEach((drink, index) => {
    const li = document.createElement('li');
    
    // Set background color based on whether the drink is finished or not
    li.style.backgroundColor = drink.finished ? 'hsl(0, 80%, 70.00%)' : 'hsl(140, 80%, 70%)'; // Red if finished, green if not
    
    // Create the drink container div
    const drinkContainer = document.createElement('div');
    drinkContainer.className = 'drink-container';
    
    // Create the name-time div
    const nameTimeDiv = document.createElement('div');
    nameTimeDiv.className = 'name-time';

    // Create the name div
    const nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.textContent = drink.name;

    // Create the time div
    const timeDiv = document.createElement('div');
    timeDiv.className = 'time';
    timeDiv.textContent = formatTime(drink.time);

    // Create the icon (tick)
    const icon = document.createElement('i');
    icon.className = 'bx bxs-check-square';  // Add Boxicon class to the icon
    icon.style.cursor = 'pointer';  // Make sure it's clickable
    icon.style.color = drink.finished ? 'hsl(0, 100%, 30%)' : 'hsl(140, 100%, 30%)';

    // Attach the icon click event
    icon.onclick = () => {
      drinks[index].finished = true;  // Mark this drink as finished
      localStorage.setItem('drinks', JSON.stringify(drinks));  // Save to localStorage
      renderDrinks();  // Re-render the drinks list
    };

    // Append the elements together
    nameTimeDiv.appendChild(nameDiv);
    nameTimeDiv.appendChild(timeDiv);
    drinkContainer.appendChild(nameTimeDiv);
    drinkContainer.appendChild(icon);  // Append icon to drink container

    li.appendChild(drinkContainer);
    list.appendChild(li);
  });
}

// Add a new drink to the list
function addDrink() {
  const name = input.value.trim();
  if (!name) return;  // Do nothing if the input is empty

  const drink = {
    name,
    time: new Date().toISOString(),  // Store the current time
    finished: false  // Initially, drinks are not finished
  };

  drinks.push(drink);
  localStorage.setItem('drinks', JSON.stringify(drinks));  // Save to localStorage
  input.value = '';  // Clear the input field
  renderDrinks();  // Re-render the drinks list
}

// Clear all drinks from the log
function clearDrinks() {
  if (confirm("Are you sure you want to clear the log?")) {
    drinks = [];
    localStorage.removeItem('drinks');  // Remove the log from localStorage
    renderDrinks();  // Re-render the drinks list
  }
}

// Initial render when the page loads
renderDrinks();
