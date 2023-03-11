// Create a color cell object that contains a string for the color role, a string for the color state and a string for the color value
interface colorCell {
  fillStyleId: string;
  colorRole: string;
  colorState: string;
  // color value is an array
  colorValue: Paint[];
}

// Create an empty object to store the color table that stores colorCell objects
let colorTable: { [key: string]: { [key: string]: colorCell } } = {};

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

    // First part of the name before the slash is the theme name, we don't need it - Light/Surface/Success/Secondary
    // Second part of the name before the slash is the color role - Light/Surface/Success/Secondary
    let colorRole = style.name.split("/")[1];

    // Use split to join all the parts after the first slash together - Light/Surface/Success/Secondary
    // Remove all spaces from the string - LightSurfaceSuccessSecondary
    let colorState = style.name.split("/").slice(2).join(" - ");

    if (colorTable[colorRole] === undefined) {
      colorTable[colorRole] = {}
    }

    // Create a new color cell object
    let colorCell: colorCell = {
      fillStyleId: style.id,
      colorRole: colorRole,
      colorState: colorState,
      colorValue: [style.paints[0]]
    };

    // Add the color cell object to the color table
    colorTable[colorRole][colorState] = colorCell;
    // }

  }

  /**
   * Create the column header of labels
   */
  let headerColumn = figma.createFrame();
  headerColumn.name = "Column Header";
  headerColumn.layoutMode = "VERTICAL";
  headerColumn.itemSpacing = 8;
  headerColumn.paddingLeft = 8;
  headerColumn.paddingRight = 8;
  headerColumn.paddingTop = 40;
  headerColumn.paddingBottom = 8;
  headerColumn.counterAxisSizingMode = "AUTO";
  swatches.appendChild(headerColumn);

  // Loop through the color table and create a column of text labels with the names of all the color states
  for (let colorRole in colorTable) {
    // Create a column of text labels with the names of all the color states
    let columnLabel = figma.createText();
    columnLabel.characters = colorRole;
    columnLabel.fontSize = 16;
    columnLabel.textAlignHorizontal = "CENTER";
    columnLabel.textAlignVertical = "TOP";
    columnLabel.resize(100, 64);

    // Add the label to the header column
    headerColumn.appendChild(columnLabel);
  }

  /**
   * Create another column for each color state, 
   * but the first cell is just the label
   */
  for (let colorRole in colorTable) {
    for (let colorState in colorTable[colorRole]) {

      // If the first time the color role found, create a column and a label
      if (!swatches.findOne(n => n.name === colorTable[colorRole][colorState].colorState)) {

        // Create the column for the color role
        let col = figma.createFrame();
        col.name = colorTable[colorRole][colorState].colorState;
        col.layoutMode = "VERTICAL";
        col.itemSpacing = 8;
        col.paddingLeft = 8;
        col.paddingRight = 8;
        col.paddingTop = 8;
        col.paddingBottom = 8;
        col.counterAxisSizingMode = "AUTO";
        swatches.appendChild(col);

        // Create the column heading
        let columnLabel = figma.createText();
        columnLabel.characters = colorState;
        columnLabel.fontSize = 16;
        columnLabel.textAlignHorizontal = "CENTER";
        columnLabel.textAlignVertical = "TOP";

        // Add the label to the header row
        col.appendChild(columnLabel);
      }
    }
  }

  for (let col in swatches.children) {
    for (let colorRole in colorTable) {
      let swatchFrame = figma.createFrame();
      swatchFrame.name = "swatch";
      swatchFrame.layoutMode = "VERTICAL";
      swatchFrame.itemSpacing = 8;
      // Align the swatch frame to the center
      swatchFrame.counterAxisSizingMode = "AUTO";


      // Create a new rectangle
      let rect = figma.createRectangle();
      rect.name = `${colorRole} - ${swatches.children[col].name}`;
      rect.resize(64, 64);
      // Set the rectangle fill to a grey color
      // rect.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
      if(colorTable[colorRole][swatches.children[col].name]) rect.fillStyleId = colorTable[colorRole][swatches.children[col].name].fillStyleId;

      swatchFrame.appendChild(rect);

      swatches.children[col].appendChild(swatchFrame);
    }
  }

  // Final color table console log
  console.log("Final color table");
  console.log(colorTable);

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