let recognition;
let transcript = "";

function startRecognition() {
    return new Promise((resolve, reject) => {
        if (!('webkitSpeechRecognition' in window)) {
            reject("Helaas. Je browser ondersteunt geen spraakherkenning...");
            return;
        }

        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'nl-NL'; // Stel de taal in op Nederlands
        recognition.continuous = true;
        recognition.interimResults = true;

        // Gegevens voor het resultaat
        recognition.onresult = function (event) {
            transcript = event.results[event.resultIndex][0].transcript;
        };

        recognition.onend = function () {
            resolve(transcript);  // Return the transcript once recognition stops
        };

        recognition.onerror = function (event) {
            reject(event.error);  // Handle error
        };

        recognition.start();
    });
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
}
