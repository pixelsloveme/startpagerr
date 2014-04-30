/* Javascript file */

/* Functions
--------------------------------------------------*/

/*-----------------------------------------------------------------------*/
/* Function that renders the grid used to place the icons                */
/* -- Parameters: --                                                     */
/*  columnNumber - Number of columns in the grid - must be an odd number */                                                         
/*  rowNumber - Number of rows in the grid - must be an odd number       */
/*                                           (so there is a center box)  */
/*  gridContents - string that contains the grid contents                */
/*                 in the format: xCoordinate/yCoordinate/iconName       */
/*                 (Having the center box as the referencial's origin,   */
/*                  and a space between different icons on the string)   */  
/*-----------------------------------------------------------------------*/
function renderGrid(columnNumber, rowNumber, gridContents){

  /* Vars used for printing!
  -----------------------------------------*/

  //Sizes and calculations
  var grid_width = ( columnNumber * box_width ) + ( columnNumber * box_margin );
  var grid_height = ( rowNumber * box_height ) + ( rowNumber * box_margin );
  var boxes_to_print = columnNumber * rowNumber;

  //DOM element strings
  var grid_container_string = '<div class="grid-container"></div>';
  var box_string = '<div class="box"></div>';
  var indicator_box_string = '<div class="indicator-box"></div>';
  var searchbox_string = '<div class="google-search-container"> <div class="google-search-logo"> <img src="img/google-logo.png" alt="Google"> </div> <div class="google-search-form"> <form method="get" action="https://www.google.com/search"> <div class="input-append"> <input id="appendedInputButton" type="text" name="q" maxlength="255" value="" autocomplete="off"> <button class="btn btn-warning" type="submit"> <i class="icon-search icon-white"></i> </button> </div> </form> </div> </div>';


  /* Printing the grid! 
  -----------------------------------------*/

  /*
  Drawing the grid-container on the browser
  */

  // Printing the grid-container
  $( "body" ).append( grid_container_string );

  //Adding css to the grid-container
  $( ".grid-container").css({
    "position": 'absolute',
    "width": grid_width,
    "height": grid_height,
    "top": '50%',
    "left": '50%',
    "margin-top": -( grid_height / 2 ),
    "margin-left": -( grid_width / 2 ),
    "z-index": '-2'
  });

  //Hiding the grid-container so the user doesn't see anything while it is printed
  $(".grid-container").fadeTo(0, 0);

  if( gridContents ){ //If gridContents isn't empty

    //Checking the contents in the contents parameter

    gridContents = gridContents.split(' '); //gridContents is now ["xCoordinate/yCoordinate/iconName", "xCoordinate/yCoordinate/iconName", ...]

    //Now we are going to put the icons in this format: ["icon name", "position of the box counting from top left"]

    for( var element in gridContents ){
      gridContents[element] = gridContents[element].split("/"); //gridContents is now [ ["xCoordinate", "yCoordinate", "iconName"], ["xCoordinate", "yCoordinate", "iconName"], ...]

      //Coordinates relative to center
      var x_coordinate_center_relative = parseInt( gridContents[element][0].slice(1), 10);
      var y_coordinate_center_relative = (rowNumber % 2 === 0) ? //If the number of rows is even, we add 1 to the y coordinate!
        parseInt( gridContents[element][1].slice(1), 10) +1 : parseInt( gridContents[element][1].slice(1), 10);

      //If the coordinates (relative to center) are positioned outside the grid, we make them 0 to avoid bugs
      if( 
        Math.abs(x_coordinate_center_relative) > Math.floor( columnNumber / 2 )
     || Math.abs(y_coordinate_center_relative) > Math.floor( rowNumber / 2) 
       ){
        x_coordinate_center_relative = 0;
        y_coordinate_center_relative = 0;
      }
      
      //Coordinates relative to grid top left corner
      var x_coordinate = Math.ceil( columnNumber / 2 ) + x_coordinate_center_relative;
      var y_coordinate = Math.ceil( rowNumber / 2 ) + y_coordinate_center_relative;

      var position = columnNumber * (y_coordinate - 1) + x_coordinate;
      var icon_name = gridContents[element][2];

      gridContents[element] = [position, icon_name]; //gridContents is now [ ["icon position (counting from top left)", "icon name"], ["position", "icon name"], ...]
    }//For end

  }//If end
  
  //Calculating position of the indicator boxes (that sit behind the search)
  var indicator_position = [];
  indicator_position[0] = columnNumber * Math.floor( rowNumber / 2 ) - Math.floor( columnNumber / 2 ) - 2 ;
  indicator_position[1] = indicator_position[0] + columnNumber;

  //Now we find out which elements to print and print them
  for( var i = 1; i <= boxes_to_print; i++){

    //is it an indicator box?
    if(
        i == indicator_position[0] 
        || i == indicator_position[1] 
        || i == indicator_position[0] + 1 
        || i == indicator_position[0] + 2
        || i == indicator_position[0] + 3
        || i == indicator_position[0] + 4
        || i == indicator_position[1] + 1
        || i == indicator_position[1] + 2
        || i == indicator_position[1] + 3
        || i == indicator_position[1] + 4    
    ){

      $( ".grid-container" ).append( indicator_box_string );

    }else{

      if( gridContents ){ //If gridContents isn't empty

        //Is it any of the icons in the array?
        for(var element in gridContents){

          if( i == gridContents[element][0]){

            /* Print the icon! */
            var icon_toprint_name = gridContents[element][1];

            $( ".grid-container" ).append(
              '<div class="draggable-icon_ongrid ' + icon_toprint_name + '"> <a class="icon_href" href="' + icons[ icon_toprint_name ].url + '"></a> <img class="box-icon-image" src="' + icons[ icon_toprint_name ].icon_url + '" alt="' + icons[ icon_toprint_name ].text + '"> <p class="box-icon-text">' + icons[ icon_toprint_name ].text + '</p> </div>'
            );

            //Now we determine how big the icon's text is, and set its font-size accordingly
            var icon_text_length = icons[icon_toprint_name].text.length;

            // Adding the CSS to the icon
            if(icon_text_length <= box_char_size_big){

              $("." + icons[icon_toprint_name].name + " p").css({
                "line-height": box_font_size_big,
                "font-size": box_font_size_big
              });

            }else if(icon_text_length <= box_char_size_medium){

              $("." + icons[icon_toprint_name].name + " p").css({
                "line-height": box_font_size_medium,
                "font-size": box_font_size_medium
              });

            }else if(icon_text_length <= box_char_size_small){

              $("." + icons[icon_toprint_name].name + " p").css({
                "line-height": box_font_size_small,
                "font-size": box_font_size_small
              });

            }else{

              $("." + icons[icon_toprint_name].name + " p").css({
                "display": 'none'
              });

            }

            //Signal that an icon was printed so a box isn't printed afterwards
            var was_icon_printed = true;
          }
        }
      }//If gridContents

      //Is it a box?
      if( !was_icon_printed ){
        $( ".grid-container" ).append( box_string );
      }else{
        was_icon_printed = false;
      }

    }//End of else

  }//For loop end

  /* Applying css to everything and fading in the grid-container */

  $( ".draggable-icon_ongrid").css({
    "position": 'relative',
    "display": 'inline-block',
    "width": box_width,
    "height": box_height,
    "border-radius": '5px',
    "margin": ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px',
    "z-index": '-1'
  });

  $(".box-icon-image").css({
    "width": box_image_width,
    "height": box_image_height
  });

  $( ".box").css({
    "display": 'inline-block',
    "width": box_width,
    "height": box_height,
    //"background-color": box_background_color,
    "border-radius": '5px',
    "margin": ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px',
    "z-index": '-1'
  });

  $( ".indicator-box").css({
    "display": 'inline-block',
    "width": box_width,
    "height": box_height,
    //"background-color": indicator_box_background_color,
    "border-radius": '5px',
    "margin": ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px',
    "z-index": '-1'
  });

  //Fading in the grid container
  $(".grid-container").fadeTo(400, 1);

  /* Finally, we print and fade in the search box: */

  //Getting the position of the first black box (so that we know where to place the search box)
  var search_box_offset = $(".indicator-box:first").offset();

  $(searchbox_string)
  //Adding some css to position it correctly
    .css({
      "position": 'absolute',
      "top": search_box_offset.top,
      "left": '50%',
      "margin-left": '-195px'
    })
  // Sets the style of the element to "display:none"
    .hide()
  // Appends the hidden elements to the "posts" element
    .appendTo('.grid-container')
  // Fades the new content into view
    .fadeIn();

}; // End of renderGrid();

// Function that finishes rendering the menu from where the icons are chosen
// (completes the already present html structure)
function renderBoxMenu(){

  /* Setting the width of the icon container */
  updateIconContainerWidth();

  //Adding the "perfect" scrollbar to the menu div
  //(The css for it is set below the css for the menu as of press release time)
  $(".box-menu").perfectScrollbar({ useBothWheelAxes: true, wheelSpeed: 20 });

  $(".ps-scrollbar-x-rail").css({
    "height": '15px',
    "margin-right": '20px',
    "background-color": menu_scrollbar_rail_color
  });

  $(".ps-scrollbar-x").css({
    "height": '15px',
    "background-color": menu_scrollbar_color
  });

  $(".ps-scrollbar-y, .ps-scrollbar-y-rail").css({
    'display': 'none'
  });

};// End of renderBoxMenu();

/* 
  Function that renders the icons on the menu:
    - doesn't render icons that are already on the grid.
    - filters the icons rendered depending on the search term entered in the search input.
*/
function renderIcons(){
  //If it is not present in the icon menu yet, render the custom icon adder
  if(! $(".custom-icon-adder").length ){
    var custom_icon_adder_string = '<div class="custom-icon-adder"> <a href="#" onclick="toggleIconAdder();"> <img src="img/custom_icon_adder.png" alt="Add a custom icon"> </a> </div>';

    $(".box-menu-icon-container").append(custom_icon_adder_string);

    $(".custom-icon-adder").css({
      "display": 'inline-block',
      "width": box_width,
      "height": box_height,
      "border-radius": '5px',
      "margin": box_margin / 2
    });
  }//If end

  //Getting the search input from the search box. If it's empty, we'll print all the icons
  var search_input = document.getElementById('search-box-input').value.toLowerCase().split(' ').join('');

  //First we empty the icons menu
  $( ".draggable-icon" ).each(function( index, object ){
    $(object).replaceWith('');
  });

  //Update the width of the icon container, so that the icons will arrange correctly
  updateIconContainerWidth();

  // Copying the icons object to our own local object
  var localIcons = jQuery.extend(true, {}, icons);

  /* Find which icons are already on the grid in order not to print them */
  
  // Loop through the icons object
  for(var iconToRender in icons){

    var current_class_name = icons[iconToRender].name;

    $( ".draggable-icon_ongrid" ).each(function( index, object ) {

      //Find which icon it is by knowing its class
      if( $(object).hasClass(current_class_name) ){

        // Removing icon that is already on the grid from the localIcons object
        delete localIcons[ current_class_name ];

      }
    });
  }

  //Loop through the icons in the object and print them
  for(var iconToRender in localIcons){

    //Check if icon has a name that matches search - if search_input is empty, print every icon
    if( search_input == "" || localIcons[iconToRender].name.search( search_input ) >= 0 ){

      var isIconCustom = (localIcons[iconToRender].tags.search('custom') > -1) ? 'custom-icon' : '';
      var draggable_icon_string = '<div class="draggable-icon ' + localIcons[iconToRender].name + ' ' + isIconCustom + '"> <img class="box-icon-image" src="' + localIcons[iconToRender].icon_url + '" alt="' + localIcons[iconToRender].text + '"> <p class="box-icon-text">' + localIcons[iconToRender].text + '</p> </div>';

      $(".box-menu-icon-container").append(draggable_icon_string);

      $("." + localIcons[iconToRender].name).css({
        "display": 'inline-block',
        "width": box_width,
        "height": box_height,
        "border-radius": '5px',
        "margin": box_margin / 2
      });

      //Now we determine how big the icon's text is, and set its font-size accordingly
      var icon_text_length = localIcons[iconToRender].text.length;

      if(icon_text_length <= box_char_size_big){

        $("." + localIcons[iconToRender].name + " p").css({
          "line-height": box_font_size_big,
          "font-size": box_font_size_big
        });

      }else if(icon_text_length <= box_char_size_medium){

        $("." + localIcons[iconToRender].name + " p").css({
          "line-height": box_font_size_medium,
          "font-size": box_font_size_medium
        });

      }else if(icon_text_length <= box_char_size_small){

        $("." + localIcons[iconToRender].name + " p").css({
          "line-height": box_font_size_small,
          "font-size": box_font_size_small
        });

      }else{

        $("." + localIcons[iconToRender].name + " p").css({
          "display": 'none'
        });

      }

    }// If end
  }// For end

  //After printing the icons, add css to all of them
  $(".box-icon-image").css({
    "position": 'relative',
    "display": 'block',
    "top": '0px',
    "margin-left": 'auto',
    "margin-right": 'auto',
    "width": box_image_width,
    "height": box_image_height,
    "border-radius": '5px',
  });

  //In the end, reset the icons' draggable status
  makeIconsDraggable();
  manageCustomIconXButtons();
  //And update the menu's scrollbar
  $(".box-menu").perfectScrollbar('update');

};//End of renderIcons();


//This function is called when icons are printed and such, so the container's width can be updated
function updateIconContainerWidth(){
  
  var vertical_icon_number = Math.floor( (parseInt($(".box-menu-icon-container").css("height"), 10) - 40) / box_height); 
  var icon_number = getIconNumber();

  $(".box-menu-icon-container").css({
    //"width": (getIconNumber() % vertical_icon_number === 0 ? Math.floor((getIconNumber() * (box_width + box_margin)) / vertical_icon_number) + 40 : Math.floor((getIconNumber() * (box_width + box_margin)) / vertical_icon_number ) + box_width + box_margin + 40)
    "width": (icon_number % vertical_icon_number === 0 ? Math.floor((icon_number * (box_width + box_margin)) / vertical_icon_number) + 40 : Math.floor((icon_number * (box_width + box_margin)) / vertical_icon_number ) + box_width + box_margin + 40)
  });

}// End of updateIconContainerWidth();


function manageIconMovements(){

  $( ".box" ).droppable({
    drop: function( event, ui ){

    /*
    Goes through the icons object and checks if there is an icon with a name equal to the class
    of the icon that was dropped. If there is, turn it into an icon of that type. 
    Don't really know how to explain it better eheh, sorry :)
    */

    var icon_current_class; // Icon class on the menu, used when an icon is dragged to the grid
    var icon_new_class;     // Icon class to be assigned when it is placed on a box
    var icon_came_from;     // Where the icon was dragged from. Can have the values "menu" or "grid"

    // For loop that detects where the icon came from
    for(var icon in icons){
      // If the icon came from the menu (has class eg. "facebook")
      if( $(ui.draggable).hasClass( icons[icon].name ) && !( $(ui.draggable).hasClass( 'draggable-icon_ongrid' ) ) ){

        icon_came_from = "menu";
        icon_current_class = icons[icon].name;
        icon_new_class = icons[icon].name;

      // If the icon came from the grid (has class "draggable-icon_ongrid")
      }else if( $(ui.draggable).hasClass( icons[icon].name ) && $(ui.draggable).hasClass( 'draggable-icon_ongrid' ) ){

        icon_came_from = "grid";
        icon_current_class = icons[icon].name;
        icon_new_class = icons[icon].name;
      }
    }

    //Determining the text size of the icon to set font height accordingly
    var icon_text_length = icons[icon_current_class].text.length;


    //Now that we know where the icon comes from, let's react according to that info:

    if( icon_came_from == "grid"){ // If the icon came from the grid

      /* First, we replace the box the icon was dropped on with the icon itself */

      $(this).replaceWith(
        '<div class="draggable-icon_ongrid ' + icon_new_class + '"> <a class="icon_href" href="' + icons[icon_current_class].url + '"></a> <img class="box-icon-image" src="' + icons[icon_current_class].icon_url + '" alt="' + icons[icon_current_class].text + '"> <p class="box-icon-text">' + icons[icon_current_class].text + '</p> </div>'
      );

      // Adding the CSS to the icon on the grid in order to keep the grid format
      $( "." + icon_new_class).css({
        "position": 'relative',
        "top": '0px',
        "display": 'inline-block',
        "width": box_width,
        "height": box_height,
        "border-radius": '5px',
        "margin": ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px',
        "z-index": '-1'
      });

      //Making the icons draggable
      makeIconsDraggable();

      /* Then, we replace the box the icon was taken from to the standard, grey box */

      $(ui.draggable).replaceWith(
        '<div class="box"></div>'
      );

      // Adding the CSS to the box div's
      $( ".box ").css({
        "display": 'inline-block',
        "width": box_width,
        "height": box_height,
        "background-color": box_background_color,
        "border-radius": '5px',
        "margin": ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px',
        "z-index": '-1'
      });

      //After replacing the icons, add css to it
      $(".box-icon-image").css({
        "position": 'relative',
        "display": 'block',
        "top": '0px',
        "margin-left": 'auto',
        "margin-right": 'auto',
        "width": box_image_width,
        "height": box_image_height,
        "border-radius": '5px',
      });

      if(icon_text_length <= box_char_size_big){

        $("." + icons[icon_current_class].name + " p").css({
          "line-height": box_font_size_big,
          "font-size": box_font_size_big
        });

      }else if(icon_text_length <= box_char_size_medium){

        $("." + icons[icon_current_class].name + " p").css({
          "line-height": box_font_size_medium,
          "font-size": box_font_size_medium
        });

      }else if(icon_text_length <= box_char_size_small){

        $("." + icons[icon_current_class].name + " p").css({
          "line-height": box_font_size_small,
          "font-size": box_font_size_small
        });

      }else{

        $("." + icons[icon_current_class].name + " p").css({
          "display": 'none'
        });

      }

      // In the end we need to set all the boxes droppable again because the newly added box isn't droppable by default
      manageIconMovements();

    }else if( icon_came_from == "menu"){ // If the icon came from the icon menu

      /* First, we replace the box the icon was dropped on with the icon */

      $(this).replaceWith(
        '<div class="draggable-icon_ongrid ' + icon_new_class + '"> <a class="icon_href" href="' + icons[icon_current_class].url + '"></a> <img class="box-icon-image" src="' + icons[icon_current_class].icon_url + '" alt="' + icons[icon_current_class].text + '"> <p class="box-icon-text">' + icons[icon_current_class].text + '</p> </div>'
        );

      // Adding the CSS to the icon on the grid in order to keep the grid format
      $( "." + icon_new_class).css({
        "position": 'relative',
        "display": 'inline-block',
        "width": box_width,
        "height": box_height,
        "border-radius": '5px',
        "margin": ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px',
        "z-index": '-1'
      });

      //After replacing the icon, add css to it
      $(".box-icon-image").css({
        "position": 'relative',
        "display": 'block',
        "top": '0px',
        "margin-left": 'auto',
        "margin-right": 'auto',
        "width": box_image_width,
        "height": box_image_height,
        "border-radius": '5px',
      });

      if(icon_text_length <= box_char_size_big){

        $("." + icons[icon_current_class].name + " p").css({
          "line-height": box_font_size_big,
          "font-size": box_font_size_big
        });

      }else if(icon_text_length <= box_char_size_medium){

        $("." + icons[icon_current_class].name + " p").css({
          "line-height": box_font_size_medium,
          "font-size": box_font_size_medium
        });

      }else if(icon_text_length <= box_char_size_small){

        $("." + icons[icon_current_class].name + " p").css({
          "line-height": box_font_size_small,
          "font-size": box_font_size_small
        });

      }else{

        $("." + icons[icon_current_class].name + " p").css({
          "display": 'none'
        });

      }

      //Making the icons draggable
      makeIconsDraggable();

      /* Then, we remove the icon that was dragged from the menu */

      $(ui.draggable).replaceWith(
        ''
      );

      /*
      I'm not sure if this should be disabled. Once I have more than one icon to work with,
      I can try to see if not disabling this is enough to allow the icon to change when another
      icon is dropped on it.

       - I will work on this later. Signed, future (past) me.

      $(this).droppable('disable');
      */

    }else{
      alert("Something went wrong. Please alert the devs. [Code x01]");
      return false;
    }

    //In the end, call the function that prints the X buttons so that they can be updated
    manageGridXButtons();
    manageCustomIconXButtons();
    //Save the grid to a cookie on icon drop
    saveGridToCookie();
  } // End of drop event
  });

} // End of manageIconMovements();

/*
   This function prints the X buttons that delete placed icons on the grid and manages the listeners so that
  something happens when the X's are clicked.

   It should be called by the other functions everytime that a change to the grid is made, 
  so that the X's can be updated accordingly.
*/
function manageGridXButtons(){

  var x_button_string = '<button class="close icons-close xbutton">&times;</button>';

  /* First, we print the X's wherever they are needed */

  //For each draggable icon on the grid
  $( ".draggable-icon_ongrid" ).each(function( index, object ) {

    // If the icon doesn't have an xbutton, add one to it
    if ( !( $( object ).find(".xbutton").length ) ){
      $( object ).append(x_button_string);
    }
  });

  //We add css to the x buttons
  $(".icons-close").css({
    "position": 'absolute',
    "top": '-5px',
    "left": box_width - 4 + "px"
  });

  /* Then, we setup jQuery to get ready for clicks on the X buttons */

  $(".icons-close").click(function(){

    $(this).parent().replaceWith(
      '<div class="box"></div>'
    ); 

    $( ".box").css({
      "display": 'inline-block',
      "width": box_width,
      "height": box_height,
      "background-color": box_background_color,
      "border-radius": '5px',
      "margin": ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px ' + ( box_margin / 2 ) + 'px',
      "z-index": '-1'
    });
    renderIcons();
    makeIconsDraggable();
    manageIconMovements(); //This last one is needed to make the new boxes droppable
    //Save the grid to a cookie on icon removal
    saveGridToCookie();
  });

}// End of manageGridXButtons();

function manageCustomIconXButtons(){

  var x_button_string = '<button class="close menu-close xbutton">&times;</button>';

  /* First, we print the X's wherever they are needed */

  //For each draggable icon on the grid
  $( ".custom-icon" ).each(function( index, object ) {

    // If the icon doesn't have an xbutton, add one to it
    if ( !( $( object ).find(".xbutton").length ) ){
      $( object ).append(x_button_string);
    }
  });

  //We add css to the x buttons
  $(".menu-close").css({
    "position": 'relative',
    "top": -box_height + 'px',
    "left": "8px"
  });

  /* Then, we setup jQuery to get ready for clicks on the X buttons */
  $(".menu-close").click(function(){
    //Get array with all the classes of the object
    var classList = $(this).parent().attr('class').split(/\s+/);
    //Replace object with nicles
    $(this).parent().replaceWith(''); 
    //Delete the custom icon that has the same name as the second class of the object
    deleteCustomIcon(classList[1]);
  });

}// End of manageCustomIconXButtons();

function makeIconsDraggable(){

  $( ".draggable-icon" ).draggable({
    containment: "window",
    helper: function(){
      $copy = $(this).clone();
      return $copy;
    },
    zIndex: 100,
    appendTo: 'body',
    scroll: false,
    revert: "invalid",
    start: function( event, ui ){
      $(this).fadeTo(0, 0);
    },
    stop: function( event, ui ) {
      $(this).fadeTo(0, 1);
      //Update the menu's scrollbar
      $(".box-menu").perfectScrollbar('update');
    }
  });

  $( ".draggable-icon_ongrid" ).draggable({
    containment: "window",
    helper: function(){
      $copy = $(this).clone();
      return $copy;
    },
    zIndex: 100,
    appendTo: 'body',
    scroll: false,
    revert: "invalid",
    //On dragging start, hide the original and only show the helper
    start: function( event, ui ){
      $(this).fadeTo(0, 0);
    },
    //On dragging stop, show the original: this helps avoid having an invisible icon if dropping is not succesfull
    stop: function( event, ui ) {
      $(this).fadeTo(0, 1);
    }
  });

};// End of makeIconsDraggable();

//Function that starts up and manages the dragging of the menu, using the menu bar as handle
function manageMenuDragging(){

  var app_status = "locked"; //mode is locked by default - values: "locked" or "unlocked"

  //Making the menu resizable
  $(".box-menu").resizable({
    handles: {'e': '.box-menu-handle'},

    //When the user starts & stops resizing, checks menu width and changes page status accordingly
    start: function(event, ui){
      //If menu is closed on dragging start set unlocked mode
      if( $(".box-menu-handle").offset().left < 5 && app_status == "locked" ){
        onUnlockedMode();
        app_status = "unlocked";
      }else{

        //On resizing start, we have to revert the handle bar and search box to their original status
        var box_menu_left = $(".box-menu").width();

        $( ".box-menu-handle").css({
          "position": 'absolute',
          "right": 0,
          "top": '',
          "left": ''
        });

        $( ".box-menu-search").css({
          "position": 'relative',
          "top": '',
          "left": '',
          "width": ''
        });

        $(".box-menu-icon-container").css({
          "top": '0px'
        });

      }

    },

    stop: function(event, ui) {
      //If menu is closed on dragging stop set locked mode
      if( $(".box-menu-handle").offset().left < 5 && app_status == "unlocked" ){
        onLockedMode();
        app_status = "locked";
      }else{

        //On resizing stop, we fix the bar & search so they don't move if the user scrolls the icons

        var handle_offset = $(".box-menu-handle").offset();
        var search_offset = $(".box-menu-search").offset();
        var search_width = $(".box-menu-search").width();

        $(".box-menu-handle").css({
          "position": 'fixed',
          "top": handle_offset.top,
          "left": handle_offset.left
        });

        $(".box-menu-search").css({
          "position": 'fixed',
          "top": search_offset.top,
          "left": search_offset.left,
          "width": search_width
        });

        $(".box-menu-icon-container").css({
          "position": 'relative',
          "top": '45px'
        });

      }

      //If menu is open on dragging stop set unlocked mode
      if( $(".box-menu-handle").offset().left >= 5 && app_status == "locked" ){
        onUnlockedMode();
        app_status = "unlocked";
      }

      //Update the menu's scrollbar
      $(".box-menu").perfectScrollbar('update');

    }// end of stop event

  });// End of resizable()

  //Making the icons menu scroll all the way to the left when the handle is clicked, so that
  //it doesn't mess up when the user is resizing the menu
  $(".box-menu-handle").mousedown(function(){
    $( ".box-menu" ).animate({
      scrollLeft: 0
    }, 1);
  });

};//End of manageMenuDragging();

//Returns the number of icons present in the icons object
function getIconNumber(){
  var counter = 1; //Accounting for the icon_adder


  for(var icon in icons){
    counter++;
  }

  return counter;

}//End of getIconNumber();

//What to do when page enters unlocked mode
function onUnlockedMode(){
  $(".box")
    .css("background-color", box_background_color)
    .fadeTo( 500, 1);

  $(".icons-close").css('display', 'block');

  $(".draggable-icon_ongrid")
    .draggable("enable")
    .removeClass("animated-icon");

  //Make the icons unclickable
  $(".icon_href").css({
    "display": 'block',
    "width": '0px',
    "height": '0px'
  });

  //Remove fade animation
  $(".draggable-icon_ongrid").unbind('mouseenter mouseleave');
    
};//End of onUnlockedMode();

//What to do when page enters locked mode
function onLockedMode(){
  $(".box").fadeTo( 500, 0);

  $(".icons-close").css('display', 'none');

  $(".draggable-icon_ongrid")
    .draggable("disable")
    .addClass("animated-icon");

  //Make the icons clickable by giving a width and height to the <a> tag in them
  $(".icon_href").css({
    "display": 'block',
    "width": box_width,
    "height": box_height
  });

  //Add fade animation for the icons hover
  $(".animated-icon").hover(function(){
    $(this).filter(':not(:animated)').fadeTo(100, 0.7);
  }, function() {
    $(this).fadeTo(100, 1.0);
  });

};//End of onLockedMode();

//Function that freezes the page when the user resizes the browser
function manageResizing(){

  // Do nothing on window resize now

};//End of manageCookies();

//Function that sets a cookie with the elements in the grid
//And saves the layout to the database if the user is logged in
function saveGridToCookie(){

  //Array that will contain the classes of each element

  var current_element_class = [];
  var number_of_elements = -1; //Not 0, to account for the extra and last div in the grid-container: the search box
  var each_counter = 0;
  var icon_name;
  var icon_position_x;
  var icon_position_y;
  var cookie_var = "";

  //number_of_elements now equals the number of elements in grid-container minus 1
  //to account for the extra and last div in the grid-container: the search box
  $(".grid-container").children().each(function() { number_of_elements++; });

  $(".grid-container").children().each(function() {

    if( each_counter < number_of_elements){

      current_element_class = this.className.split(/\s+/);

      if( current_element_class[0] == 'draggable-icon_ongrid' ){
        //saving icon name
        icon_name = current_element_class[1];

        //saving icon y position (relative to grid center)
        icon_position_y = Math.ceil( each_counter / grid_column_number ) -1 - Math.floor( grid_row_number / 2);

        //saving icon x position
        icon_position_x = Math.round(( grid_column_number * (  ( each_counter / grid_column_number ) % 1 ) )) + 1 - Math.ceil( grid_column_number / 2 )

        //Now we add the icon to the cookie string!

        if( cookie_var != "" ){
          //If the cookie isn't empty start by adding a space
          cookie_var += " ";
        }
        cookie_var += ( "x" + icon_position_x.toString(10) + "/y" + icon_position_y.toString(10) + "/" + icon_name );
      }
      each_counter++;
    }

  });

  

};

/*-------------------------
 Main (startup) javascript
-------------------------*/

/*--- Calculating user window size and printing grid accordingly ---*/

// User's viewport's vars

var user_width = $(window).width();
var user_height = $(window).height();

// Number of columns - always an odd number so search box can be in the center
var grid_column_number = Math.floor( (user_width - box_margin) / (box_width + box_margin) );
if(/* is even */ grid_column_number % 2 === 0 ){
  grid_column_number -= 1;
}

//Number of rows
var grid_row_number = Math.floor( (user_height - box_margin) / (box_height + box_margin) );




/* Function calls */
function startUp( layout ){
  renderGrid( grid_column_number /* must be odd so there is a center box */, grid_row_number, layout /* string */);
  renderBoxMenu();
  renderIcons();
  makeIconsDraggable();
  manageIconMovements();
  manageMenuDragging();
  manageGridXButtons();
  manageCustomIconXButtons();
  manageResizing();
  onLockedMode();
  

  //for the Custom Icon Adder

  //Positioning the error message for logged out users
  $("#icon_adder-error").css('top', $(".custom-icon-adder").offset().top + "px");

  //Getting the top offset for the popup
  window.iconAdderTopOffset = $(".custom-icon-adder").offset().top + "px";
}