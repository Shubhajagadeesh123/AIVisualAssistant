// =========================================
// AIVisualAssistant Onboarding
// =========================================

let currentStep = 1;
const totalSteps = 7;

let setupData = {
    language: "en-IN",
    permissions: {
        camera: false,
        microphone: false,
        location: false,
        notifications: false
    },
    emergencyContacts: [],
    home: {},
    voiceConfigured: false,
    setupComplete: false
};

// ----------------------------
// Initialize
// ----------------------------

document.addEventListener("DOMContentLoaded", () => {

    showStep(1);

    setupNextButtons();
    setupBackButtons();
    setupLanguageSelection();

    document
        .getElementById("allowPermissions")
        ?.addEventListener("click", requestPermissions);

    document
        .getElementById("startVoiceTest")
        ?.addEventListener("click", startVoiceTest);

    document
        .getElementById("finishSetup")
        ?.addEventListener("click", finishSetup);

});

// ----------------------------
// Show Step
// ----------------------------

function showStep(step){

    document
        .querySelectorAll(".step")
        .forEach(s=>s.classList.remove("active"));

    document
        .getElementById(`step${step}`)
        .classList.add("active");

    currentStep = step;

    updateProgress();

}

// ----------------------------
// Progress Bar
// ----------------------------

function updateProgress(){

    const progress =
        (currentStep / totalSteps) * 100;

    document
        .getElementById("progressFill")
        .style.width = progress + "%";

    document
        .getElementById("stepText")
        .innerText =
        `Step ${currentStep} of ${totalSteps}`;

}

// ----------------------------
// Next Buttons
// ----------------------------

function setupNextButtons(){

    const buttons =
        document.querySelectorAll(".nextBtn");

    buttons.forEach(btn=>{

        btn.addEventListener("click",()=>{

            if(currentStep < totalSteps){

                showStep(currentStep + 1);

            }

        });

    });

}

// ----------------------------
// Back Buttons
// ----------------------------

function setupBackButtons(){

    const buttons =
        document.querySelectorAll(".backBtn");

    buttons.forEach(btn=>{

        btn.addEventListener("click",()=>{

            if(currentStep > 1){

                showStep(currentStep - 1);

            }

        });

    });

}

// ----------------------------
// Language Selection
// ----------------------------

function setupLanguageSelection(){

    const buttons =
        document.querySelectorAll(".langBtn");

    buttons.forEach(btn=>{

        btn.addEventListener("click",()=>{

            buttons.forEach(b=>b.classList.remove("selected"));

            btn.classList.add("selected");

            setupData.language =
                btn.dataset.lang;

            speak("Language selected");

        });

    });

}

// ----------------------------
// Text To Speech
// ----------------------------

function speak(text){

    speechSynthesis.cancel();

    const msg =
        new SpeechSynthesisUtterance(text);

    msg.lang =
        setupData.language;

    speechSynthesis.speak(msg);

}

// ----------------------------
// Request Permissions
// ----------------------------

async function requestPermissions() {

    try {

        // Camera + Microphone
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        setupData.permissions.camera = true;
        setupData.permissions.microphone = true;

        // Stop camera after permission is granted
        stream.getTracks().forEach(track => track.stop());

    } catch (err) {

        alert("Camera or Microphone permission denied.");

    }

    // Location

    if ("geolocation" in navigator) {

        navigator.geolocation.getCurrentPosition(

            function(position) {

                setupData.permissions.location = true;

            },

            function() {

                alert("Location permission denied.");

            }

        );

    }

    // Notifications

    if ("Notification" in window) {

        Notification.requestPermission().then(permission => {

            if (permission === "granted") {

                setupData.permissions.notifications = true;

            }

        });

    }

    speak("Permissions completed.");

}

// ----------------------------
// Voice Test
// ----------------------------

function startVoiceTest() {

    const status =
        document.getElementById("voiceStatus");

    if (!('webkitSpeechRecognition' in window) &&
        !('SpeechRecognition' in window)) {

        status.innerHTML =
            "Speech Recognition Not Supported";

        return;

    }

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const recognition =
        new SpeechRecognition();

    recognition.lang =
        setupData.language;

    recognition.start();

    status.innerHTML =
        "Listening...";

    recognition.onresult = function(event){

        const speech =
            event.results[0][0].transcript;

        status.innerHTML =
            "You said : " + speech;

        setupData.voiceConfigured = true;

        speak("Voice configured successfully");

    };

    recognition.onerror = function(){

        status.innerHTML =
            "Voice test failed.";

    };

}

// ----------------------------
// Save Emergency Contacts
// ----------------------------

function saveEmergencyContacts(){

    setupData.emergencyContacts = [

        {

            name:
            document.getElementById("contact1Name").value,

            phone:
            document.getElementById("contact1Phone").value

        },

        {

            name:
            document.getElementById("contact2Name").value,

            phone:
            document.getElementById("contact2Phone").value

        },

        {

            name:
            document.getElementById("contact3Name").value,

            phone:
            document.getElementById("contact3Phone").value

        }

    ];

}

// ----------------------------
// Save Home Address
// ----------------------------

function saveHome(){

    setupData.home = {

        address:
        document.getElementById("homeAddress").value,

        city:
        document.getElementById("city").value,

        state:
        document.getElementById("state").value,

        country:
        document.getElementById("country").value

    };

}

// =====================================
// Finish Setup
// =====================================

function finishSetup() {

    // Save Contacts
    saveEmergencyContacts();

    // Save Home
    saveHome();

    setupData.setupComplete = true;

    // Save everything
    localStorage.setItem(
        "AIVisualAssistantSetup",
        JSON.stringify(setupData)
    );

    speak("Setup completed successfully.");

    setTimeout(() => {

        // Go to existing BlindMate Dashboard
        window.location.href = "/";

    }, 2000);

}

// =====================================
// Load Existing Setup
// =====================================

function loadSetup() {

    const saved =
        localStorage.getItem("AIVisualAssistantSetup");

    if (!saved)
        return null;

    return JSON.parse(saved);

}

// =====================================
// Check Setup
// =====================================

function isSetupComplete() {

    const setup =
        loadSetup();

    if (!setup)
        return false;

    return setup.setupComplete === true;

}

// =====================================
// Reset Setup (Developer)
// =====================================

function resetSetup() {

    localStorage.removeItem(
        "AIVisualAssistantSetup"
    );

    alert("Setup Reset Successfully");

}

// =====================================
// Auto Redirect
// =====================================

// If setup already completed,
// don't show onboarding again

window.addEventListener("load", () => {

    if (isSetupComplete()) {

        window.location.href = "/";

    }

});

// =====================================
// Welcome Voice
// =====================================

window.onload = function () {

    if (!isSetupComplete()) {

        speak(
            "Welcome to AI Visual Assistant. Let's complete a quick one time setup."
        );

    }

};

// =====================================
// Keyboard Shortcuts
// =====================================

document.addEventListener("keydown", (e) => {

    // ESC -> Previous Step

    if (e.key === "Escape") {

        if (currentStep > 1) {

            showStep(currentStep - 1);

        }

    }

    // ENTER -> Next Step

    if (e.key === "Enter") {

        if (currentStep < totalSteps) {

            showStep(currentStep + 1);

        }

    }

});

// =====================================
// Debug
// =====================================

console.log("AIVisualAssistant Onboarding Loaded");