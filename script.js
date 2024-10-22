var slider = document.getElementById("freq");
var output = document.getElementById("freqVal");
output.innerHTML = slider.value;
const SAMPLERATE = 160800;
var oscillator;
var oscillatorStarted = false;
var type = "sine";
var disabled = true;
slider.oninput = function () {
	output.innerHTML = this.value;
	audioToneGen();
	waveGen();
};

function waveGen() {
	// SETUP
	var canvas = document.getElementById("wave");
	var width = window.innerWidth * 0.8;
	var height = window.innerHeight * 0.9;
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext("2d");
	var freq = slider.value;
	var x = 0;
	var y = height / 2;
	var amplitude = height / 2;
	var phase = 0;
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
	// DRAW
	if (type === "sine") {
		while (x < width) {
			y =
				amplitude *
					Math.sin((2 * Math.PI * freq * x) / SAMPLERATE + phase) +
				height / 2;
			ctx.lineTo(x, y);
			x++;
		}
	}
	if (type === "square") {
		while (x < width) {
			y =
				Math.sin((2 * Math.PI * freq * x) / SAMPLERATE + phase) > 0
					? amplitude + height / 2
					: -amplitude + height / 2;
			ctx.lineTo(x, y);
			x++;
		}
	}
	if (type === "sawtooth") {
		while (x < width) {
			y =
				((x / (SAMPLERATE / freq)) % 1) * 2 * amplitude -
				amplitude +
				height / 2;
			ctx.lineTo(x, y);
			x++;
		}
	}

	if (type === "triangle") {
		while (x < width) {
			var t = (x / (SAMPLERATE / freq)) % 1;
			y =
				t < 0.5
					? t * 4 * amplitude - amplitude + height / 2
					: (1 - t) * 4 * amplitude - amplitude + height / 2;
			ctx.lineTo(x, y);
			x++;
		}
	}
	// Baseline
	ctx.stroke();
	ctx.moveTo(0, amplitude);
	ctx.lineWidth = 5;
	ctx.lineTo(width, amplitude);
	ctx.stroke();
}
function audioToneGen() {
	if (oscillator && oscillatorStarted && disabled) {
		oscillator.stop();
		oscillator = null;
		oscillatorStarted = false;
	}
	if (!oscillator && !disabled) {
		var freq = slider.value;
		var audioCtx = new AudioContext();
		oscillator = audioCtx.createOscillator();
		oscillator.type = type;
		oscillator.frequency.value = freq;
		oscillator.connect(audioCtx.destination);
		setTimeout(function () {
			oscillator.start();
			oscillatorStarted = true;
		}, 50); // add a 500ms delay before starting the oscillator
	}
}

document.getElementById("sine").addEventListener("click", function () {
	type = "sine";
	audioToneGen();
	waveGen();
});
document.getElementById("square").addEventListener("click", function () {
	type = "square";
	audioToneGen();
	waveGen();
});
document.getElementById("sawtooth").addEventListener("click", function () {
	type = "sawtooth";
	audioToneGen();
	waveGen();
});
document.getElementById("triangle").addEventListener("click", function () {
	type = "triangle";
	audioToneGen();
	waveGen();
});
document.getElementById("play").addEventListener("click", function () {
	disabled ? disabled = false : disabled = true;
	document.getElementById("play").innerHTML = disabled ? "Play" : "Pause";
	document.getElementById("play").style.backgroundColor = disabled ? "green" : "red";
	console.log(disabled)
	audioToneGen();
});
function resizeCanvas() {
	var canvas = document.getElementById("wave");
	var width = window.innerWidth * 0.8;
	var height = window.innerHeight * 0.9;
	canvas.width = width;
	canvas.height = height;
	waveGen();
}
audioToneGen();
waveGen();
requestAnimationFrame(resizeCanvas);
