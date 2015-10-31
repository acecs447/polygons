/***
Slider UI element with three slider buttons on it.

Instantiate with:
new NSlider(dom,{

	backgrounds:[
		{color:"#cc2727"},
		{color:"#bada55"},
		{color:"#2095dc"}
	],

	values:[0.1,0.9]

});

***/
function NSlider(dom,config){
	//Setup fields.
	var self = this; //Reference to this object.
	self.dom = dom; //Reference to DOM this object is in.
	self.backgrounds = []; //The segments between slider buttons.
	self.sliders = []; //The slider buttons themselves.
	self.values = config.values; //The minimum and maximum float values represented by this slider.

	//These are for the slider itself???
	self.draggingSliderDOM = null;
	self.draggingSliderIndex = -1;

	//Setup constants.
	var kToPixels = 400;
	var kNumSliderSections = config.backgrounds.length;
	var kMaxSliderSectionIndex = kNumSliderSections - 1;
	var kNumSliderButtons = kNumSliderSections - 1;
	var kMaxSliderButtonIndex = kNumSliderButtons - 1;
	
	// Create DOM
	//All of this slider is contained in a <ds> element.
	self.dom.className = "ds";
	//Add background segments.
	for(var i=0;i<kNumSliderSections;i++){
	
		//Each background segment is contained in a <div>.
		var dom = document.createElement("div");
		dom.className = "ds_bg";
		self.dom.appendChild(dom);
		//The loop is actually referencing segments in
		//reverse order; i = 0 is the LAST segment.
		//Append segments to  list.
		self.backgrounds[kMaxSliderSectionIndex-i] = dom;
		//Set this segment's color and image to whatever
		//our config says it should be.
		dom.style.backgroundColor = config.backgrounds[kMaxSliderSectionIndex-i].color;
		dom.style.backgroundImage = "url("+config.backgrounds[kMaxSliderSectionIndex-i].icon+")";
		//If this is the last background segment,
		//set its width to the entire slider.
		if(i==0) {
			dom.style.width = "100%";
		}

	}
	//Now add slider buttons.
	for(var i=0;i<kNumSliderButtons;i++){
		//Each button is contained in a <div>.
		var dom = document.createElement("div");
		//The actual button is in a <ds_slider>.
		dom.className = "ds_slider";
		//Actually apply the new elements to the DOM.
		self.dom.appendChild(dom);
		//Add this button to the slider button list.
		self.sliders.push(dom);

		// Attach a callback to handle dragging this button.
		(function(dom,i,self){
			dom.onmousedown = function(){
				self.draggingSliderDOM = dom;
				self.draggingSliderIndex = i;
			};
		})(dom,i,self);

	}

	// Slider logic
	//Called when the slider button moves.
	function onMouseMove(x){
		//Only do anything if the button actually exists.
	    if(self.draggingSliderDOM){
			//Convert the mouse position to a slider value.
	    	var val = x/kToPixels;

			//Get the index of this button.
	    	var index = self.draggingSliderIndex;
	    	var sliderWidth = 0.025;
			var leftEdge = 0;
			var rightEdge = 1;
	    	//Is this the first button?
			if(index==0){
				leftEdge = 0 + sliderWidth/2;
				//If so, the furthest we can go right is the next 
				//slider's position (minus the slider button's width).
	    		rightEdge = self.values[index+1]-sliderWidth;
	    	}
			//Is this the last button?
			else if(index==kMaxSliderButtonIndex){
				//The furthest we can go left is the previous slider's position
				//(plus the slider button's width).
	    		leftEdge = self.values[index-1]+sliderWidth;
				//The furthest we can go right is the end of the slider.
				rightEdge = 1-sliderWidth/2;
	    	}
			//Otherwise, this is a button in the middle.
			else
			{
				//The furthest we can go left is the previous slider's position
				//(plus the slider button's width).
	    		leftEdge = self.values[index-1]+sliderWidth;
				//The furthest we can go right is the next slider button's position.
				rightEdge = self.values[index+1]-sliderWidth;
			}
			
			//Clamp to the assigned limits:
			//Right edge...
	    	if(val>rightEdge){
				val=rightEdge;
			}
			//Left edge.
    		else if(val<leftEdge){
				val=leftEdge;
			}
			
			//Now update this button's float value.
	    	self.values[index] = val;
			//Tell the slider we've changed.
	    	self.updateUI();
			//Also tell whatever config struct we passed to the constructor
			//that we changed.
	    	config.onChange(self.values);
		}
	}
	
	//Called when the slider button is done moving.
	function onMouseUp(){
		//Do we have the DOM for the button?
		if(self.draggingSliderDOM){
			//If so, clear it
			//for the next button.
		    self.draggingSliderDOM = null;
		    //Call our onLetGo handler if we have one.
			if(config.onLetGo){
		    	config.onLetGo();
		    }
		}
	}
	
	//Add document-level event handlers:
	//Called when the mouse moves.
	document.body.addEventListener("mousemove",function(event){
		//Convert mouse X-position to local coordinates.
		var x = event.pageX - myX();
		//Pass through to onMouseMove.
		onMouseMove(x);
	},true);
	//Called when a touch moves.
	document.body.addEventListener("touchmove",function(event){
		//Convert touch X-position to local coordinates.
		var x = event.changedTouches[0].clientX - myX();
		//Pass through to onMouseMove.
		onMouseMove(x);
	},true);
	//Called when LMB is released; just calls onMouseUp(true).
	document.body.addEventListener("mouseup",onMouseUp,true);
	//Called when a touch is released; just calls onMouseUp(true).
	document.body.addEventListener("touchend",onMouseUp,true);
	//Function to figure out where our slider is, horizontally.
	var cacheX = null;
	function myX(){
		//If we have no cached value for our horizontal position,
		//ask the DOM.
		if(!cacheX){
			cacheX=findPos(self.dom)[0];			
		}
		return cacheX;
	}

	//UI update function.
	self.updateUI = function(){
		//Run through each slider.
		for(var i=0;i<kNumSliderButtons;i++){
			var slider = self.sliders[i];
			var val = self.values[i];
			//Update the slider's stylesheet; its left edge needs to change.
			slider.style.left = (kToPixels*val - 5)+"px";
		}

		//Update backgrounds.
		var prevPixelPosition = 0;
		for(var i = 0; i < kNumSliderSections; i++){
			var bg = self.backgrounds[i];
			//Get the pixel position of the button to the right of this background,
			//that'll be our background's end point.
			//If this is the last background, assume the slider's end is the background's end point.
			var pixelPosition = i < kNumSliderButtons ? self.values[i]*kToPixels : kToPixels;
			//Update the background's width and start position.
			bg.style.left = prevPixelPosition+"px";
			bg.style.width = (pixelPosition-prevPixelPosition)+"px";
			//Save the converted button position for the next background.
			prevPixelPosition = pixelPosition;
		}
		/*
		var bg;
		//Convert button 0 and button 1's values to pixels.
		var v0=self.values[0]*kToPixels
		var v1=self.values[1]*kToPixels;
		bg = self.backgrounds[0];
		//Update the background's width.
		bg.style.width = v0+"px";
		bg = self.backgrounds[1];
		//Update the background's width and start position.
		bg.style.left = v0+"px";
		bg.style.width = (v1-v0)+"px";
		bg = self.backgrounds[2];
		bg.style.left = v1+"px";
		bg.style.width = (kToPixels-v1)+"px";
		*/
	};

	//Now that construction is done,
	//prime the slider with an initial update.
	self.updateUI();
	config.onChange(self.values);
}

//Attempts to find the origin position of an arbitrary object.
function findPos(obj){
	//Default result is [0, 0].
    var curleft = 0;
    var curtop = 0;
	
	//Does this object have an offsetLeft property?
    if(obj.offsetLeft) {
		//Move our left position by offsetLeft.
		curleft += parseInt(obj.offsetLeft);
	}
	//Does this object have an offsetTop property?
    if(obj.offsetTop) {
		//Move our top position by offsetTop.
		curtop += parseInt(obj.offsetTop);
	}
	//Does this object have a POSITIVE scrollTop property?
	if(obj.scrollTop && obj.scrollTop > 0) {
		//Move our top position by the opposite of scrollTop.
		curtop -= parseInt(obj.scrollTop);
    }
	
	//Does this object have a parent object it's attached to?
	if(obj.offsetParent) {
		//Calculate the parent's origin.
        var pos = findPos(obj.offsetParent);
        //Add the parent's origin to the object's origin to get the final value.
		curleft += pos[0];
        curtop += pos[1];
    }
	//Otherwise, see if we have an owning document.
	else if(obj.ownerDocument) {
		//If we do, get the document's window.
        var thewindow = obj.ownerDocument.defaultView;
		//If we can't get the window,
		//try to get the document's parent's window.
        if(!thewindow && obj.ownerDocument.parentWindow)
            thewindow = obj.ownerDocument.parentWindow;
		//Do we finally have some window to use?
        if(thewindow) {
			//Does that window have a frame?
            if(thewindow.frameElement) {
				//If so, assume we're in said frame
				//and offset our object by that frame's origin.
                var pos = findPos(thewindow.frameElement);
                curleft += pos[0];
                curtop += pos[1];
            }
        }
	}
	
    return [curleft,curtop];
}
