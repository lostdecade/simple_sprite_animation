// Create the canvas
var canvas = document.createElement("canvas");
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);

// Grab a reference to the canvas 2D context
var ctx = canvas.getContext("2d");

// Handle keyboard events
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Game object representing our hero
var hero = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	speed: 200,
	direction: {
		x: 0,
		y: 0
	},
	// Animation settings
	animSet: 4,
	animFrame: 0,
	animNumFrames: 2,
	animDelay: 200,
	animTimer: 0
};

// Center hero
hero.x = (canvas.width / 2 - hero.width / 2);
hero.y = (canvas.height / 2 - hero.height / 2);

heroImageReady = false;
heroImage = new Image();
heroImage.onload = function () {
	heroImageReady = true;
};
heroImage.src = "images/hero_sheet.png";

var handleInput = function () {

	// Stop moving the hero
	hero.direction.x = 0;
	hero.direction.y = 0;

	if (37 in keysDown) { // Left
		hero.direction.x = -1;
	}

	if (38 in keysDown) { // Up
		hero.direction.y = -1;
	}

	if (39 in keysDown) { // Right
		hero.direction.x = 1;
	}

	if (40 in keysDown) { // Down
		hero.direction.y = 1;
	}

};

var update = function (elapsed) {

	// Update hero animation
	hero.animTimer += elapsed;
	if (hero.animTimer >= hero.animDelay) {
		// Enough time has passed to update the animation frame
		hero.animTimer = 0; // Reset the animation timer
		++hero.animFrame;
		if (hero.animFrame >= hero.animNumFrames) {
			// We've reached the end of the animation frames; rewind
			hero.animFrame = 0;
		}
	}

	// Update hero animation direction
	var d = hero.direction;
	if (d.x == 0 && d.y == -1) {
		hero.animSet = 0;
	} else if (d.x == 1 && d.y == -1) {
		hero.animSet = 1;
	} else if (d.x == 1 && d.y == 0) {
		hero.animSet = 2;
	} else if (d.x == 1 && d.y == 1) {
		hero.animSet = 3;
	} else if (d.x == 0 && d.y == 1) {
		hero.animSet = 4;
	} else if (d.x == -1 && d.y == 1) {
		hero.animSet = 5;
	} else if (d.x == -1 && d.y == 0) {
		hero.animSet = 6;
	} else if (d.x == -1 && d.y == -1) {
		hero.animSet = 7;
	}

	// Move the hero
	var move = (hero.speed * (elapsed / 1000));
	hero.x += Math.round(move * hero.direction.x);
	hero.y += Math.round(move * hero.direction.y);

};

var render = function () {

	// Draw a green background. Pretend it's grass
	ctx.fillStyle = "rgb(51, 118, 36)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw hero
	if (heroImageReady) {

		// Determine which part of the sprite sheet to draw from
		var spriteX = (
			(hero.animSet * (hero.width * hero.animNumFrames)) +
			(hero.animFrame * hero.width)
		);

		// Render image to canvas
		ctx.drawImage(
			heroImage,
			spriteX, 0, hero.width, hero.height,
			hero.x, hero.y, hero.width, hero.height
		);

	} else {
		// Image not ready. Draw a gray box
		ctx.fillStyle = "rgb(100, 100, 100)";
		ctx.fillRect(hero.x, hero.y, hero.width, hero.height);
	}

};

// Main game loop
var main = function () {

	// Calculate time since last frame
	var now = Date.now();
	var delta = (now - last);
	last = now;

	// Handle any user input
	handleInput();

	// Update game objects
	update(delta);

	// Render to the screen
	render();

};

// Start the main game loop!
var last = Date.now();
setInterval(main, 1);
