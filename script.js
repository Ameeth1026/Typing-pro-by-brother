const hamburger = document.querySelector('.hamburger i');
const popup = document.querySelector('.popup');
const mistaketag = document.querySelector('#mistake');
const wpmtag = document.querySelector('#wpm');
const cpmtag = document.querySelector('#cpm');

const accuracyGif = document.getElementById('accuracy_gif');
const reviewText = document.getElementById('review_text');
const typingInput = document.getElementById('typing_input');

let timerInterval;
let seconds = 0;
let character_index = 0;
let mistake = 0;
let isTimerRunning = false;
let totalMinutes; // Declare totalMinutes at a higher scope
let count = 0; // Keystroke count

hamburger.addEventListener('click', () => {
    popup.classList.toggle('show_options');
});


const formatText = (text) => {
    const selectedFormat = document.getElementById('select_text').value;
    switch (selectedFormat) {
        case 'normal':
            return text;
        case 'capitalize':
            return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        case 'lowercase':
            return text.toLowerCase();
        case 'uppercase':
            return text.toUpperCase();
        case 'no_punctuation_lowercase':
            return text.replace(/[^\w\s]|_/g, "").toLowerCase();
        case 'no_punctuation_uppercase':
            return text.replace(/[^\w\s]|_/g, "").toUpperCase();
        default:
            return text;
    }
};

const display_random_para = () => {
    const shuffledParagraphs = para_fact_array.sort(() => Math.random() - 0.5);
    const paragraphsToDisplay = shuffledParagraphs.slice(0, 1);

    const paragraphs_container = document.querySelector('.text_and_type');
    paragraphs_container.innerHTML = '';

    paragraphsToDisplay.forEach(para_graph => {
        const formattedText = formatText(para_graph);
        const characterSpans = formattedText.split("").map(char => `<span class="characters">${char}</span>`).join("");

        const paragraph_box = document.createElement('div');
        paragraph_box.classList.add('paragraph-container');
        paragraph_box.innerHTML = characterSpans;
        paragraphs_container.appendChild(paragraph_box);
    });

    // Automatically focus the input field when the paragraph is displayed
    typingInput.focus();
}

const startTimer = (selectedTime) => {
    if (isTimerRunning) return;

    totalMinutes = selectedTime; // Set the value of totalMinutes
    seconds = totalMinutes * 60;
    isTimerRunning = true;

    clearInterval(timerInterval);
    document.getElementById('time').textContent = `${seconds}`;

    timerInterval = setInterval(() => {
        if (seconds > 0) {
            seconds--;
            document.getElementById('time').textContent = `${seconds}`;
        } else {
            clearInterval(timerInterval);
            isTimerRunning = false;
            calculateWPMAndCPM();
            alert("Time's up!");
            typingInput.disabled = true;
        }
    }, 1000);

    // Automatically focus the input field when the timer starts
    typingInput.focus();
};

const displayWPMReview = (wpm) => {
    const gifDiv = document.querySelector('.gif img');
    const reviewText = document.querySelector('.gif p');

    // Find the review object that matches the WPM range
    const review_s = reviews.find(r => wpm >= r.minWPM && wpm <= r.maxWPM);

    if (review_s) {
        gifDiv.src = `${review_s.emoji}`; // Set to an appropriate image URL if needed
        reviewText.innerHTML = `${review_s.review}`;

    }

};

const calculateWPMAndCPM = () => {
    const totalTypedCharacters = character_index; // Total characters typed
    const totalMistakes = mistake; // Total mistakes made during the session
    const totalCharacters = totalTypedCharacters - totalMistakes; // Correctly typed characters
    let wpm = 0;
    let cpm = 0;
    let accuracy = 0;

    // Calculate CPM
    if (totalMinutes > 0) {
        const actualTimeSpent = (totalMinutes * 60) - seconds; // Time spent typing in seconds
        if (actualTimeSpent > 0) {
            cpm = Math.round(totalTypedCharacters * (60 / actualTimeSpent)); // Calculate CPM
        } else {
            cpm = 0; // Set CPM to 0 if no time has passed
        }
    } else {
        cpm = 0; // Set CPM to 0 if totalMinutes is 0
    }

    // Calculate Accuracy (Typed Characters / Keystrokes) * 100
    if (count > 0) {
        accuracy = (totalTypedCharacters / count) * 100;
    } else {
        accuracy = 0; // Prevent division by zero
    }

    // Update accuracy display
    document.getElementById('accuracy').innerText = accuracy.toFixed(2) + '%';

    // WPM calculation
    if (totalMinutes > 0) {
        wpm = Math.round((totalCharacters / 5) / (totalMinutes)); // Calculate WPM
    } else {
        wpm = 0; // Set WPM to 0 if time is up
    }


    displayWPMReview(wpm);
    // Update the DOM with the calculated values
    wpmtag.innerText = wpm;
    cpmtag.innerText = cpm;
};

// Keystroke counter
const countKeystrokes = () => {
    typingInput.addEventListener('keydown', (event) => {
        count++; // Increment keystroke count on keydown
    });
};

// Call the keystroke counting function
countKeystrokes();

const initTyping = (e) => {
    const characters = document.querySelector('.text_and_type').querySelectorAll('span');
    let typedChar = typingInput.value.split("")[character_index];

    if (e.inputType === 'deleteContentBackward') {
        if (character_index > 0) {
            character_index--;
            if (characters[character_index].classList.contains('incorrect')) {
                mistake--;
                mistaketag.innerText = mistake;
            }
            characters[character_index].classList.remove('correct', 'incorrect');
        }
    } else if (character_index < characters.length) {
        characters[character_index].classList.remove('characters');

        if (characters[character_index].textContent === typedChar) {
            characters[character_index].classList.add('correct');
        } else {
            characters[character_index].classList.add('incorrect');
            mistake++;
            mistaketag.innerText = mistake;
        }

        character_index++;
    }
};

typingInput.addEventListener('keydown', (event) => {
    if (seconds === 0 && event.key !== "Backspace") {
        const selectedTime = parseInt(document.getElementById('select_time').value);
        startTimer(selectedTime);
    }
});

typingInput.addEventListener('input', initTyping);

const resetTyping = () => {
    location.reload(); // Refresh the page
};

document.getElementById('resetButton').addEventListener('click', resetTyping);

document.getElementById('select_text').addEventListener('change', display_random_para);

document.getElementById('select_time').addEventListener('change', () => {
    // Automatically focus the input field when time is selected
    typingInput.focus();
});

display_random_para();
document.getElementById('time').textContent = `0`;