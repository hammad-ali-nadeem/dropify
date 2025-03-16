// script.js
$(document).ready(function () {
    let selectedElement = null;
    // Make sidebar elements draggable
    $(".element").draggable({
      helper: "clone",
      revert: "invalid",
    });
  
    // Make playground a droppable area
    $("#playground").droppable({
      accept: ".element",
      drop: function (event, ui) {
        const type = ui.draggable.data("type");
        const element = createElement(type);
        $(this).append(element);
        makeElementDraggable(element);
      },
    });
  
    // Function to create elements
    function createElement(type) {
        let element;
        switch (type) {
          case "text":
            element = $("<div>")
              .addClass("draggable text-element")
              .text("New Text")
              .data("properties", {
                text: "New Text", // Default text
                fontSize: 16, // Default font size
                bold: false, // Default bold state
                italic: false, // Default italic state
                underline: false, // Default underline state
              });
            break;
          case "image":
            element = $("<div>")
              .addClass("draggable image-element")
              .text("🖼️ Image")
              .data("properties", {
                src: "", // Default image source (empty string)
                width: 100, // Default width
                height: 100, // Default height
              });
            break;
          case "shape":
            element = $("<div>")
              .addClass("draggable shape-element")
              .text("🔶 Shape")
              .data("properties", {
                svgCode: "", // Default SVG code (empty string)
                width: 100, // Default width
                height: 100, // Default height
              });
            break;
        }
        return element;
      }
  
    // Make elements draggable within the playground
    function makeElementDraggable(element) {
      element.draggable({
        containment: "#playground",
        stop: function () {
          updatePropertiesPanel(element);
        },
      });
  
      // Add click event to update properties panel
      element.on("click", function () {
        if (selectedElement) {
            selectedElement.removeClass("selected"); // Remove border from the previously selected element
          }
          selectedElement = $(this); // Set the clicked element as the selected element
          selectedElement.addClass("selected"); // Add border to the selected element
          updatePropertiesPanel(selectedElement);
        });
    }
  
    // Update properties panel based on selected element
    function updatePropertiesPanel(element) {
      const type = element.hasClass("text-element")
        ? "text"
        : element.hasClass("image-element")
        ? "image"
        : "shape";
        const properties = element.data("properties");
        let propertiesHTML = "";
  
        switch (type) {
            case "text":
              propertiesHTML = `
                <div class="form-item"><label>Text:</label> <input type="text" id="text-input" value="${properties.text}"></div>
                <div class="form-item"><label>Font Size:</label> <input type="number" id="font-size" value="${properties.fontSize}"></div>
                <div class="form-item"><label><input type="checkbox" id="bold" ${properties.bold ? "checked" : ""}> Bold</label></div>
                <div class="form-item"><label><input type="checkbox" id="italic" ${properties.italic ? "checked" : ""}> Italic</label></div>
                <div class="form-item"><label><input type="checkbox" id="underline" ${properties.underline ? "checked" : ""}> Underline</label></div>
              `;
              break;
            case "image":
              propertiesHTML = `
                <div class="form-item"><label>Image Source:</label> <input type="text" id="image-src" value="${properties.src}"></div>
                <div class="form-item"><label>Width:</label> <input type="number" id="image-width" value="${properties.width}"></div>
                <div class="form-item"><label>Height:</label> <input type="number" id="image-height" value="${properties.height}"></div>
              `;
              break;
            case "shape":
              propertiesHTML = `
                <div class="form-item"><label>SVG Code:</label> <textarea id="svg-code">${properties.svgCode}</textarea></div>
                <div class="form-item"><label>Width:</label> <input type="number" id="shape-width" value="${properties.width}"></div>
                <div class="form-item"><label>Height:</label> <input type="number" id="shape-height" value="${properties.height}"></div>
              `;
              break;
      }
  
      $("#properties-content").html(propertiesHTML);
  
      // Add event listeners for property changes
      if (type === "text") {
        $("#text-input").on("input", function () {
          properties.text = $(this).val();
          element.text(properties.text);
        });
        $("#font-size").on("input", function () {
          properties.fontSize = $(this).val();
          element.css("font-size", properties.fontSize + "px");
        });
        $("#bold").on("change", function () {
          properties.bold = this.checked;
          element.css("font-weight", properties.bold ? "bold" : "normal");
        });
        $("#italic").on("change", function () {
          properties.italic = this.checked;
          element.css("font-style", properties.italic ? "italic" : "normal");
        });
        $("#underline").on("change", function () {
          properties.underline = this.checked;
          element.css("text-decoration", properties.underline ? "underline" : "none");
        });
      } else if (type === "image") {
        $("#image-src").on("input", function () {
          properties.src = $(this).val();
          element.css("background-image", `url(${properties.src})`);
          element.text(""); // Remove the default text
        });
        $("#image-width").on("input", function () {
          properties.width = $(this).val();
          element.width(properties.width);
        });
        $("#image-height").on("input", function () {
          properties.height = $(this).val();
          element.height(properties.height);
        });
      } else if (type === "shape") {
        $("#svg-code").on("input", function () {
          properties.svgCode = $(this).val();
          element.html(properties.svgCode); // Render the SVG code inside the shape element
          element.css("border", "none"); // Remove the default border
        });
        $("#shape-width").on("input", function () {
          properties.width = $(this).val();
          element.width(properties.width);
        });
        $("#shape-height").on("input", function () {
          properties.height = $(this).val();
          element.height(properties.height);
        });
      }
  
      // Save updated properties back to the element
      element.data("properties", properties);
    }
  });