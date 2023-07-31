# Changelog

All notable changes to this project will be documented in this file.

## [v3.0.0] - ?

### Changed

- Eliminate table row - and column header flickering while scrolling:

  - remove method MobileLayout.pageHeaderOffset

- Improve code readability:

  - rename ViewModel.tableScroller to ViewModel.tableScrollContainer;
  - replace Window methods getWidth, setWidth, getHeight, setHeight with getSize, setSize;
  - rename ScrollContainer methods getOffsetX, getOffsetY to getInnerOffsetX, getInnerOffsetY;
  - replace ScrollContainer methods getHeight, getWidth with getSize, setSize;
  - replace ScrollContainer methods getLeft, getTop, scrollTo with getScroller, setScroller;
  - remove ScrollContainer methods: init, resizeViewportWidth, resizeViewportHeight.

## [v2.0.0] - 2023-06-12

### Added

- Incorporate view customization capabilities.

### Changed

- Improve code readability:

  - rename OptionsWindow to PopupWindow;
  - rename createOptionsWindow to createPopupWindow.

- Enhance the comprehensibility of the user documentation.

## [v1.1.0] - 2023-05-11

### Changed

- Create fittable-angular demo app and present main source code in user docs.
