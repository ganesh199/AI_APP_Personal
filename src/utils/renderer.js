// renderer.js
const { ipcRenderer } = require('electron');

// Initialize random display name for UI components
window.randomDisplayName = null;
// Request random display name from main process
ipcRenderer
    .invoke('get-random-display-name')
    .then(name => {
        window.randomDisplayName = name;
        console.log('Set random display name:', name);
    })
    .catch(err => {
        console.warn('Could not get random display name:', err);
        window.randomDisplayName = 'System Monitor';
    });

// Create reference to the main app element
const PersonalPaApp = document.querySelector('personal-pa-app');

// Simplified cheddar object with only UI-related functions
const cheddar = {
    // Element access
    element: () => PersonalPaApp,
    e: () => PersonalPaApp,
    // App state functions
    getCurrentView: () => PersonalPaApp.currentView,
    getLayoutMode: () => PersonalPaApp.layoutMode,
    // Status function
    setStatus: text => PersonalPaApp.setStatus(text),
    // Content protection function
    getContentProtection: () => {
        const contentProtection = localStorage.getItem('contentProtection');
        return contentProtection !== null ? contentProtection === 'true' : true;
    },
    // Platform detection
    isLinux: process.platform === 'linux',
    isMacOS: process.platform === 'darwin',
    // Shortcut handler
    handleShortcut: (shortcut) => {
        if (shortcut === 'ctrl+enter' || shortcut === 'cmd+enter') {
            // Trigger screenshot and send to LLM
            if (PersonalPaApp && PersonalPaApp.handleScreenshotAndSend) {
                PersonalPaApp.handleScreenshotAndSend();
            }
        }
    }
};

// Make it globally available
window.cheddar = cheddar;