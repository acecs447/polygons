/*
Handles detailed mouse events from the base onMouseMove/onTouchMove.
*/
(function(exports){

	// Definition of mouse struct.
	// Contains position vector and a LMB-down boolean.
	var Mouse = {
		x: 0,
		y: 0,
		pressed: false
	};
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
	//If triggered, LMB must be pressed.
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
