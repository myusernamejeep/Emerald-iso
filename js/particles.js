var all_particles = []; 

function randomFloat (min, max)
{
	return min + Math.random()*(max-min);
}

/*
 * A single explosion particle
 */
function Particle ()
{
	this.scale = 1.0;
	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.color = "#000";
	this.velocityX = 0;
	this.velocityY = 0;
	this.scaleSpeed = 0.5;
	
	this.update = function(ms)
	{
		// shrinking
		this.scale -= this.scaleSpeed * ms / 1000.0;
		
		if (this.scale <= 0)
		{
			this.scale = 0;
		}
		
		// moving away from explosion center
		this.x += this.velocityX * ms/1000.0;
		this.y += this.velocityY * ms/1000.0;
	};
	
	this.draw = function()
	{
		console.log('draw');
		// translating the 2D context to the particle coordinates
		this.context2D.save();
		this.context2D.translate(this.x, this.y);
		this.context2D.scale(this.scale, this.scale);
		
		// drawing a filled circle in the particle's local space
		this.context2D.beginPath();
		this.context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
		this.context2D.closePath();
		
		this.context2D.fillStyle = this.color;
		this.context2D.fill();
		
		this.context2D.restore();
	};
}
 
/*
 * Advanced Explosion effect
 * Each particle has a different size, move speed and scale speed.
 * 
 * Parameters:
 * 	x, y - explosion center
 * 	color - particles' color
 */
function createExplosion(x, y, color, context2D )
{
	var minSize = 10;
	var maxSize = 30;
	var count = 10;
	var minSpeed = 60.0;
	var maxSpeed = 200.0;
	var minScaleSpeed = 1.0;
	var maxScaleSpeed = 4.0;
	var particles = [];
	
	for (var angle=0; angle<360; angle += Math.round(360/count))
	{
		var particle = new Particle();
		
		particle.x = x;
		particle.y = y;
		particle.context2D = context2D;

		particle.radius = randomFloat(minSize, maxSize);
		
		particle.color = color;
		
		particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
		
		var speed = randomFloat(minSpeed, maxSpeed);
		
		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
		 
		particles.push(particle);
	}

	return particles;
}

function update (frameDelay)
{
	// draw a white background to clear canvas
	for (var i=0; i<all_particles.length; i++)
	{
		var particle = all_particles[i][0];
		//console.log(particle, particle.context2D);
		if(particle && particle.context2D){
			particle.context2D.fillStyle = "transparent";
			particle.context2D.fillRect(0, 0, particle.context2D.canvas.width, particle.context2D.canvas.height);
		}
 
	}
	// update and draw particles
	for (var i=0; i<all_particles.length; i++)
	{
		var particles = all_particles[i];
 
		for (var j=0; j<particles.length; j++)
		{
			var particle = particles[j];
			particle.update(frameDelay);
			particle.draw();
		}
	}
}



/*
window.on("load", function()
{
	// canvas and 2D context initialization
	canvas = document.getElementById("canvas");
	context2D = canvas.getContext("2d");
	
	// Button click : BOOM !
	document.id("explosion").addEvent("click", function()
	{
		var x = randomFloat(100, 400);
		var y = randomFloat(100, 400);
		
		createExplosion(x, y, "#525252");
		
		createExplosion(x, y, "#FFA318");
	});
	
	// Button click : basic effect
	document.id("basic_explosion").addEvent("click", function()
	{
		createBasicExplosion(250, 200);
	});
	
	// starting the game loop at 60 frames per second
	var frameRate = 60.0;
	var frameDelay = 1000.0/frameRate;
	
	setInterval(function()
	{
		update(frameDelay);
		
	}, frameDelay);
});*/