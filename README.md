# Research Assistant Extension

This is a Chrome extension called "Research Assistant" that helps users summarize and save research notes. The backend is powered by a Spring Boot application integrated with Gemini AI for text processing.

## Features

- Summarize selected text from web pages
- Save and retrieve research notes
- AI-powered text processing using Gemini AI

## Prerequisites

- Node.js and npm
- Java 11 or higher
- build.gradle
- Chrome browser

## Frontend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/research-assistant-extension.git
    cd research-assistant-extension
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Load the extension in Chrome:
    - Open Chrome and navigate to chrome://extensions/
    - Enable "Developer mode" in the top right corner
    - Click "Load unpacked" and select the `research-assistant-extension` directory

## Backend Setup

1. Navigate to the backend directory:
    ```sh
    cd backend
    ```

2. Build the Spring Boot application:
    ```sh
    mvn clean install
    ```

3. Run the Spring Boot application:
    ```sh
    mvn spring-boot:run
    ```

## Usage

1. Open any web page in Chrome.
2. Select the text you want to summarize.
3. Click the "Research Assistant" extension icon.
4. Click the "Summarize" button to get a summary of the selected text.
5. Add notes in the "Research Notes" section and click "Save Notes" to save them.


