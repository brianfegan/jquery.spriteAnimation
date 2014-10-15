jquery.spriteAnimation
======================

A jQuery plugin that manages animation on elements using background sprites.

<p>This plugin is used to manage animation via a sprite used as a background image on an element.</p>
<p>Its built to accommodate responsive designs, but requires that the aspect ratio of the sprite is constant (i.e. 16:9, 4:3, etc.)</p>
<p>To reduce unneccesary processing on the CPU, the animation will pause when the window is resizing or not in focus, and will resume when the window resizing ends or the window has focus again.</p>
<p>NOTE: This plugin assumes the sprite image is ready to be manipulated before it is initialized. Secondly, it requires that background-size is a supported CSS attribute. So no IE8 and below. Sorry.</p>

<h2>HTML Setup</h2>
<p>If the sprite animation is static, or if JavaScript is being used to reset the dimensions of the <code>.animate-me</code> element onresize, the element with the <code>.aspect-ratio</code> class is not required.</p>
    <div class="aspect-ratio">
        <div class="animate-me"></div>
    </div>

<h2>CSS Setup</h2>
<p>If the sprite animation is static, or if JavaScript is being used to reset the dimensions of the <code>.animate-me</code> element onresize, the <code>.aspect-ratio</code> css is not required, as well as the CSS attributes for absolute positioning on <code>.animate-me</code>.</p>
    .aspect-ratio {
        position: relative;
        width: 100%;
    }
    .aspect-ratio:before {
        content: '';
        display: block;
        padding-top: 75%; /* 4:3 */
        padding-top: 56.25%; /* 16:9 */
        /* etc... */
    }
    .animate-me {
	    position: absolute;
	    top: 0;
	    left: 0;
	    bottom: 0;
	    right: 0;
		background-image: url(/path/to/sprite.jpg);
    }

<h2>Options</h2>
    aspectRatio: '16:9', // the aspect ratio of the animation ele.
    autoPlay: true, // will play when the plugin is initialized.
    frameSpeedMs: 80, // speed in milliseconds to animate through frames.
    loop: true, // will continuously loop animation. if false, animation plays only once.
    numberOfFrames: 60, // the number of frames used in the animation.
    onResizePauseMs: 350 // number of milliseconds animation will pause after a resize event.
    
<h2>Usage</h2>
    // initialize
    $('.animate-me').spriteAnimation(opts);
    
    // stop animation
    $('.animate-me').spriteAnimation('stop');
    
    // start animation
    $('.animate-me').spriteAnimation('start');
