document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const results = document.getElementById('results');
    const speedDisplay = document.getElementById('speed');
    const accuracyDisplay = document.getElementById('accuracy');
    const errorDisplay = document.getElementById('error-count');
    const timerDisplay = document.getElementById('timer');

    const wordBank = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "hot", "but", "some", "what", "there", "we", "can", "out", "other", "were", "all", "your", "when", "up", "use", "word", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "would", "write", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "my", "sound", "no", "most", "number", "who", "over", "know", "water", "than", "call", "first", "people", "may", "down", "side", "been", "now", "find", "any", "new", "work", "part", "take", "get", "place", "made", "live", "where", "after", "back", "little", "only", "round", "man", "year", "came", "show", "every", "good", "me", "give", "our", "under", "name", "very", "through", "just", "form", "much", "great", "think", "say", "help", "low", "line", "before", "turn", "cause", "same", "mean", "differ", "move", "right", "boy", "old", "too", "does", "tell", "sentence", "set", "three", "want", "air", "well", "also", "play", "small", "end", "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind", "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother", "world", "near", "build", "self", "earth", "father"]
    let currentWords = shuffleWords([...wordBank]);

    let visibleWordCount = 5;
    let sampleText = currentWords.slice(0, visibleWordCount).join(' ');
    let chars = sampleText.split('').map(char => `<span class="char">${char}</span>`);
    textDisplay.innerHTML = `<span class="cursor"></span>` + chars.join('');
    let charSpans = document.querySelectorAll('#text-display span');

    let startTime;
    let typedText = "";
    let errorsMade = 0;
    let timerInterval;

    function shuffleWords(words) {
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }
        return words;
    }

    function startTimer(duration) {
        let timeRemaining = duration;
        timerDisplay.textContent = timeRemaining;
        timerDisplay.classList.add('fade-in');

        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining;
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                finalizeResults();
            }
        }, 1000);
    }

    function finalizeResults() {
        hiddenInput.disabled = true;
        calculateResults();
        results.classList.remove('hidden');
    }

    // Create and focus a hidden input to capture keystrokes
    const hiddenInput = document.createElement('textarea');
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.opacity = '0';
    document.body.appendChild(hiddenInput);
    hiddenInput.focus();

    hiddenInput.addEventListener('input', () => {
        if (!startTime) {
            startTime = new Date();
            startTimer(30);
        }

        const inputValue = hiddenInput.value;
        if (inputValue.endsWith(' ') && inputValue.trim() === typedText.trim()) { // User completed a word
            const words = inputValue.trim().split(/\s+/);
            const lastWord = words[words.length - 1];
            if (currentWords.includes(lastWord)) { // Valid word from the list
                // Move first word to the end to simulate continuous text
                currentWords.push(currentWords.shift());
                sampleText = currentWords.slice(0, visibleWordCount).join(' ');
                hiddenInput.value = "";
                typedText = "";
                updateTextDisplay();
            }
        } else {
            typedText = inputValue;
            updateTextDisplay();
        }
    });

    function updateTextDisplay() {
        // Convert the current sample text into spans for each character
        chars = sampleText.split('').map(char => `<span class="char">${char}</span>`);
        textDisplay.innerHTML = chars.join('') + `<span class="cursor"></span>`; // Append cursor at the end
        charSpans = document.querySelectorAll('#text-display .char'); // Update charSpans to include newly generated spans
    
        typedText.split('').forEach((char, idx) => {
            charSpans[idx].classList.add('typed');
            if (char === sampleText[idx]) {
                charSpans[idx].classList.add('correct');
            } else {
                charSpans[idx].classList.add('incorrect');
            }
        });
    
        // Ensure the cursor is correctly placed
        const cursorPosition = typedText.length - 1;
        if (cursorPosition < charSpans.length) {
            // Remove existing cursor if any
            const existingCursor = document.querySelector('.cursor');
            if (existingCursor) {
                existingCursor.classList.remove('cursor');
            }
            // Add cursor class to the next character in the sequence
            charSpans[cursorPosition].classList.add('cursor');
        }
    }

    // TODO: Rework logic for calculating results
    function calculateResults() {
        const elapsedTime = (new Date() - startTime) / 60000; // minutes
        const wordsTyped = typedText.trim().split(/\s+/).length;
        const speed = Math.round((wordsTyped / elapsedTime) || 0);
        const accuracy = (100 - (errorsMade / typedText.length) * 100).toFixed(2);

        speedDisplay.textContent = `${speed}`;
        accuracyDisplay.textContent = `${accuracy}`;
        errorDisplay.textContent = `${errorsMade}`;
    }
});
