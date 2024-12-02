// Initialize date and current month
const currentDate = new Date();
let selectedDate = null;
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const timeSlots = generateTimeSlots();

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    hideTimeSlots();
});

// Change month on button click
function changeMonth(direction) {
    currentMonth += direction;

    // Handle year change
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
}

function renderCalendar() {
  const monthYearElement = document.getElementById('monthYear');
  const calendarTable = document.getElementById('calendarTable');

  // Set month and year
  monthYearElement.textContent = `${getMonthName(currentMonth)} ${currentYear}`;

  // Get first day of the month and total days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let day = 1;

  // Create table header (Days of the week)
  const headerRow = document.createElement('tr');
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOfWeek.forEach(dayName => {
      const th = document.createElement('th');
      th.textContent = dayName;
      headerRow.appendChild(th);
  });
  calendarTable.innerHTML = '';
  calendarTable.appendChild(headerRow);

  // Create calendar rows
  let row = document.createElement('tr');
  for (let i = 0; i < firstDayOfMonth; i++) {
      row.appendChild(document.createElement('td')); // Empty cells for days before the 1st
  }

  // Render the days of the month
  for (let i = firstDayOfMonth; day <= totalDaysInMonth; i++) {
      const cell = document.createElement('td');
      cell.textContent = day;

      // Disable past dates except for today's date
      const date = new Date(currentYear, currentMonth, day);
      if (date < currentDate) {
          cell.classList.add('disabled');
      }

      // Allow selection of today's date, make it selectable
      if (date.toDateString() === currentDate.toDateString()) {
          cell.classList.remove('disabled');
      }

      cell.onclick = () => handleDayClick(date);

      row.appendChild(cell);

      // If end of row, create a new row
      if ((i + 1) % 7 === 0) {
          calendarTable.appendChild(row);
          row = document.createElement('tr');
      }

      day++;
  }

  if (row.children.length > 0) {
      calendarTable.appendChild(row); // Append remaining cells
  }
}

// Get month name from index
function getMonthName(monthIndex) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
}

// Handle date selection
function handleDayClick(date) {
  // If there's a previously selected date, remove the selected class
  if (selectedDate) {
      const previouslySelectedCell = document.querySelector('.selected');
      if (previouslySelectedCell) {
          previouslySelectedCell.classList.remove('selected');
      }
  }

  selectedDate = date; // Set the new selected date
  renderTimeSlots(); // Render the time slots for the new date
  showTimeSlots(); // Display the time slots section

  // Find the corresponding table cell and add the 'selected' class to it
  const allCells = document.querySelectorAll('#calendarTable td');
  allCells.forEach(cell => {
      const cellDate = new Date(currentYear, currentMonth, cell.textContent);
      if (cellDate.toDateString() === date.toDateString()) {
          cell.classList.add('selected'); // Add the 'selected' class
      }
  });
}


function selectTimeSlot(slot) {
    // If there's a previously selected time slot, remove the 'selected' class
    const previouslySelectedSlot = document.querySelector('.time-slots li.selected');
    if (previouslySelectedSlot) {
        previouslySelectedSlot.classList.remove('selected');
    }

    // Set the new selected time slot
    selectedTimeSlot = slot;

    // Find the corresponding list item (time slot) and add the 'selected' class
    const timeSlotListItems = document.querySelectorAll('.time-slots li');
    timeSlotListItems.forEach(item => {
        // Compare the text content of each item with the selected slot
        if (item.textContent.trim() === slot) {
            item.classList.add('selected'); // Add the 'selected' class
        }
    });
}



// Generate time slots from 8 AM to 6 PM, every 30 minutes
function generateTimeSlots() {
    const slots = [];
    let startTime = 8;
    while (startTime <= 18) {
        const ampm = startTime < 12 ? 'AM' : 'PM';
        const hour = startTime % 12 || 12;
        const time = `${hour}:00 ${ampm}`;
        slots.push(time);
        slots.push(`${hour}:30 ${ampm}`);
        startTime++;
    }
    return slots;
}

// Render available time slots in a 3x7 grid
function renderTimeSlots() {
    const timeSlotList = document.getElementById('timeSlotList');
    timeSlotList.innerHTML = ''; // Clear the list
  
    // Generate time slots and add them to the grid
    timeSlots.slice(0, 21).forEach(slot => {  // Ensure only 21 slots are shown
        const li = document.createElement('li');
        li.textContent = slot;
        li.onclick = () => selectTimeSlot(slot);  // Make the slot selectable
        timeSlotList.appendChild(li);
    });
  }


// Show the time slots section
function showTimeSlots() {
    document.getElementById('timeSlotsSection').style.display = 'block';
}

// Hide the time slots section
function hideTimeSlots() {
    document.getElementById('timeSlotsSection').style.display = 'none';
}

// Store the selected time slot
let selectedTimeSlot = null;

function selectTimeSlot(slot) {
    selectedTimeSlot = slot;
}

// Confirm the appointment
function confirmAppointment() {
  if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time.");
      return;
  }

  const appointmentDetails = `Date: ${selectedDate.toLocaleDateString()} \nTime: ${selectedTimeSlot}`;
  document.getElementById('appointmentDetails').textContent = appointmentDetails;
  showPopup();
}

// Show the confirmation popup with overlay
function showPopup() {
  document.getElementById('overlay').style.display = 'block'; 
  document.getElementById('confirmationPopup').style.display = 'flex';  
}

// Close the confirmation popup
function closePopup() {
  document.getElementById('overlay').style.display = 'none';  
  document.getElementById('confirmationPopup').style.display = 'none';  
  resetAppointment();
}


// Reset the appointment after booking or closing the pop-up
function resetAppointment() {
  selectedDate = null;
  selectedTimeSlot = null;
  hideTimeSlots();
  renderCalendar();
}
