// Use plain DOM ready
document.addEventListener('DOMContentLoaded', function () {

  /* ----------------- LOGIN FORM (index.html) ----------------- */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const userInput = document.getElementById('username').value.trim();
      const passInput = document.getElementById('password').value.trim();

      const usernamePattern = /^[A-Za-z]+$/;
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!userInput) {
        alert('Please enter your username.');
        return;
      }
      if (!usernamePattern.test(userInput)) {
        alert('Username must contain letters only (no numbers or symbols).');
        return;
      }

      if (!passInput) {
        alert('Please enter your password.');
        return;
      }
      if (!passwordPattern.test(passInput)) {
        alert('Password must be at least 8 characters and include 1 uppercase, 1 lowercase, and 1 number.');
        return;
      }

      // Save username to localStorage and redirect to home
      try {
        localStorage.setItem('gotravel_user', userInput);
      } catch (err) {
        console.warn('localStorage not available:', err);
      }
      window.location.href = 'home.html';
    });
  }

  /* ----------------- PROTECT PAGES & DISPLAY WELCOME ----------------- */
  // pages that require login: home.html, gallery.html, booking.html
  const protectedPages = ['home.html', 'gallery.html', 'booking.html'];
  const currentPath = window.location.pathname.split('/').pop();

  function requireLoginOrRedirect() {
    const storedUser = localStorage.getItem('gotravel_user');
    if (!storedUser) {
      // not logged in — send back to login
      window.location.href = 'index.html';
      return null;
    }
    return storedUser;
  }

  if (protectedPages.includes(currentPath)) {
    const user = requireLoginOrRedirect();
    if (user) {
      // set welcome spans if present
      const welcomeIds = ['welcomeSpan', 'welcomeSpanGallery', 'welcomeSpanBooking'];
      welcomeIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = `Welcome, ${user}!`;
      });
    } else {
      // requireLoginOrRedirect already redirected
      return;
    }
  }

  /* ----------------- LOGOUT BUTTONS ----------------- */
  function attachLogout(btnId) {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', function () {
        try {
          localStorage.removeItem('gotravel_user');
        } catch (err) { /* ignore */ }
        window.location.href = 'index.html';
      });
    }
  }
  attachLogout('logoutBtn');
  attachLogout('logoutBtnGallery');
  attachLogout('logoutBtnBooking');

  /* ----------------- BOOKING FORM (booking.html) ----------------- */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('bookName').value.trim();
      const email = document.getElementById('bookEmail').value.trim();
      const date = document.getElementById('bookDate').value;
      const dest = document.getElementById('bookDest').value;

      if (!name || !email || !date || !dest) {
        alert('Please fill in all fields.');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      const confirmed = confirm(`Confirm booking for ${name} to ${dest} on ${date}?`);
      if (confirmed) {
        alert('Booking confirmed! Thank you for choosing GoTravel.');
        bookingForm.reset();
      }
    });
  }

});
