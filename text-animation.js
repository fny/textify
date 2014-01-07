/**
 * A class for creating text animations
 *
 * Example:
 *
 *   var stage = document.getElementById('stage')
 *   var anim = new TextAnimation([0,1,2], stage)
 *
 *  - `frameData`: the string array to use as frames for the animation
 *  - `stage`: the DOM node to attach the animation
 *  - `options`: an object of initialization options
 *    - `delay`: the number of milliseconds between frames, defaults to `100`
 *    - `swing`: sets the animation to progress back and forth like a swing,
 *      defaults to `true`
**/
function TextAnimation(frameData, stage, options) {

  // Returns the index of the current frame
  this.getIndex = function() {
    return this.frame;
  };

  // Returns the delay between frames in milliseconds
  this.getDelay = function() {
    return this.delay;
  }

  // Returns the number frames per second
  this.getFPS = function() {
    return 1000 / this.getDelay();
  }

  // Plays the animation
  this.play = function() {
    this.stopped = false;
    this._loop();
  };

  // Progresses the animation by one frame
  // Returns the text animation for method chaining
  this.nextFrame = function() {
    this.setIndex(this._nextIndex());
    return this;
  };

  // Sets the delay between frames in milliseconds
  //
  // - `ms`: the number of milliseconds between each frame
  // Returns the text animation for method chaining
  this.setDelay = function(ms) {
    this.delay = ms;
    return this;
  };

  // Sets the number of frames per second
  //
  // = `fps`: the number of frames per second
  this.setFPS = function(fps) {
    this.setDelay(1000 / fps)
    return this;
  }

  // Sets the current position of the animation
  //
  // - `index`: the index of the `frameData` to set as the current position
  // Returns the text animation for method chaining
  this.setIndex = function(index) {
    stage.innerHTML = this.frameData[index];
    this.frame = index;
    return this;
  };

  // Reverses the direction of the animation
  // Returns the txt animation for method chaining
  this.reverse = function() {
    this.direction = -this.direction;
    return this;
  }

  // Stops the animation
  this.stop = function() {
    this.stopped = true;
  };

  // Sets the animation to loop in an incremental fashion
  //
  // Example:
  //
  //     anim.useStandardLoop() // =>  0, 1, 2, 3, 0, 1, 2, 3, ...
  //
  // Returns the text animation for method chaining
  this.useStandardLoop = function() {
    this.direction = 1;
    this._nextIndex = function() {
      return (this.length + this.frame + this.direction) % this.length;
    };
    return this;
  };

  // Sets the animation to loop in a pendulum-like fashion
  //
  // Example:
  //
  //     anim.useSwingLoop() // => 0, 1, 2, 1, 0, 1, 2, 1, 0, ...
  //
  // Returns the text animation for method chaining
  this.useSwingLoop = function() {
    this.direction = 1;
    this._nextIndex = function() {
      var next;
      if (this.frame === 0 && this.direction === -1 ||
          this.frame === this.length - 1 && this.direction === 1) {
        this.reverse();
      }
      return (this.frame + this.direction) % this.length;
    };
    return this;
  };

  //
  // Private
  //

  this._loop = function() {
    if (!this.stopped) {
      setTimeout(this._loop.bind(this), this.delay);
      this.nextFrame();
    }
  };

  this._loop = function() {
        if (!this.stopped) {
      requestAnimationFrame(this._loop.bind(this))
      this._now = Date.now();
      var delta = this._now - this._then;
      if (delta > this.delay) {
        this._then = this._now - (delta % this.delay);
        this.nextFrame();
      }
    }
  };

  this.init = function() {
    options = options || {};
    this.stage = stage;
    this.frameData = frameData;
    this.length = frameData.length;
    this.frame = 0;
    this.delay =  options.delay || 100;
    this.stopped = false;
    this.direction = 1;
    this._nextIndex = null;
    this._then = Date.now();
    if (options.swing) {
      this.useSwingLoop();
    } else {
      this.useStandardLoop();
    }
    this.setIndex(0);
    this.play();
  };
  this.init();
}

