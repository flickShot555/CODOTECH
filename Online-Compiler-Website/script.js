document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('codeInput');
    const languageSelect = document.getElementById('languageSelect');
    const runCodeBtn = document.getElementById('runCode');
    const output = document.getElementById('output');

    // Compiler API (Using Judge0)
    const API_URL = 'https://emkc.org/api/v2/piston/execute';

    runCodeBtn.addEventListener('click', async () => {
        const code = codeInput.value;
        const language = languageSelect.value;
        
        // Map our language choices to Piston API language identifiers.
        const languageMapping = {
            python: 'python3',
            javascript: 'javascript'
        };

        const pistonLanguage = languageMapping[language];

        if (!pistonLanguage) {
            output.textContent = 'Unsupported language selected.';
            return;
        }

        // Prepare the data payload according to Piston API requirements.
        const data = {
            language: pistonLanguage,
            version: "*",
            files: [
                {
                    name: "main",
                    content: code
                }
            ]
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
            output.textContent = result.run.output || result.run.stderr || 'No output';
        } catch (error) {
            console.error('Error executing code:', error);
            output.textContent = 'Error: Unable to execute code.';
        }
    });
});
