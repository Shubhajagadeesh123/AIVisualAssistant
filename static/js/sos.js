/* ==========================================
   AIVisualAssistant SOS System
========================================== */

class EmergencySOS {

    constructor() {

        this.settings = JSON.parse(
            localStorage.getItem("AIVisualAssistantSettings")
        ) || {};

        this.initialize();

    }

    initialize() {

        const btn1 = document.getElementById("emergencyBtn");
        const btn2 = document.getElementById("floatingSOS");

        if (btn1) {

            btn1.addEventListener("click", () => {

                this.triggerSOS();

            });

        }

        if (btn2) {

            btn2.addEventListener("click", () => {

                this.triggerSOS();

            });

        }

    }

    async triggerSOS() {

        this.speak("Emergency mode activated.");

        if (!navigator.geolocation) {

            alert("GPS not supported.");

            return;

        }

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const latitude = position.coords.latitude;

                const longitude = position.coords.longitude;

                const contacts = [

                    {
                        name: this.settings.contact1Name,
                        phone: this.settings.contact1Phone
                    },

                    {
                        name: this.settings.contact2Name,
                        phone: this.settings.contact2Phone
                    },

                    {
                        name: this.settings.contact3Name,
                        phone: this.settings.contact3Phone
                    }

                ].filter(c => c.phone);

                try {

                    const response = await fetch("/api/emergency", {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            latitude,

                            longitude,

                            contacts

                        })

                    });

                    const result = await response.json();

                    if (result.success) {

                        this.speak("Emergency alert has been sent.");

                        alert(
                            "Emergency Alert Sent Successfully."
                        );

                    }

                }

                catch (error) {

                    console.error(error);

                    alert("Unable to send emergency.");

                }

            },

            () => {

                alert("Unable to get location.");

            }

        );

    }

    speak(text) {

        if (!window.speechSynthesis) return;

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = 1;

        utterance.pitch = 1;

        speechSynthesis.speak(utterance);

    }

}

window.addEventListener("DOMContentLoaded", () => {

    new EmergencySOS();

});