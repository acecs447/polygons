/*
Handles detailed mouse events. This is for canvas-level events.
*/
(function(exports){

	// Definition of mouse singleton.
	// Contains position vector and a LMB-down boolean.
	var Mouse = {
		x: 0,
		y: 0,
		pressed: false
	};
	//Make it accessible outside of this script.
	exports.Mouse = Mouse;

	//Get our canvas.
	var canvas = document.getElementById("canvas");

	// Events!
	var onMouseMove,onTouchMove;

	//Add some extensions to the mouse singleton:
	//A boolean for when the cursor is over a draggable object...
	Mouse.isOverDraggable = false;
	//And a function to change the cursor graphic depending on the singleton state.
	function updateCursor(){
		//Are we over something we can drag?
		if(Mouse.isOverDraggable){
			//If so, prepare to change cursor.
			canvas.style.cursor = "";
			//Is the mouse down?
			if(Mouse.pressed){
				//If so, use the "grabbing" cursor.
				//The cursor name depends on the browser type;
				//try the most common variants.
				canvas.style.cursor = "-moz-grabbing";
				if(canvas.style.cursor=="") canvas.style.cursor="-webkit-grabbing";
				if(canvas.style.cursor=="") canvas.style.cursor="-ms-grabbing";
				if(canvas.style.cursor=="") canvas.style.cursor="-o-grabbing";
				//If none of those worked, try the generic cursor name.
				if(canvas.style.cursor=="") canvas.style.cursor="grabbing";
			}
			//Otherwise, use the "can grab" cursor.
			else{
				canvas.style.cursor = "-moz-grab";
				if(canvas.style.cursor=="") canvas.style.cursor="-webkit-grab";
				if(canvas.style.cursor=="") canvas.style.cursor="-ms-grab";
				if(canvas.style.cursor=="") canvas.style.cursor="-o-grab";
				//If none of those worked, try the generic cursor name.
				if(canvas.style.cursor=="") canvas.style.cursor="grab";
			}
		}
		//Otherwise, use the standard cursor.
		else{
			canvas.style.cursor = "";
		}
	}

	function fixPosition(){
		//Does absolutely nothing; remove any references to this outside of this file.
	}
	
	//Event handlers!
	//Mouse down event.
	//If triggered, LMB must be pressed; update state singleton accordingly
	//and pass through to onMouseMove.
	canvas.addEventListener("mousedown",function(event){
		//Update cursor graphic.
		updateCursor();
		//Update singleton state.
	    Mouse.pressed = true;
	    //Passthrough to canvas onMouseMove handler.
		onMouseMove(event);
		//Do NOT allow a default handler to get called after this.
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	//Mouse up event.
	//If triggered, LMB must be released; update state singleton accordingly.
	canvas.addEventListener("mouseup",function(event){
		//Update cursor graphic.
		updateCursor();
	    //Update singleton state.
		Mouse.pressed = false;
		//Do NOT allow a default handler to get called after this.
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	//Mouse move event.
	//If triggered, mouse position has changed.
	canvas.addEventListener("mousemove",onMouseMove = function(event){
		//Update cursor graphic.
		updateCursor();
		//Update singleton state.
		Mouse.x = event.pageX;
		Mouse.y = event.pageY;
		//Do NOT allow a default handler to get called after this.
		event.preventDefault();
	    event.stopPropagation();

	},false);

	//Touch start event.
	//If triggered, LMB must be pressed. Pass through to onTouchMove.
	canvas.addEventListener("touchstart",function(event){
	    //Update singleton state.
		Mouse.pressed = true;
		//Passthrough to canvas onTouchMove handler.
	    onTouchMove(event);
		//Do NOT allow a default handler to get called after this.
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	//Touch end event.
	//If triggered, LMB must be released.
	canvas.addEventListener("touchend",function(event){
	    //Update singleton state.
		Mouse.pressed = false;
		//Do NOT allow a default handler to get called after this.
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	//Touch move event.
	//If triggered, mouse position has changed.
	canvas.addEventListener("touchmove",onTouchMove = function(event){
		//Update singleton state.
		Mouse.x = event.changedTouches[0].clientX;
		Mouse.y = event.changedTouches[0].clientY;
		//Do NOT allow a default handler to get called after this.
		event.preventDefault();
	    event.stopPropagation();
	},false);

//Set this as a globally-accessible function.
})(window);