const sounds = (() => {
	const init = () => {
		const miss = new Audio('sounds/gray1wea.wav');
		const hit = new Audio('sounds/explo.wav');
		const sunk = new Audio('sounds/explodea.wav');
		const gameOver = new Audio('sounds/capture.wav');
		const drop = new Audio('sounds/barr1sel.wav');
		const rotate = new Audio('sounds/drain.wav');
		const random = new Audio('sounds/exp1sel.wav');
		const select = new Audio('sounds/msg.wav');
		const tick = new Audio('sounds/beep.wav');
		const grab = new Audio('sounds/buttonRev.wav');

		return {
			miss,
			hit,
			sunk,
			gameOver,
			drop,
			rotate,
			random,
			select,
			tick,
			grab,
		};
	};

	const playAudio = (audio: any) => {
		Object.keys(audio).forEach((key) => {
			const playSound = audio[key].play;
			audio[key].play = function soundPlayer() {
				if (audio[key].currentTime > 0) {
					audio[key].pause();
					audio[key].currentTime = 0;
				}
				return playSound.call(this);
			};
		});
	};

	const load = () => {
		const audio = init();
		playAudio(audio);
		return audio;
	};

	return load();
})();

export default sounds;
