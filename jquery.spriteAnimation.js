/**
 * @fileOverview jQuery Sprite Animation Plugin
 * @author <a href="mailto:brianfegan@gmail.com">Brian Fegan</a>
 * @version 0.9
 */

/**
 * @name $
 * @function
 * @description jQuery namespace
 */

/**
 * @name $.fn
 * @type object
 * @description Object to attach jQuery plugin extensions to.
 */

/**
 * @name $.fn.spriteAnimation
 * @function
 * @description The public api method for the spriteAnimation plugin. Options are...
 * <ul>
 * 	<li><strong>aspectRatio</strong>: the aspect ratio of the animation ele.</li>
 *  <li><strong>autoPlay</strong>: will play when the plugin is initialized.</li>
 *  <li><strong>frameSpeedMs</strong>: speed in milliseconds to animate through frames.</li>
 *  <li><strong>loop</strong>: will continuously loop animation. if false, animation plays only once.</li>
 * 	<li><strong>numberOfFrames</strong>: the number of frames used in the animation.</li>
 *  <li><strong>resizePauseMs</strong>: number of milliseconds animation will pause after a resize event.</li>
 * </ul>	
 * @param {mixed} method Either the public method we want to call, an options object, or a param needed for the method being called.
 * @returns {object} The chained jQuery object.
 */
(function($){
	
	var defaults = {
		aspectRatio: '16:9',
		autoPlay: true,
		frameSpeedMs: 80,
		loop: true,
		numberOfFrames: 50,
		onResizePauseMs: 350
	},
	methods = {},
	$window = $(window),	
	
	/**
	 * @name $.fn.spriteAnimation-_Sprite
	 * @class
	 * @description The private sprite asset constructor.
	 * @param {object} $ele The jquery object representing the sprite element.
	 * @param {object} opts The options for this sprite instance.
	 */
	_Sprite = function($ele, opts) {
		
		// save some non-option data
		this.$ele			= $ele;
		this.frame			= 0;
		this.pause_timer	= null;
		this.anim_timer		= null;
		this.playing		= false;
		
		// now save everything from options to this instance
		for (var key in opts) {
			if (opts.hasOwnProperty(key)) {
				this[key] = opts[key];
			}
		}
		
		// make aspect ratio useable
		var ratioArr = opts.aspectRatio.split(':');
		this.aspectRatio = ratioArr[0] / ratioArr[1];
		
		// set initial css and start
		this.setDimensions();
		this.setCss();
		if (this.autoPlay) this.start();
		
		// set up a window event handlers
		var sprite = this;
		$window.on('resize focus', function(){
			sprite.resize();
		}).on('focus', function(){
			sprite.start();
		}).on('blur', function(){
			if (sprite.playing) sprite.stop(true); //true=winEvent
		});
		
	};
	
	/**
	 * Prototype methods for the private _Sprite class
	 */
	_Sprite.prototype = {
			
		/**
		 * @name $.fn.spriteAnimation-_Sprite.setDimensions
		 * @function
		 * @description Set dimensions needed for the background-size, and background-position.
		 */
		setDimensions : function() {
			var eleWidth = this.$ele.outerWidth();
			this.dimensions = {spriteWidth:(eleWidth * this.numberOfFrames), eleWidth:eleWidth, eleHeight:(eleWidth / this.aspectRatio)};		
		},
		
		/**
		 * @name $.fn.spriteAnimation-_Sprite.setCss
		 * @function
		 * @description Update the CSS to display the current frame properly sized.
		 */
		setCss : function() {
			var dims = this.dimensions;
			this.$ele.css({
				'background-size': dims.spriteWidth+'px '+dims.eleHeight+'px',
				'background-position': (-dims.eleWidth * this.frame)+'px 0'
			});
		},

		/**
		 * @name $.fn.spriteAnimation-_Sprite.goToNextFrame
		 * @function
		 * @description Go to the next frame in the sprite.
		 */
		goToNextFrame : function() {
			this.frame++;
			if (this.frame >= this.numberOfFrames) this.frame = 0;
			this.setCss();
			if (!this.loop) this.stop();
		},
		
		/**
		 * @name $.fn.spriteAnimation-_Sprite.start
		 * @function
		 * @description Start the sprite animation.
		 */
		start : function() {
			var sprite = this;
			this.playing = true;
			window.clearTimeout(this.pause_timer);
			window.clearInterval(this.anim_timer);
			console.log(this.frameSpeedMs);
			this.anim_timer = window.setInterval(function(){
				sprite.goToNextFrame();
			}, this.frameSpeedMs);
		},
		
		/**
		 * @name $.fn.spriteAnimation-_Sprite.stop
		 * @function
		 * @description Stop the sprite animation.
		 * @param {boolean} winEvent Used if stop was called from a window resize or blur event.
		 */
		stop : function(winEvent) {
			window.clearInterval(this.anim_timer);
			this.anim_timer = null;
			if (!winEvent) this.playing = false;
		},
			
		/**
		 * @name $.fn.spriteAnimation-_Sprite.resize
		 * @function
		 * @description Resize event for a sprite instance; stop animating, reset css, set pause timer to resume play when resize ends.
		 * @param {object} data
		 */
		resize : function() {
			if (this.anim_timer) this.stop(true); //true=winEvent
			window.clearTimeout(this.pause_timer);
			this.setDimensions();
			this.setCss();
			var sprite = this;
			this.pause_timer = window.setTimeout(function(){
				sprite.start();
			}, this.onResizePauseMs);
		}
			
	};
	
	/**
	 * @name $.fn.spriteAnimation.stop
	 * @function
	 * @description A public method to stop animation; i.e. $(selector).spriteAnimation('stop')
	 * @returns {object} The chained jQuery object.
	 */
	methods.stop = function () {
		this.each(function (index, ele) {
			var sprite = $(ele).data('sprite');
			if (sprite && sprite.playing) sprite.stop();
		});
		return this;
	};
	
	/**
	 * @name $.fn.spriteAnimation.start
	 * @function
	 * @description A public method to start animation; i.e. $(selector).spriteAnimation('start')
	 * @returns {object} The chained jQuery object.
	 */
	methods.start = function () {
		this.each(function (index, ele) {
			var sprite = $(ele).data('sprite');
			if (sprite && !sprite.playing) sprite.start();
		});
		return this;
	};
	
	/**
	 * @name $.fn.spriteAnimation.init
	 * @function
	 * @description The default method used when called $(selector).spriteAnimation().
	 * @param {object} opts Overrides for the default options of the plugin.
	 * @returns {object} The chained jQuery object. 
	 */
	methods.init = function (opts) {
		
		// Loop through the jQuery objects passed in
		this.each(function (index, ele) {
		
			var $ele = $(ele),
				sprite = $ele.data('sprite'),
				data = {};
						
			// only proceed if there is NOT already asset data
			// extend the defaults and options into this instance
			// create a sprite instance
			if (!sprite) {
				$.extend(data, defaults, opts || {});
				sprite = new _Sprite($ele, data);
				$ele.data('sprite', sprite);
			}
		
		});
		
		// chain it
		return this;
	
	};
	
	/**
	 * @name $.fn.spriteAnimation
	 * @function
	 * @description The public api method for the spriteAnimation plugin.
	 * @param {mixed} method Either the public method we want to call, an options object, or a param needed for the method being called.
	 * @returns {object} The chained jQuery object.
	 */
	$.fn.spriteAnimation = function (method) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}		
	};
	
}(jQuery));