# Face Recognition REST API

## Overview

This Flask-based REST API provides endpoints for uploading profile pictures, uploading bulk photos, and recognizing known profiles within those bulk photos using the `face_recognition` library.

It adapts the core logic from the provided script, including face detection, encoding, caching (during recognition runs), distance comparison, and categorizing faces as "Close (Main Subject)" or "Background" based on relative size.

## Features

-   **Profile Management:** Upload multiple images per profile ID.
-   **Bulk Photo Upload:** Upload photos to be scanned for faces.
-   **Face Recognition:** Trigger a process to find known profiles in the bulk photos.
-   **Configurable Parameters:** Adjust matching `tolerance` and background/foreground `std_factor` via the API call.
-   **RESTful Endpoints:** Standard API endpoints for interaction.
-   **Structured Project:** Organized codebase for maintainability.

## Project Structure