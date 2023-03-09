// Create a colour cell object that contains a string for the colour role, a string for the colour state and a string for the colour value
interface ColourCell {
  colourRole: string;
  colourState: string;
  // colour value is an array
  colourValue: Paint[];  
}

// Create an empty object to store the colour table that stores ColourCell objects
let colourTable: { [key: string]: { [key: string]: ColourCell } } = {};

async function main(): Promise<void> {
  let colorStyles = figma.getLocalPaintStyles();

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // Create a new frame for the swatches
  let swatches = figma.createFrame();
  swatches.name = "Color Swatches";
  swatches.layoutMode = "HORIZONTAL";
  swatches.itemSpacing = 8;
  swatches.paddingLeft = 8;
  swatches.paddingRight = 8;
  swatches.paddingTop = 8;
  swatches.paddingBottom = 8;
  swatches.counterAxisSizingMode = "AUTO";

  // Loop through each color style and create a rectangle with that fill
  for (let style of colorStyles) {
      
    // If there are no slashes in the style, skip it
    if (style.name.indexOf("/") === -1) {
      continue;
    }
   
    console.log("Create stuff for style: " + style.name);

    // First part of the name before the slash is the theme name, we don't need it - Light/Surface/Success/Secondary
    // Second part of the name before the slash is the colour role - Light/Surface/Success/Secondary
    let colourRole = style.name.split("/")[1];

    // Third and fourth part of the name before the slash is the colour state - Light/Surface/Success/Secondary
    // e.g. SuccessSecondary
    // If the third split is missing leave it blank
    let colourState = style.name.split("/")[2] || "" + style.name.split("/")[3] || "";
    // console log the state and role
    console.log(colourRole, colourState);
    
    // Check if the colour role is in the colour table
    if (colourTable[colourRole] === undefined || colourTable[colourRole][colourState] === undefined) {
      // If not, create a new object for the colour role
      colourTable[colourRole] = {};

      // Create a new colour cell object
      let colourCell: ColourCell = {
        colourRole: colourRole,
        colourState: colourState,
        colourValue: [style.paints[0]]
      };

      // Add the colour cell object to the colour table
      colourTable[colourRole][colourState] = colourCell;
    }

    // Create a swatch frame
    let swatchFrame = figma.createFrame();
    swatchFrame.name = style.name;
    swatchFrame.layoutMode = "VERTICAL";
    swatchFrame.itemSpacing = 8;
    // Align the swatch frame to the center
    swatchFrame.counterAxisSizingMode = "AUTO";

    // Create a new rectangle
    let rect = figma.createRectangle();
    rect.resize(64, 64);
    // Set the rectangle fill to the color style
    rect.fills = [style.paints[0]];

    // Add the rectangle to the frame
    swatchFrame.appendChild(rect);

    // Create a text label with the name of the color style
    // Create a text label with the name and value of the color style
    let label = figma.createText();
    label.characters = style.name;

    // Add some formatting to the text label
    label.fontSize = 12;
    label.textAlignHorizontal = "CENTER";
    label.textAlignVertical = "TOP";
    label.resize(64, 32);

    // Add the text label below the rectangle
    swatchFrame.appendChild(label);

    // Add the swatch frame to the swatches frame
    swatches.appendChild(swatchFrame);
  }

  // Final colour table console log
  console.log("Final colour table");
  console.log(colourTable);

  // Resize and center the frame on the canvas
  swatches.resizeWithoutConstraints(500, 100);

  // Center the frame on the canvas
  swatches.x =
    (figma.viewport.center.x - swatches.width / 2);
    swatches.y =
    (figma.viewport.center.y - swatches.height / 2);
}

// Run the main function and close the plugin when done
main().then(() => {
  figma.closePlugin();
});