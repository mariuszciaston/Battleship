global.Audio = class {
    constructor() {
      return {
        play: jest.fn(),
        pause: jest.fn(),
      };
    }
  };
  