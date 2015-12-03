/*
Handles detailed mouse events. This is for document-level events.
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
	
	// Events!
	var onMouseMove,onTouchMove;
	
	//Mouse down event.
	//If triggered, LMB must be pressed; update state singleton accordingly
	//and pass through to onMouseMove.
	document.body.addEventListener("mousedown",function(event){
	    Mouse.pressed = true;
	    onMouseMove(event);
	},false);

	//Mouse up event.
	//If triggered, LMB must be released; update state singleton accordingly.
	document.body.addEventListener("mouseup",function(event){
	    Mouse.pressed = false;
	},false);

	//Mouse move event.
	//If triggered, mouse position has changed.
	document.body.addEventListener("mousemove",onMouseMove = function(event){
		Mouse.x = event.pageX - window.scrollX;
		Mouse.y = event.pageY - window.scrollY;
	},false);

	//Touch start event.
	//If triggered, LMB must be pressed. Pass through to onTouchMove.
	document.body.addEventListener("touchstart",function(event){
	    Mouse.pressed = true;
	    onTouchMove(event);
	},false);

	//Touch end event.
	//If triggered, LMB must be released.
	document.body.addEventListener("touchend",function(event){
	    Mouse.pressed = false;
	},false);

	//Touch move event.
	//If triggered, mouse position has changed.
	document.body.addEventListener("touchmove",onTouchMove = function(event){
		Mouse.x = event.changedTouches[0].clientX - window.scrollX;
		Mouse.y = event.changedTouches[0].clientY - window.scrollY;
	},false);

//Set this as a globally-accessible function.
})(window);
