document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const results = document.getElementById('results');
    const speedDisplay = document.getElementById('speed');
    const accuracyDisplay = document.getElementById('accuracy');
    const errorDisplay = document.getElementById('error-count');
    const timerDisplay = document.getElementById('timer');

    const wordBank = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "hot", "but", "some", "what", "there", "we", "can", "out", "other", "were", "all", "your", "when", "up", "use", "word", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "would", "write", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "my", "sound", "no", "most", "number", "who", "over", "know", "water", "than", "call", "first", "people", "may", "down", "side", "been", "now", "find", "any", "new", "work", "part", "take", "get", "place", "made", "live", "where", "after", "back", "little", "only", "round", "man", "year", "came", "show", "every", "good", "me", "give", "our", "under", "name", "very", "through", "just", "form", "much", "great", "think", "say", "help", "low", "line", "before", "turn", "cause", "same", "mean", "differ", "move", "right", "boy", "old", "too", "does", "tell", "sentence", "set", "three", "want", "air", "well", "also", "play", "small", "end", "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind", "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother", "world", "near", "build", "self", "earth", "father"]

    let sampleText = shuffleWords(wordBank).join(' ');
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
        return words.slice(0, 10);
    }

    function startTimer(duration) {
        let timeRemaining = duration;
        timerDisplay.textContent = timeRemaining;
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

        if (typedText.length < hiddenInput.value.length) {  // Only consider errors on new input, not on backspace
            let newCharIndex = hiddenInput.value.length - 1;
            if (newCharIndex < sampleText.length && hiddenInput.value[newCharIndex] !== sampleText[newCharIndex]) {
                errorsMade++;
            }
        }
        typedText = hiddenInput.value;
        
        updateTextDisplay();
        calculateResults();
    });

    function updateTextDisplay() {
        charSpans.forEach((span, idx) => {
            span.classList.remove('typed', 'correct', 'incorrect', 'cursor');
            // Handling typing and cursor visibility
            if (idx === 0 && typedText.length === 0) {
                span.classList.add('cursor'); // Show initial cursor only if no text has been typed
            } else if (idx > 0 && idx <= typedText.length) {
                span.classList.add('typed');
                span.classList.add(typedText[idx - 1] === sampleText[idx - 1] ? 'correct' : 'incorrect');
            }
        });

        // Dynamically add cursor to the last typed character
        if (typedText.length > 0 && typedText.length < sampleText.length) {
            charSpans[typedText.length].classList.add('cursor');  // Move cursor to new position after typing starts
        }
    }

    function calculateResults() {
        const elapsedTime = (new Date() - startTime) / 60000; // minutes
        const wordsTyped = typedText.trim().split(/\s+/).length;
        const speed = Math.round((wordsTyped / elapsedTime) || 0);
        const accuracy = (100 - (errorsMade / typedText.length) * 100).toFixed(2);

        // Display results if the entire text has been typed
        if (typedText.length >= sampleText.length) {
            speedDisplay.textContent = `${speed}`;
            accuracyDisplay.textContent = `${accuracy}`;
            errorDisplay.textContent = `${errorsMade}`;
            results.classList.remove('hidden');
        }
    }

    hiddenInput.addEventListener('blur', () => {
        document.body.removeChild(hiddenInput);
    });
});
