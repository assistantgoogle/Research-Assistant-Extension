document.addEventListener('DOMContentLoaded', () => {
    // Load saved research notes
    chrome.storage.local.get(['researchNotes'], function (result) {
        if (result.researchNotes) {
            document.getElementById('notes').value = result.researchNotes;
        }
    });

    // Attach event listeners
    document.getElementById('translateBtn').addEventListener('click', processText);
    document.getElementById('summarizeBtn').addEventListener('click', processText);
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
    document.getElementById('generateCitationBtn').addEventListener('click', generateCitation);
});

// Function to process selected text for translation and summarization
async function processText(event) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => ({ selectionText: window.getSelection().toString() })
        });

        if (!result.selectionText) {
            showResult('Please select some text first');
            return;
        }

        const targetLang = document.getElementById('languageSelect').value;
        const operations = event.target.id === 'translateBtn' ? ["translate"] : ["summarize"];
        
        // If summarization is clicked, ensure translation is also requested
        if (event.target.id === 'summarizeBtn') {
            operations.push("translate");
        }

        const response = await fetch('http://localhost:8080/api/research/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: result.selectionText, operations, language: targetLang })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${await response.text()}`);
        }

        const text = await response.text();
        showResult(text.replace(/\n/g, '<br>'));

    } catch (error) {
        showResult('Processing Error: ' + error.message);
    }
}

// Function to save notes locally
async function saveNotes() {
    const notes = document.getElementById('notes').value;
    chrome.storage.local.set({ researchNotes: notes }, function () {
        alert('Notes saved successfully');
    });
}

// Function to display results
function showResult(content) {
    document.getElementById('results').innerHTML = `<div class="result-item"><div class="result-content">${content}</div></div>`;
}

// Function to generate citations
function generateCitation() {
    const author = document.getElementById('author').value.trim();
    const title = document.getElementById('title').value.trim();
    const year = document.getElementById('year').value.trim();
    const style = document.getElementById('citationStyle').value;

    if (!author || !title || !year) {
        document.getElementById('citationResult').innerHTML = '<p style="color: red;">Please fill all fields!</p>';
        return;
    }

    let citation = "";

    switch (style) {
        case "APA":
            citation = `${author} (${year}). <i>${title}</i>.`;
            break;
        case "MLA":
            citation = `${author}. <i>${title}</i>. ${year}.`;
            break;
        case "Chicago":
            citation = `${author}. <i>${title}</i>. Published in ${year}.`;
            break;
        default:
            citation = "Invalid citation style.";
    }

    document.getElementById('citationResult').innerHTML = 
        `<p id="citationText"><strong>Citation:</strong> ${citation}</p> <button id="copyCitationBtn">Copy</button>`;

    // Attach event listener to the dynamically created button
    document.getElementById('copyCitationBtn').addEventListener('click', copyToClipboard);
}

// Function to copy citation to clipboard
function copyToClipboard() {
    const citationElement = document.querySelector('#citationText');
    
    if (!citationElement) {
        alert('No citation found to copy.');
        return;
    }

    // Extract only the citation text without "Citation:" label
    const citationText = citationElement.innerText.replace("Citation:", "").trim();

    navigator.clipboard.writeText(citationText).then(() => {
        alert('Citation copied to clipboard!');
    }).catch(err => {
        console.error('Error copying citation:', err);
    });
}
