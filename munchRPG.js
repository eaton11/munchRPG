// var canvas = document.createElement("canvas");
// canvas.height = 300;
// canvas.width = 400;
// var layer = canvas.getContext("2d");
// document.body.appendChild(canvas);

function Munch(){
	console.log("Very Munchy");
}
var munch = new Munch();
munch.timer = 0;

function Layer(appendTo, _WIDTH, _HEIGHT, Z_INDEX) {
	thisLayer = this;
	this.canvas = document.createElement("canvas");
	this.canvas.height = _HEIGHT;
	this.canvas.width = _WIDTH;
	(function(){
		thisLayer.canvas.style.position = "relative";
		thisLayer.canvas.style.zIndex = Z_INDEX;
		var parent = appendTo;
		appendTo.appendChild(thisLayer.canvas);
	})();
	return this.canvas.getContext("2d");
}
var layer = new Layer(document.body, 400, 300, 1);

// MAIN LOOP
// ===========================
munch.loop = function(){
	munch.update();
	munch.draw();
	munch.timer++;
	window.requestAnimationFrame(munch.loop);
};


// ANIMATION
// ===========================
function Animation(PATH_TO_IMG, _WIDTH, _HEIGHT, callback){
	var thisAnimation = this;
	this.frameSet = [];
	this.frameOrder = [0];
	this.dW = _WIDTH;
	this.dH = _HEIGHT;
	this.animationSpeed = 1;

	(function(){ 
		thisAnimation.img = new Image();
		if(callback) thisAnimation.img.addEventListener('load', callback);
		thisAnimation.img.src = PATH_TO_IMG;
	})();

	this.addFrame = function(sliceX, sliceY, sliceW, sliceH){
		var newFrame = {
			sX: sliceX,
			sY: sliceY,
			sW: sliceW,
			sH: sliceH
		};
		thisAnimation.frameSet.push(newFrame);
	};

	this.setFrameOrder = function(FRAME_ORDER_ARR){
		var frame_order_arr = FRAME_ORDER_ARR;
		thisAnimation.frameOrder = [];
		for(var i = 0, ii = frame_order_arr.length; i < ii; i++){
			thisAnimation.frameOrder.push(thisAnimation.frameSet[frame_order_arr[i]]);
		}
	};

	this.divideFpsFrequency = function(newAnimationSpeed){
		this.animationSpeed = Math.floor(newAnimationSpeed);
		if(this.animationSpeed < 1) this.animationSpeed = 1;
	};

	this.preloader = function(_preloader) {
		_preloader.queue();
	}
}


// PRELOADER
// ===========================
function Preloader(onComplete) {
	thisPreloader=this;
	this.pending=0;
	this.complete=0;
	this.then=onComplete;
	this.queue = function() {
		thisPreloader.pending++;
	}
	this.success = function(){
		thisPreloader.complete++;
		if(thisPreloader.pending == thisPreloader.complete)thisPreloader.then();
	}
}

function Player(){
	this.currentAnimation = null;
	this.frameCount = 0;
	this.isFixedX = null;
	this.isFixedY = null;
	this.X = null;
	this.Y = null;
	this.flippedHorizontal = false;
	this.flippedVertical = false;

	this.setCurrentAnimation = function(newCurrentAnimation) {
		this.currentAnimation = newCurrentAnimation;
		this.currentAnimation.currentFrame = this.currentAnimation.frameOrder[this.frameCount];
	};

	this.fixedXAxis = function(isFixedX) {
		var isXFixed = isFixedX;
		if(typeof isXFixed != "boolean") {
			console.error("MUST PASS BOOLEAN TO fixedXAxis()");
		} else {
			this.isFixedX = isXFixed;
		}
	};

	this.fixedYAxis = function (isFixedY) {
		var isYFixed = isFixedY;
		if(typeof isYFixed != "boolean") {
			console.error("MUST PASS BOOLEAN TO fixedYAxis()");
		} else {
			this.isFixedY = isYFixed;
		}
	};

	this.flipHorizontal = function(flipBool) {
		var flippedBool = flipBool;
		if(!this.flippedHorizontal && flippedBool===true) {
			layer.translate(400, 0); layer.scale(-1, 1); // make this line dynamic with canvas width
			this.flippedHorizontal = true;
		} else if(this.flippedHorizontal && flippedBool===false) {
			layer.translate(400, 0); layer.scale(-1, 1); // make this line dynamic with canvas width
			this.flippedHorizontal = false;
		}
		return this.flippedHorizontal;
	};

	this.flipVertical = function() {
	};

	this.loopFrames = function() {
		if(munch.timer%this.currentAnimation.animationSpeed===0) this.frameCount++;
		if(!this.currentAnimation.frameOrder[this.frameCount]) this.frameCount=0; 
		this.currentAnimation.currentFrame = this.currentAnimation.frameOrder[this.frameCount];
	};

	this.draw = function() {
		layer.clearRect(0,0,500,500); //make this dynamic
		//  change the 300 magic number to be the canvas height dynamically
		if(this.isFixedY){ this.Y = (300 - this.currentAnimation.dH)*0.5 }
		//  change the 400 magic number to be the canvas height dynamically
		if(this.isFixedX){ this.X = (400 - this.currentAnimation.dW)*0.5 }
		layer.drawImage(
			this.currentAnimation.img, 
			this.currentAnimation.currentFrame.sX, 
			this.currentAnimation.currentFrame.sY, 
			this.currentAnimation.currentFrame.sW, 
			this.currentAnimation.currentFrame.sH, 
			this.X, 
			this.Y, 
			this.currentAnimation.dW, 
			this.currentAnimation.dH
		);
	};
}

var keystate = {};
document.addEventListener('keydown',function(evt){
	keystate[evt.keyCode] = true;
});

document.addEventListener('keyup',function(evt){
	keystate[evt.keyCode] = false;
});




// PLAYER
// munch.setPlayerDimensions(50,100);


