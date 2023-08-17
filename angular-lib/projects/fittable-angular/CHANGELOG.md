# Changelog

All notable changes to this project will be documented in this file.

## [v4.0.1] - 2023-08-17

### Fixed

- Pasted styled cell does not remove target cell's style.
- When writing title case text on cell, while using shift key, the first letter dissapers.
- Toolbar font size input field cannot decrease value after set to 14.

## [v4.0.0] - 2023-07-31

### Changed

- Eliminate table row - and column header flickering while scrolling.

- Text cursor shall be displayed when mouse over input fields.

- Improve CSS development.

- Improve code readability:

  - according to fittable-core/view-model;
  - rename <fit-settings-bar> component to <fit-settingsbar>.

- Add responsive design capabilities:
  - toolbar height should increase relative to child controls;
  - enable font size scaling.

## [v3.1.0] - 2023-06-25

### Changed

- Add responsive design capabilities.

## [v3.0.0] - 2023-06-12

### Added

- Incorporate view customization capabilities.
- Add toolbar controls tooltips.
- Add padding to table cells.

### Changed

- Improve code readability:

  - rename NgxFittableModule to FittableModule;
  - rename TableViewComponent to FittableComponent

- Enhance the comprehensibility of the user documentation.

## [v2.0.0] - 2023-05-25

### Changed

- Upgrade to latest Angular version.

## [v1.1.0] - 2023-05-11

### Changed

- Create fittable-angular demo app and present main source code in user docs.
