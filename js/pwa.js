// PWA Installation and Management
let deferredPrompt;
let installButton;

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Farm_Weather/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// Handle install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault();
  // Store the event for later use
  deferredPrompt = e;
  // Show install button
  showInstallPromotion();
});

// Show install promotion
function showInstallPromotion() {
  const installBanner = document.createElement('div');
  installBanner.id = 'installBanner';
  installBanner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-lg shadow-2xl z-50 animate-slide-up';
  installBanner.innerHTML = `
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center mb-2">
          <i class="fas fa-mobile-alt text-2xl mr-3"></i>
          <h3 class="font-bold text-lg">Install App</h3>
        </div>
        <p class="text-sm text-white/90 mb-3">
          Install Farm Weather Advisory for quick access and offline use!
        </p>
        <div class="flex space-x-2">
          <button onclick="installPWA()" class="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-sm">
            <i class="fas fa-download mr-2"></i>Install
          </button>
          <button onclick="dismissInstallBanner()" class="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition text-sm">
            Later
          </button>
        </div>
      </div>
      <button onclick="dismissInstallBanner()" class="text-white/80 hover:text-white ml-2">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  document.body.appendChild(installBanner);
}

// Install PWA
async function installPWA() {
  if (!deferredPrompt) {
    return;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user's response
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
    showNotification('App installed successfully! 🎉', 'success');
  } else {
    console.log('User dismissed the install prompt');
  }

  // Clear the deferredPrompt
  deferredPrompt = null;
  dismissInstallBanner();
}

// Dismiss install banner
function dismissInstallBanner() {
  const banner = document.getElementById('installBanner');
  if (banner) {
    banner.remove();
  }
}

// Check if app is installed
window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  dismissInstallBanner();
  
  // Show success message
  if (typeof showNotification === 'function') {
    showNotification('App installed! You can now use it offline.', 'success');
  }
});

// Check if running as PWA
function isRunningAsPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Show PWA status
if (isRunningAsPWA()) {
  console.log('Running as PWA');
  // Add PWA-specific styling or features
  document.body.classList.add('pwa-mode');
}

// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    }
  }
  return false;
}

// Show local notification
function showLocalNotification(title, options = {}) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/Farm_Weather/icons/icon-192x192.png',
      badge: '/Farm_Weather/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

// Check for updates
async function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.update();
    }
  }
}

// Check for updates every hour
setInterval(checkForUpdates, 60 * 60 * 1000);

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
  .pwa-mode {
    /* Add PWA-specific styles */
  }
`;
document.head.appendChild(style);
