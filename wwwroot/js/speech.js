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

function getVoices() {
    return new Promise((resolve, reject) => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices.length > 0); 
        } else {
            window.speechSynthesis.onvoiceschanged = function () {
                resolve(window.speechSynthesis.getVoices().length > 0); 
            };
        }
    });
}

function speakText(text) {
    // Controleer of SpeechSynthesis beschikbaar is
    if ('speechSynthesis' in window) {
        //const voices = getVoicesByLanguage();

        // Kies een stem op basis van geslacht
        const voices = window.speechSynthesis.getVoices();
        const selectedVoices = voices.filter(voice => voice.lang == 'nl-NL');
        let selectedVoice = selectedVoices[0];
        //if (gender === 'm') {
        //    selectedVoice = voices.find(voice => /male/i.test(voice.name));
        //} else if (gender === 'v') {
        //    selectedVoice = voices.find(voice => /female/i.test(voice.name));
        //}

        if (selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;

            // Optioneel: stel snelheid, pitch en volume in
            utterance.rate = 4;
            utterance.pitch = 2;
            utterance.volume = 1;

            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Geen geschikte stem gevonden');
        }
    } else {
        console.error('SpeechSynthesis wordt niet ondersteund in deze browser.');
    }
}
