sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes a new note into the input field
    Note right of browser: User clicks "Save"

    Note right of browser: Browser sends the form (HTTP POST)
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note\npayload: note=<user input>
    activate server
    Note right of server: Server stores the new note (e.g., in memory / database)
    server-->>browser: HTTP 302 Redirect to /exampleapp/notes
    deactivate server

    Note right of browser: Browser follows the redirect and reloads the notes page
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: Browser executes JS that fetches updated notes as JSON
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "...new note...", "date": "..." }, ... ]
    deactivate server

    Note right of browser: Browser renders the updated list of notes
