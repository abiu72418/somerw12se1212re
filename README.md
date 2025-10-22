# somerw12se1212re - SEC Share Data Viewer

A lightweight, static web application designed to fetch, process, and display data on outstanding common stock shares from the U.S. Securities and Exchange Commission (SEC) EDGAR API.

## Features

-   **Dynamic Data Fetching**: Retrieves share data for any publicly traded company using its CIK (Central Index Key).
-   **Historical Analysis**: Filters and displays the maximum and minimum number of outstanding shares reported in fiscal years after 2020.
-   **Default View**: Loads data for American Electric Power (CIK: 0000004904) by default.
-   **URL-based Queries**: Easily view data for other companies by providing a CIK in the URL (e.g., `index.html?CIK=0001018724`).
-   **Modern UI**: Clean, responsive, and visually appealing interface for clear data presentation.
-   **Zero Dependencies**: Built with vanilla HTML, CSS, and JavaScript. No frameworks or libraries needed.

## How to Use

1.  **Local Setup**:
    -   Clone or download the repository.
    -   Open the `index.html` file in any modern web browser.

2.  **Viewing Company Data**:
    -   **Default**: By default, the application displays data for American Electric Power.
    -   **Other Companies**: To view data for a different company, add a `CIK` query parameter to the URL. The CIK must be a 10-digit number.

    **Example:**
    To view data for Apple Inc. (CIK: 0000320193), use the following URL:
    `.../index.html?CIK=0000320193`

## Project Structure

```
.
├── README.md         # This file
├── data.json         # Pre-fetched data for the default company (AEP)
├── index.html        # The main application page
├── uid.txt           # Project unique identifier
├── css/
│   └── style.css     # Stylesheet for the application
└── js/
    └── app.js        # Core application logic
```

## Technical Details

-   **Data Source**: The application fetches data directly from the SEC's `companyconcept` API endpoint.
-   **API Usage**: In compliance with SEC guidelines, all API requests include a descriptive `User-Agent` header.
-   **CORS Handling**: As the SEC API does not provide CORS headers for client-side browser requests, the application uses a public CORS proxy (`corsproxy.io`) to facilitate communication. This is a known limitation of direct browser-to-API interaction for this data source.
