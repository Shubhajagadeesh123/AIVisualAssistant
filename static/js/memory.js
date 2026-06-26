/* ==========================================
   AIVisualAssistant Memory System V2
========================================== */

class MemoryAssistant {

    constructor() {

        this.initialize();

    }

    initialize() {

        const memoryBtn = document.getElementById("memoryBtn");
        const memoryTab = document.getElementById("memoryTab");

        if (memoryBtn) {
            memoryBtn.addEventListener("click", () => {
                this.askMemory();
            });
        }

        if (memoryTab) {
            memoryTab.addEventListener("click", () => {
                this.askMemory();
            });
        }

    }

    /* ==========================================
       Save Object Memory
    ========================================== */

    async saveObject(objectName, position, distance, scene) {

        try {

            await fetch("/api/memory/save", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    object: objectName,

                    position: position,

                    distance: distance,

                    scene: scene,

                    time: new Date().toLocaleString()

                })

            });

            console.log("Memory Saved:", objectName);

        }

        catch (error) {

            console.error("Memory Save Error:", error);

        }

    }

    /* ==========================================
       Search Memory
    ========================================== */

    async askMemory() {

        const object = prompt("What object are you looking for?");

        if (!object) return;

        try {

            const response = await fetch("/api/memory");

            const memories = await response.json();

            const result = memories.find(memory =>

                memory.object.toLowerCase() ===
                object.toLowerCase()

            );

            if (result) {

                const message =
                    `Your ${result.object} was last seen ${result.position}. It appeared ${result.distance}.`;

                this.speak(message);

                alert(

`🧠 Memory Found

Object : ${result.object}

Position : ${result.position}

Distance : ${result.distance}

Time : ${result.time}

Scene :
${result.scene}`

                );

            }

            else {

                this.speak("Sorry, I could not find that object.");

                alert("No memory found.");

            }

        }

        catch (error) {

            console.error(error);

            alert("Unable to load memory.");

        }

    }

    /* ==========================================
       Get Last Seen Object
    ========================================== */

    async getLastSeen(objectName) {

        try {

            const response = await fetch("/api/memory");

            const memories = await response.json();

            return memories.find(memory =>

                memory.object.toLowerCase() ===
                objectName.toLowerCase()

            );

        }

        catch (error) {

            console.error(error);

            return null;

        }

    }

    /* ==========================================
       Speak
    ========================================== */

    speak(text) {

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = "en-IN";

        utterance.rate = 1;

        utterance.pitch = 1;

        speechSynthesis.speak(utterance);

    }

}

window.memoryAssistant = new MemoryAssistant();const sceneDescription =
    this.generateSceneDescription(importantObjects);

if (window.memoryAssistant) {

    objectsWithDistance.forEach(obj => {

        window.memoryAssistant.saveObject(

            obj.name,

            obj.position,

            obj.distance,

            sceneDescription

        );

    });

}

this.speak(sceneDescription, isNavigationMode, true);

this.lastAnnouncement = now;