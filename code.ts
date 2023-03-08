// // This plugin creates 5 rectangles on the screen.
// const numberOfRectangles = 5

// // This file holds the main code for the plugins. It has access to the *document*.
// // You can access browser APIs such as the network by creating a UI which contains
// // a full browser environment (see documentation).

// const nodes: SceneNode[] = [];
// for (let i = 0; i < numberOfRectangles; i++) {
//   const rect = figma.createRectangle();
//   rect.x = i * 150;
//   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//   figma.currentPage.appendChild(rect);
//   nodes.push(rect);
// }
// figma.currentPage.selection = nodes;
// figma.viewport.scrollAndZoomIntoView(nodes);




// Get all color styles in the current document
let colorStyles = figma.getLocalPaintStyles();

// Create a new frame for the swatches
let swatchFrame = figma.createFrame();
swatchFrame.name = "Color Swatches";
swatchFrame.layoutMode = "HORIZONTAL";
swatchFrame.itemSpacing = 8;
swatchFrame.paddingLeft = 8;
swatchFrame.paddingRight = 8;
swatchFrame.paddingTop = 8;
swatchFrame.paddingBottom = 8;

// Loop through each color style and create a rectangle with that fill
for (let style of colorStyles) {
  // Create a new rectangle
  let rect = figma.createRectangle();
  rect.resize(64, 64);
  rect.fills = [style.paints[0]];

  // Add the rectangle to the frame
  swatchFrame.appendChild(rect);

  // Load the font inter
  figma.loadFontAsync({ family: "Inter", style: "Regular" }).then(() => {
    // Create a text label with the name of the color style
    // Create a text label with the name and value of the color style
    let label = figma.createText();
    label.characters =
      style.name +
      "\n" +
      JSON.stringify(style.paints[0]).replace(/"/g, "");

    // Add some formatting to the text label
    label.fontSize = 12;
    label.textAlignHorizontal = "CENTER";
    label.textAlignVertical = "TOP";
    label.resize(64, 32);

    // Add the text label below the rectangle
    // console.log(label);
    swatchFrame.appendChild(label);
  })

}

// Resize and center the frame on the canvas
swatchFrame.resizeWithoutConstraints(500, 100);

swatchFrame.x =
  (figma.viewport.center.x - swatchFrame.width / 2);
swatchFrame.y =
  (figma.viewport.center.y - swatchFrame.height / 2);


// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
// figma.closePlugin();
