// Dashboard JavaScript for Seat Booking with Backend Integration

// API Configuration
const API_BASE_URL = 'http://localhost:8080';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('jwtToken');
}

function getUserInfo() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Check authentication
function checkDashboardAuth() {
    const token = getToken();
    const user = getUserInfo();
    
    if (!token || !user) {
        window.location.href = 'index.html';
        return null;
    }
    
    return user;
}

// Initialize dashboard
const currentUser = checkDashboardAuth();

if (currentUser) {
    // Update user name in navbar
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = `Welcome, ${currentUser.username}`;
    }
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });
}

// Booking state
let bookingState = {
    duration: 1,
    selectedSeat: null,
    startTime: new Date(),
    endTime: null
};

// Update time calculations
function updateTimes() {
    const now = new Date();
    bookingState.startTime = now;
    bookingState.endTime = new Date(now.getTime() + bookingState.duration * 60 * 60 * 1000);
    
    // Update display
    const startTimeElement = document.getElementById('startTime');
    const endTimeElement = document.getElementById('endTime');
    
    if (startTimeElement) {
        startTimeElement.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    if (endTimeElement) {
        endTimeElement.textContent = bookingState.endTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// Duration controls
const decreaseHours = document.getElementById('decreaseHours');
const increaseHours = document.getElementById('increaseHours');
const durationValue = document.getElementById('durationValue');
const durationSlider = document.getElementById('durationSlider');
const hourPlural = document.getElementById('hourPlural');

function updateDuration(value) {
    bookingState.duration = parseInt(value);
    
    if (durationValue) {
        durationValue.textContent = bookingState.duration;
    }
    
    if (durationSlider) {
        durationSlider.value = bookingState.duration;
    }
    
    if (hourPlural) {
        hourPlural.textContent = bookingState.duration === 1 ? '' : 's';
    }
    
    // Update button states
    if (decreaseHours) {
        decreaseHours.disabled = bookingState.duration <= 1;
    }
    
    if (increaseHours) {
        increaseHours.disabled = bookingState.duration >= 12;
    }
    
    updateTimes();
}

if (decreaseHours) {
    decreaseHours.addEventListener('click', () => {
        if (bookingState.duration > 1) {
            updateDuration(bookingState.duration - 1);
        }
    });
}

if (increaseHours) {
    increaseHours.addEventListener('click', () => {
        if (bookingState.duration < 12) {
            updateDuration(bookingState.duration + 1);
        }
    });
}

if (durationSlider) {
    durationSlider.addEventListener('input', (e) => {
        updateDuration(e.target.value);
    });
}

// Initialize duration
updateDuration(1);

// Step navigation
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const durationSection = document.getElementById('durationSection');
const seatSection = document.getElementById('seatSection');
const confirmationSection = document.getElementById('confirmationSection');

function showDurationSection() {
    step1.classList.add('active');
    step1.classList.remove('completed');
    step2.classList.remove('active', 'completed');
    step3.classList.remove('active', 'completed');
    
    durationSection.classList.remove('hidden');
    seatSection.classList.add('hidden');
    confirmationSection.classList.add('hidden');
}

function showSeatSection() {
    step1.classList.remove('active');
    step1.classList.add('completed');
    step2.classList.add('active');
    step2.classList.remove('completed');
    step3.classList.remove('active', 'completed');
    
    durationSection.classList.add('hidden');
    seatSection.classList.remove('hidden');
    confirmationSection.classList.add('hidden');
}

function showConfirmationSection() {
    step1.classList.add('completed');
    step2.classList.add('completed');
    step3.classList.add('active');
    
    durationSection.classList.add('hidden');
    seatSection.classList.add('hidden');
    confirmationSection.classList.remove('hidden');
}

// Proceed to seat selection
const proceedToSeats = document.getElementById('proceedToSeats');
if (proceedToSeats) {
    proceedToSeats.addEventListener('click', () => {
        showSeatSection();
        generateSeats();
    });
}

// Back to duration
const backToDuration = document.getElementById('backToDuration');
if (backToDuration) {
    backToDuration.addEventListener('click', () => {
        bookingState.selectedSeat = null;
        showDurationSection();
    });
}

// Generate seats (simplified - showing L-1 to L-60 format as per API)
function generateSeats() {
    const seatGrid = document.getElementById('seatGrid');
    if (!seatGrid) return;
    
    // Clear existing seats
    seatGrid.innerHTML = '';
    
    // Generate 60 seats in L-X format (as per API example)
    const totalSeats = 60;
    
    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement('button');
        seat.className = 'seat';
        const seatNumber = `L-${i}`;
        seat.textContent = seatNumber;
        seat.dataset.seatNumber = seatNumber;
        
        // Randomly mark some seats as unavailable for demo
        if (Math.random() > 0.7) {
            seat.classList.add('unavailable');
        } else {
            seat.classList.add('available');
            
            seat.addEventListener('click', () => {
                selectSeat(seatNumber);
            });
        }
        
        seatGrid.appendChild(seat);
    }
}

// Select seat
function selectSeat(seatNumber) {
    // Remove previous selection
    const allSeats = document.querySelectorAll('.seat');
    allSeats.forEach(seat => {
        seat.classList.remove('selected');
    });
    
    // Add new selection
    const selectedSeatElement = document.querySelector(`.seat[data-seat-number="${seatNumber}"]`);
    if (selectedSeatElement) {
        selectedSeatElement.classList.add('selected');
    }
    
    bookingState.selectedSeat = seatNumber;
    
    // Update selected seat info
    const selectedSeatInfo = document.getElementById('selectedSeatInfo');
    if (selectedSeatInfo) {
        selectedSeatInfo.innerHTML = `<p>Selected: <strong>Seat ${seatNumber}</strong></p>`;
    }
    
    // Enable confirm button
    const confirmBooking = document.getElementById('confirmBooking');
    if (confirmBooking) {
        confirmBooking.disabled = false;
    }
}

// Confirm booking - Call Backend API
const confirmBooking = document.getElementById('confirmBooking');
if (confirmBooking) {
    confirmBooking.addEventListener('click', async () => {
        if (!bookingState.selectedSeat) {
            alert('Please select a seat first');
            return;
        }
        
        const token = getToken();
        if (!token) {
            alert('You are not authenticated. Please login again.');
            window.location.href = 'index.html';
            return;
        }
        
        // Disable button to prevent double clicks
        confirmBooking.disabled = true;
        confirmBooking.textContent = 'Booking...';
        
        try {
            // Call backend booking API
            const response = await fetch(`${API_BASE_URL}/booking/seat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    seatNumber: bookingState.selectedSeat,
                    hours: bookingState.duration
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Booking failed');
            }
            
            // Response is plain text confirmation
            const message = await response.text();
            console.log('Booking response:', message);
            
            // Update confirmation display
            document.getElementById('confirmedSeat').textContent = `Seat ${bookingState.selectedSeat}`;
            document.getElementById('confirmedDuration').textContent = `${bookingState.duration} hour${bookingState.duration === 1 ? '' : 's'}`;
            document.getElementById('confirmedStartTime').textContent = bookingState.startTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            document.getElementById('confirmedEndTime').textContent = bookingState.endTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            // Show confirmation
            showConfirmationSection();
            
            // Reset button
            confirmBooking.disabled = false;
            confirmBooking.textContent = 'Confirm Booking';
            
        } catch (error) {
            console.error('Booking error:', error);
            alert(`Booking failed: ${error.message}`);
            
            // Re-enable button
            confirmBooking.disabled = false;
            confirmBooking.textContent = 'Confirm Booking';
        }
    });
}

// Book another seat
const bookAnother = document.getElementById('bookAnother');
if (bookAnother) {
    bookAnother.addEventListener('click', () => {
        // Reset booking state
        bookingState = {
            duration: 1,
            selectedSeat: null,
            startTime: new Date(),
            endTime: null
        };
        
        updateDuration(1);
        showDurationSection();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Go to homepage
const goHome = document.getElementById('goHome');
if (goHome) {
    goHome.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
