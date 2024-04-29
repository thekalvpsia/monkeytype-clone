document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const typingInput = document.getElementById('typing-input');
    const results = document.getElementById('results');
    const speedDisplay = document.getElementById('speed');
    const accuracyDisplay = document.getElementById('accuracy');

    // Sample text to type
    const sampleText = "The quick brown fox jumps over the lazy dog.";
    textDisplay.textContent = sampleText;

    // Start typing test
    let startTime;
    typingInput.addEventListener('input', () => {
        const typedText = typingInput.value;
        if (!startTime) {
            startTime = new Date();
        }

        // Calculate speed and accuracy
        const elapsedTime = (new Date() - startTime) / 60000; // time in minutes
        const wordCount = typedText.split(' ').length;
        const speed = Math.round(wordCount / elapsedTime);
        const typedLength = Math.min(typedText.length, sampleText.length);
        let matchCount = 0;
        for (let i = 0; i < typedLength; i++) {
            if (typedText[i] === sampleText[i]) {
                matchCount++;
            }
        }
        const accuracy = (matchCount / typedLength) * 100;

        // Display results if the entire text has been typed
        if (typedText === sampleText) {
            speedDisplay.textContent = speed + ' WPM';
            accuracyDisplay.textContent = accuracy.toFixed(2) + '%';
            results.classList.remove('hidden');
        }
    });

    // Reset test
    typingInput.addEventListener('focus', () => {
        typingInput.value = '';
        startTime = null;
        results.classList.add('hidden');
    });
});
