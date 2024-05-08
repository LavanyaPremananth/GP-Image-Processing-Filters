## Image Processing Filters Project

This project demonstrates various image processing filters using p5.js library. The filters include:

- **Sepia Filter**: Converts the image into a sepia-toned version.
- **Vignetting (Dark Corners)**: Creates a darkening effect towards the corners of the image.
- **Radial Blur Filter**: Applies a blur effect based on the distance from a specified point (in this case, the mouse position).
- **Border Filter**: Adds a decorative border with rounded corners around the image.
- **Other Filters (On Key Press)**: Additional filters like Negative, Red, Green, and Blue channel filters, which can be applied using keyboard inputs.

### Instructions

1. **Loading an Image**:
   - The project loads an image of a husky and applies a default set of filters (Sepia, Dark Corners, Radial Blur, and Border) on one side of the canvas.

2. **Filter Controls**:
   - **Down Arrow Key**: Apply a Negative filter.
   - **Up Arrow Key**: Apply a Radial Blur filter.
   - **R Key**: Apply a Red Channel filter.
   - **G Key**: Apply a Green Channel filter.
   - **B Key**: Apply a Blue Channel filter.

3. **Additional Notes**:
   - The Radial Blur filter's effect changes based on the mouse position. Click on the desired point of the image to set the center for the blur effect.
   - The `preload()` function is used to reload the original image each time a new filter is applied, ensuring the original image is used for subsequent transformations.

### Usage

1. Clone this repository.
2. Open `index.html` in a web browser to view the image processing project.
3. Use the specified keyboard shortcuts to apply different filters and observe the effects on the image.

### Technologies Used

- **p5.js**: A JavaScript library for creative coding and visualization.
- **HTML/CSS**: Used for web page structure and styling.

### Files Included

- `index.html`: Main HTML file containing the canvas and script links.
- `sketch.js`: The p5.js script containing the image processing filters.
- `assets/husky.jpg`: Image file used for processing.
