
import Store from 'electron-store';
const store = new Store();

// This object holds all the important data about our pet.
const defaultState = {
  hunger: 100,
  happiness: 100,
  isDirty: false,
  currentRoom: 'living_room',
  unlockedRooms: ['living_room', 'room2'], // Using your room name
  lastUpdated: Date.now()
};

let petState = store.get('petState', defaultState);

function saveState() {
  store.set('petState', petState);
}

// --- Get all our HTML elements so we can control them ---
const bunnyImg = document.getElementById('bunny');
const dirtyIcon = document.getElementById('dirty-icon'); // ACTION: Renamed and Fixed
const hungerStat = document.getElementById('hunger-stat');
const happinessStat = document.getElementById('happiness-stat');
const contentArea = document.getElementById('content-area');

// A list of our room backgrounds (using your asset names)
const roomBackgrounds = {
  living_room: './assets/living_room_bg.png', // Note: I'm assuming your file is living_room.png not living_room_bg.png
  room2: './assets/room2.png'
};

function render() {
  hungerStat.textContent = `Hunger: ${Math.floor(petState.hunger)}`;
  happinessStat.textContent = `Happy: ${Math.floor(petState.happiness)}`;

  if (petState.happiness > 70) {
    bunnyImg.src = './assets/bunny.png';
  } else {
    // You can add a sad bunny image later if you want
    // bunnyImg.src = './assets/bunny-sad.png';
  }

  // Show or hide the dirty icon
  if (petState.isDirty) {
    dirtyIcon.classList.remove('hidden');
  } else {
    dirtyIcon.classList.add('hidden');
  }

  // Set the correct room background
  contentArea.style.backgroundImage = `url(${roomBackgrounds[petState.currentRoom]})`;
}

// --- Get Buttons and Arrows ---
const feedButton = document.getElementById('feed-button');
const playButton = document.getElementById('play-button');
const cleanButton = document.getElementById('clean-button');
const navLeft = document.getElementById('nav-left');
const navRight = document.getElementById('nav-right');

// --- Button Clicks ---
feedButton.addEventListener('click', () => {
  petState.hunger += 15;
  if (petState.hunger > 100) petState.hunger = 100;
  render();
  saveState();
});

playButton.addEventListener('click', () => {
  petState.happiness += 10;
  if (petState.happiness > 100) petState.happiness = 100;
  render();
  saveState();
});

cleanButton.addEventListener('click', () => {
  if (petState.isDirty) {
    petState.isDirty = false;
    render();
    saveState();
  }
});

// --- Arrow Clicks for Changing Rooms ---
function changeRoom(direction) {
  const unlocked = petState.unlockedRooms;
  const currentIndex = unlocked.indexOf(petState.currentRoom);
  let nextIndex;

  if (direction === 'right') {
    nextIndex = (currentIndex + 1) % unlocked.length;
  } else {
    nextIndex = (currentIndex - 1 + unlocked.length) % unlocked.length;
  }
  
  petState.currentRoom = unlocked[nextIndex];
  render();
  saveState();
}

navLeft.addEventListener('click', () => changeRoom('left'));
navRight.addEventListener('click', () => changeRoom('right'));

// --- The Game Loop ---
function gameLoop() {
  petState.hunger -= 1;
  petState.happiness -= 0.5;

  if (petState.hunger < 0) petState.hunger = 0;
  if (petState.happiness < 0) petState.happiness = 0;

  if (Math.random() < 0.1) {
    petState.isDirty = true;
  }
  
  render();
  saveState();
}

// --- Initial Setup ---
render(); // Draw the initial state
setInterval(gameLoop, 5000); // Start the loop