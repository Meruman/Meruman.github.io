/*
	Astral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$panels = $main.children('.panel'),
		$nav = $('#nav'), $nav_links = $nav.children('a');

	settings = {

		// Carousels
		carousels: {
			speed: 8,
			fadeIn: true,
			fadeDelay: 0
		},

	};

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['361px', '736px'],
		xsmall: [null, '360px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 300);
	});

	// Nav.
	$nav_links
		.on('click', function (event) {

			var href = $(this).attr('href');

			// Not a panel link? Bail.
			if (href.charAt(0) != '#'
				|| $panels.filter(href).length == 0)
				return;

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Change panels.
			if (window.location.hash != href) {
                window.location.hash = href;
            } else {
                // Panel already visible
                var $active_panel = $(href);
                initCarousels($active_panel);
            }

		});
	

// Carousels.
function initCarousels($active_panel) {
	$active_panel.find('.carousel').each(function () {

	var $t = $(this),
		$forward = $('<span class="forward"></span>'),
		$backward = $('<span class="backward"></span>'),
		$reel = $t.children('.reel'),
		$items = $reel.children('article');

	var pos = 0,
		leftLimit,
		rightLimit,
		itemWidth,
		reelWidth,
		timerId;

	// Items.
	if (settings.carousels.fadeIn) {

		$items.addClass('loading');


		$t.scrollex({
			mode: 'middle',
			top: '-20vh',
			bottom: '-20vh',
			enter: function () {

				var timerId,
					limit = $items.length - Math.ceil($window.width() / itemWidth);

				timerId = window.setInterval(function () {
					var x = $items.filter('.loading'), xf = x.first();

					if (x.length <= limit) {

						window.clearInterval(timerId);
						$items.removeClass('loading');
						return;

					}

					xf.removeClass('loading');

				}, settings.carousels.fadeDelay);

			}
		});

	}

	// Main.
	$t._update = function () {
		pos = 0;
		rightLimit = (-1 * reelWidth) + document.getElementById("main").offsetWidth;
		leftLimit = 0;
		$t._updatePos();
	};

	$t._updatePos = function () { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };

	// Forward.
	$forward
		.appendTo($t)
		.hide()
		.mouseenter(function (e) {
			timerId = window.setInterval(function () {
				pos -= settings.carousels.speed;

				if (pos <= rightLimit) {
					window.clearInterval(timerId);
					pos = rightLimit;
				}

				$t._updatePos();
			}, 10);
		})
		.mouseleave(function (e) {
			window.clearInterval(timerId);
		});

	// Backward.
	$backward
		.appendTo($t)
		.hide()
		.mouseenter(function (e) {
			timerId = window.setInterval(function () {
				pos += settings.carousels.speed;

				if (pos >= leftLimit) {

					window.clearInterval(timerId);
					pos = leftLimit;

				}

				$t._updatePos();
			}, 10);
		})
		.mouseleave(function (e) {
			window.clearInterval(timerId);
		});

		reelWidth = $reel[0].scrollWidth;


		if (browser.mobile) {

			$reel
				.css('overflow-y', 'hidden')
				.css('overflow-x', 'scroll')
				.scrollLeft(0);
			$forward.hide();
			$backward.hide();

		}
		else {

			$reel
				.css('overflow', 'visible')
				.scrollLeft(0);
			$forward.show();
			$backward.show();

		}

		$t._update();

		$window.on('resize', function () {
			reelWidth = $reel[0].scrollWidth;
			$t._update();
		}).trigger('resize');

});}

	// Panels.

	// Initialize.
	(function () {

		var $panel, $link;

		// Get panel, link.
		if (window.location.hash) {

			$panel = $panels.filter(window.location.hash);
			$link = $nav_links.filter('[href="' + window.location.hash + '"]');

		}

		// No panel/link? Default to first.
		if (!$panel
			|| $panel.length == 0) {

			$panel = $panels.first();
			$link = $nav_links.first();

		}

		// Deactivate all panels except this one.
		$panels.not($panel)
			.addClass('inactive')
			.hide();


		// Activate link.
		$link
			.addClass('active');

		// Reset scroll.
		/* $window.scrollTop(0); */

	})();

	// Hashchange event.
	$window.on('hashchange', function (event) {

		var $panel, $link;

		// Get panel, link.
		if (window.location.hash) {

			$panel = $panels.filter(window.location.hash);
			$link = $nav_links.filter('[href="' + window.location.hash + '"]');

			// No target panel? Bail.
			if ($panel.length == 0){
				return;}

		}

		// No panel/link? Default to first.
		else {

			$panel = $panels.first();
			$link = $nav_links.first();

		}

		// Deactivate all panels.
		$panels.addClass('inactive');

		// Deactivate all links.
		$nav_links.removeClass('active');

		// Activate target link.
		$link.addClass('active');
		

		// Set max/min height.
		$main
			.css('max-height', $main.height() + 'px')
			.css('min-height', $main.height() + 'px');

		// Delay.
		setTimeout(function () {

			// Hide all panels.
			$panels.hide();

			// Show target panel.
			$panel.show();
			
			// Initialize carousels in active panel.
			initCarousels($panel);

			// Set new max/min height.
			$main
				.css('max-height', $panel.outerHeight() + 'px')
				.css('min-height', $panel.outerHeight() + 'px');

			// Reset scroll.
			/* $window.scrollTop(0); */

			// Delay.
			window.setTimeout(function () {

				// Activate target panel.
				$panel.removeClass('inactive');

				// Clear max/min height.
				$main
					.css('max-height', '')
					.css('min-height', '');

				// IE: Refresh.
				$window.triggerHandler('--refresh');

				// Unlock.
				locked = false;

			}, (breakpoints.active('small') ? 0 : 500));

		}, 250);

	});

	// Panels.
	$panels.each(function () {

		var $this = $(this);

		// Initialize carousels in this panel.
		initCarousels($this);

	});

	// IE: Fixes.
	if (browser.name == 'ie') {

		// Fix min-height/flexbox.
		$window.on('--refresh', function () {

			$wrapper.css('height', 'auto');

			window.setTimeout(function () {

				var h = $wrapper.height(),
					wh = $window.height();

				if (h < wh)
					$wrapper.css('height', '100vh');

			}, 0);

		});

		$window.on('resize load', function () {
			$window.triggerHandler('--refresh');
		});

		// Fix intro pic.
		$('.panel.intro').each(function () {

			var $pic = $(this).children('.pic'),
				$img = $pic.children('img');

			$pic
				.css('background-image', 'url(' + $img.attr('src') + ')')
				.css('background-size', 'cover')
				.css('background-position', 'center');

			$img
				.css('visibility', 'hidden');

		});

	}

})(jQuery);