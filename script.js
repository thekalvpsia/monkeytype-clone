document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const results = document.getElementById('results');
    const speedDisplay = document.getElementById('speed');
    const accuracyDisplay = document.getElementById('accuracy');

    let sampleText = "The quick brown fox jumps over the lazy dog.";
    let chars = sampleText.split('').map(char => `<span class="char">${char}</span>`);
    textDisplay.innerHTML = chars.join('');
    let charSpans = document.querySelectorAll('.char');

    let startTime;
    let typedText = "";

    // Create and focus a hidden input to capture keystrokes
    const hiddenInput = document.createElement('textarea');
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.opacity = '0';
    document.body.appendChild(hiddenInput);
    hiddenInput.focus();

    hiddenInput.addEventListener('input', () => {
        if (!startTime) {
            startTime = new Date();
        }
        typedText = hiddenInput.value;
        updateTextDisplay();
        calculateResults();
    });

    function updateTextDisplay() {
        charSpans.forEach((span, idx) => {
            span.classList.remove('typed', 'correct', 'incorrect', 'cursor');
            if (idx < typedText.length) {
                span.classList.add('typed');
                span.classList.add(typedText[idx] === sampleText[idx] ? 'correct' : 'incorrect');
            }
            if (idx === typedText.length - 1) {
                span.classList.add('cursor');
            }
        });
        if (typedText.length === sampleText.length) {
            charSpans[charSpans.length - 1].classList.remove('cursor');  // Remove cursor at end of text
        }
    }

    function calculateResults() {
        const elapsedTime = (new Date() - startTime) / 60000; // minutes
        const wordsTyped = typedText.trim().split(/\s+/).length;
        const speed = Math.round((wordsTyped / elapsedTime) || 0);
        const correctChars = typedText.split('').filter((char, idx) => char === sampleText[idx]).length;
        const accuracy = ((correctChars / sampleText.length) * 100).toFixed(2);

        // Display results if the entire text has been typed
        if (typedText.length >= sampleText.length) {
            speedDisplay.textContent = `${speed}`;
            accuracyDisplay.textContent = `${accuracy}`;
            results.classList.remove('hidden');
        }
    }

    hiddenInput.addEventListener('blur', () => {
        document.body.removeChild(hiddenInput);
    });
});
