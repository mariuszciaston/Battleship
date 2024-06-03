function isSafariOrIOSBrowser() {
	const ua = navigator.userAgent;
	const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
	const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);

	return isSafari || isIOS;
}

let sounds: {
	play: (key: string) => void;
	muteAll: (mute: boolean) => void;
};

if (isSafariOrIOSBrowser()) {
	const audioCtx = new AudioContext();
	interface ISoundBuffers {
		[key: string]: AudioBuffer;
	}
	sounds = (() => {
		const buffers: ISoundBuffers = {};
		const gainNode = audioCtx.createGain();
		gainNode.connect(audioCtx.destination);
		const loadSound = (url: string, key: string): void => {
			const request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onload = (): void => {
				audioCtx.decodeAudioData(
					request.response,
					(buffer: AudioBuffer) => {
						buffers[key] = buffer;
					},
					(error: Error) => {
						console.error('Error with decoding audio data', error);
					}
				);
			};
			request.send();
		};
		const init = (): void => {
			loadSound('sounds/gray1wea.wav', 'miss');
			loadSound('sounds/explo.wav', 'hit');
			loadSound('sounds/explodea.wav', 'sunk');
			loadSound('sounds/capture.wav', 'gameOver');
			loadSound('sounds/barr1sel.wav', 'drop');
			loadSound('sounds/drain.wav', 'rotate');
			loadSound('sounds/exp1sel.wav', 'random');
			loadSound('sounds/msg.wav', 'select');
			loadSound('sounds/beep.wav', 'tick');
			loadSound('sounds/buttonRev.wav', 'grab');
		};
		const playingSources: { [key: string]: AudioBufferSourceNode | null } = {};
		const playAudio = (key: string): void => {
			if (playingSources[key]) {
				playingSources[key]!.stop();
				playingSources[key].onended = () => {};
				playingSources[key] = null;
			}
			if (buffers[key]) {
				const source = audioCtx.createBufferSource();
				source.buffer = buffers[key];
				source.connect(gainNode);
				playingSources[key] = source;
				source.onended = () => {
					playingSources[key] = null;
				};
				source.start(0);
			} else {
				console.error('Sound not found:', key);
			}
		};
		const muteAll = (mute: boolean) => {
			if (mute) {
				gainNode.gain.value = 0;
				return true;
			} else {
				gainNode.gain.value = 1;
				return false;
			}
		};
		const load = (): { play: (key: string) => void; muteAll: (mute: boolean) => void } => {
			init();
			return {
				play: playAudio,
				muteAll: muteAll,
			};
		};
		return load();
	})();
	document.addEventListener('touchstart', (): void => {
		audioCtx
			.resume()
			.then(() => {
				console.log('Playback resumed successfully');
			})
			.catch((error: Error) => {
				console.error('Playback resume failed', error);
			});
	});
} else {
	sounds = (() => {
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

		const playAudio = (sounds: { [key: string]: HTMLAudioElement }) => {
			Object.keys(sounds).forEach((key) => {
				const playSound = sounds[key].play;
				sounds[key].play = function soundPlayer() {
					if (sounds[key].currentTime > 0) {
						sounds[key].pause();
						sounds[key].currentTime = 0;
					}
					return playSound.call(this);
				};
			});
		};

		const muteAll = (mute: boolean) => {
			let isMuted = false;
			Object.values(sounds).forEach((sound) => {
				if (sound instanceof HTMLAudioElement) {
					sound.volume = mute ? 0 : 1;
					isMuted = mute;
				}
			});
			return isMuted;
		};

		const load = () => {
			const audio = init();
			playAudio(audio);
			return {
				...audio,
				play: function (name: keyof typeof audio) {
					if (this[name] && this[name].play) {
						this[name].play();
					}
				},
				muteAll: muteAll,
			};
		};

		return load();
	})();
}

export default sounds;
