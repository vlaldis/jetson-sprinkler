# Screenshot Guide

This document provides instructions for capturing screenshots for the user manual.

## Required Screenshots

Navigate to `http://192.168.50.102:5173` and capture the following screenshots:

### 1. Login Page (`login.png`)
- Navigate to the login page
- Ensure the page is fully loaded
- Capture the entire login form
- Save as: `docs/screenshots/login.png`

### 2. Dashboard (`dashboard.png`)
- Log in to the application
- Navigate to the Dashboard
- Ensure at least 2-3 routines are visible
- Capture the full dashboard view
- Save as: `docs/screenshots/dashboard.png`

### 3. Valves List (`valves-list.png`)
- Navigate to Settings page
- Show the table with configured valves
- Ensure multiple valves are visible with different statuses
- Save as: `docs/screenshots/valves-list.png`

### 4. Edit Valve Dialog (`edit-valve.png`)
- Click Edit on any valve
- Capture the edit dialog with all fields visible
- Save as: `docs/screenshots/edit-valve.png`

### 5. Create Routine Dialog (`create-routine.png`)
- Click "Add Routine" button on Dashboard
- Capture the full routine creation dialog
- Ensure all fields are visible (name, time, days, valves, etc.)
- Save as: `docs/screenshots/create-routine.png`

### 6. Active and Disabled Routines Sections (`routines-sections.png`)
- On Dashboard, ensure you have both active and disabled routines
- Capture both sections showing the separation
- Save as: `docs/screenshots/routines-sections.png`

### 7. Drag and Drop (`drag-drop.png`)
- Start dragging a routine card
- Capture the moment when the drop zone is highlighted (green or red border)
- Save as: `docs/screenshots/drag-drop.png`

### 8. Edit Routine Button (`edit-routine-button.png`)
- Capture a routine card with the Edit button highlighted
- Save as: `docs/screenshots/edit-routine-button.png`

### 9. Run Now Button (`run-now.png`)
- Capture a routine card with the Play button (green) highlighted
- Save as: `docs/screenshots/run-now.png`

## Screenshot Tips

- Use a resolution of at least 1920x1080
- Capture in PNG format for best quality
- Ensure text is readable
- Include relevant UI elements but crop unnecessary whitespace
- Use browser's screenshot tool or tools like:
  - Windows: Snipping Tool or Win+Shift+S
  - Mac: Cmd+Shift+4
  - Linux: Screenshot utility or Flameshot

## After Capturing Screenshots

1. Place all screenshots in the `docs/screenshots/` directory
2. Verify all filenames match those referenced in `USER_MANUAL.md`
3. Commit the screenshots to the repository:
   ```bash
   git add docs/screenshots/*.png
   git commit -m "docs: add user manual screenshots"
   git push
   ```
