function Munch(){
	var thisMunch = this;
	console.log("Very Munchy");
	this.timer = 0;

	this.loop = function(){
		thisMunch.update();
		thisMunch.draw();
		thisMunch.timer++;
		window.requestAnimationFrame(thisMunch.loop);
	};

	this.ctrls = {
		space: 32,
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		n0: 48,
		n1: 49,
		n2: 50,
		n3: 51,
		n4: 52,
		n5: 53,
		n6: 54,
		n7: 55,
		n8: 56,
		n9: 57,
		A: 65,
		B: 66,
		C: 67,
		D: 68,
		E: 69,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		L: 76,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		P: 86,
		W: 87,
		X: 88,
		Y: 89,
		Z: 90,
		backspace: 8,
		tab: 9,
		enter: 13,
		shift:  16,
		ctrl: 17,
		alt: 18,
		caps: 20,
		lWindow: 91,
		lCmd: 91,
		rCmd: 93,
		select: 93, 
		semiCol: 186,
		equals: 187,
		comma: 188,
		dash: 189,
		period: 190,
		slash: 191,
		grave: 192,
		lBrack: 219,
		bSlash: 220,
		rBrack: 221,
		sQuote: 222
	};
}


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


// MAIN LOOP
// ===========================



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
	};

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

function Player(appendTo){
	this.currentAnimation = null;
	this.frameCount = 0;
	this.isFixedX = null;
	this.isFixedY = null;
	this.X = null;
	this.Y = null;
	this.flippedHorizontal = false;
	this.flippedVertical = false;

	playerLayer = new Layer(appendTo, 400, 300, 1);

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
			playerLayer.translate(400, 0); playerLayer.scale(-1, 1); // make this line dynamic with canvas width
			this.flippedHorizontal = true;
		} else if(this.flippedHorizontal && flippedBool===false) {
			playerLayer.translate(400, 0); playerLayer.scale(-1, 1); // make this line dynamic with canvas width
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
		playerLayer.clearRect(0,0,500,500); //make this dynamic
		//  change the 300 magic number to be the canvas height dynamically
		if(this.isFixedY){ this.Y = (300 - this.currentAnimation.dH)*0.5 }
		//  change the 400 magic number to be the canvas height dynamically
		if(this.isFixedX){ this.X = (400 - this.currentAnimation.dW)*0.5 }
		playerLayer.drawImage(
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


