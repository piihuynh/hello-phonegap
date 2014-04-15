var flexslider,
		$win = jQuery(window),
		isMobile = navigator.userAgent.match(/Android|webOS|iOS|iPhone|iPad|iPod|BlackBerry/i),
		is_iOS = navigator.userAgent.match(/iOS|iPhone|iPad|iPod/i);
jQuery(document).ready(function () {
    // navigation();
    navEvents();
    // searchDropdown();
    // cufon();
    // tabs();
    minimizePosts();
    // inputHovers();//pii
    // clearInputs();//pii
    ulfixesPost();
    inputFocus();
    // replyPopup();//pii
	commentReplies();//new-pii
    featuredPosts();
    // checkboxes();
    mobile();
	initFlexslider();
    /* Disable infinite scroll on Desktop */
    var windowSize = jQuery(window).width();
    if(windowSize > 768){
    	jQuery(window).unbind('.infscr');
    } else {
		// pii
		jQuery('#footer').click(function(){
			jQuery('html,body').animate({scrollTop:0},500);
		});
	}
    AllowZoom(false);
});

function navigation() {
	// jQuery('ul#nav:not(.mobile-menu)').hide();
	
    jQuery("ul#nav > li").each(function () {
        if (jQuery(this).children().size() == 1) {
            jQuery(this).addClass("lonely")
        } else {
            jQuery(this).addClass("popular")
            jQuery(this).find("a:eq(0)").addClass('parent');
            jQuery(this).find('a:eq(0) span').append('<span class="menu-item-arrow">&nbsp;</span>');
        }
    });
    jQuery("ul#nav ul").each(function () {
        jQuery(this).wrap('<div class="menu-div outerbox"></div>');
        jQuery(this).addClass('innerbox');
        jQuery(this).find("li:last-child").addClass("last");
    });

    jQuery("li.popular > div").addClass('children');
    jQuery(".children > ul > li > a").addClass('child');
    jQuery("li.popular div.children > div:first").addClass('grandchildren');

    jQuery(".children > ul > li > a.child").each(function () {
        if (jQuery(this).next().hasClass("outerbox")) {
            jQuery(this).append('<span class="menu-item-arrow">&nbsp;</span>');
        }
    });
    jQuery(".grandchildren a").addClass('grandchild');

    var configParents = {
        sensitivity: 2,
        interval: 150,
        over: function () {
            jQuery(this).addClass('active')
        },
        timeout: 300,
        out: function () {
            jQuery(this).removeClass('active')
        }
    };
    var configChildren = {
        sensitivity: 2,
        interval: 150,
        over: function () {
            jQuery(this).addClass('active')
        },
        timeout: 300,
        out: function () {
            jQuery(this).removeClass('active')
        }
    };

    jQuery("ul#nav > li").hoverIntent(configParents);
    jQuery(".children ul > li").hoverIntent(configChildren);

    jQuery("ul#nav ul li").hover(

    function () {
        jQuery(this).addClass("hover");
        jQuery(this).next().addClass("next");
    }, function () {
        jQuery(this).removeClass("hover");
        jQuery(this).next().removeClass("next");
    });
	
	jQuery('ul#nav:not(.mobile-menu) .sub-menu').show();
}

function searchDropdown() {
    jQuery('select').selectmenu();
    var monk_box_height = jQuery('#box-outer ul').height() + 15;
    jQuery('#box-outer ul').css('top', -monk_box_height)
    jQuery('#cat-menu').find('li:last').css({
        'padding-bottom': '4px'
    });
}

function cufon() {
	Cufon.now();
	// var windowSize = jQuery(window).width();
	// if(windowSize <= 768) return;	// Don't manipulate news headings with custom font in mobile.
	/*new-pii*/
	if(window.innerWidth <= 768) return;	// Don't manipulate news headings with custom font in mobile.
    Cufon.replace('h1.title,#footer h3,.post .text h2 a,.scrollContainer h2', {
        hover: true
    });
    Cufon.replace('#content #postcontainer .post h1,#content #postcontainer.newsletter-page h1, #content #postcontainer .post h2, #content #postcontainer .post h3, #content #postcontainer .post h4, #content #postcontainer .post h5, #content #postcontainer .post h6,#content #postcontainer .page h1, #content #postcontainer .page h2, #content #postcontainer .page h3, #content #postcontainer .page h4, #content #postcontainer .page h5, #content #postcontainer .page h6,#heading h2,h2.date,.share h2,.comments h2,.comment h2,h2.results');

}

function tabs() {
    jQuery("#tabs ul li").hover(

    function () {
        jQuery(this).prev().toggleClass("prev");
        jQuery(this).toggleClass("hover");
        jQuery(this).next().toggleClass("next");

    }, function () {

        jQuery(this).prev().toggleClass("prev");
        jQuery(this).toggleClass("hover");
        jQuery(this).next().toggleClass("next");

    });
    jQuery("#tab_top ul:not('.active')").hide();

    jQuery("#tabs ul.tabs li").click(

    function () {
        if (!jQuery(this).hasClass(".ui-tabs-selected")) {
            var new_index = parseInt(jQuery('ul.tabs li').index(jQuery(this)));

            jQuery('.ui-tabs-selected').removeClass('ui-tabs-selected');
            jQuery(this).addClass('ui-tabs-selected');

            jQuery('#tab_top ul.active').fadeOut(200, function () {
                jQuery("#tab_top ul").eq(new_index).fadeIn(200);
            });

            jQuery('#tab_top .cont').animate({
                height: jQuery("#tab_top ul").eq(new_index).height()
            }, 300, function () {
                jQuery("#tab_top ul.active").removeClass("active");
                jQuery("#tab_top ul").eq(new_index).addClass("active");

            });
        }
    });
}

function checkboxes() {
    jQuery("input").filter(":checkbox").checkbox();
}

function ulfixesPost() {
    jQuery('#content #postcontainer ol').each(function () {
        var positie = 0;
        jQuery(this).find('li').each(function () {
            positie += 1;
            var oud = (jQuery(this).css('backgroundImage'));
            var arrOud1 = oud.split("_");
            var arrOud2 = arrOud1[1].split(".");
            var nieuw = arrOud1[0] + "_" + positie + "." + arrOud2[1];
            jQuery(this).css({
                "backgroundImage": nieuw
            });
        })
    });
}

function minimizePosts() {
    jQuery("#content #posts .post a.hide").each(

    function () {
        jQuery(this).click(function () {
            jQuery(this).parents(".post").find('.min').slideToggle('slow');
        }).mouseup(function () {
            jQuery(this).toggleClass("clicked")
        }).mousedown(function () {
            jQuery(this).toggleClass("clicked")
        });
    });
}

function replyPopup() {
    var monkreplyid;
    var _popup = jQuery('#comment-popup');
    if (_popup.length) {
        jQuery('a.comment-reply').click(function () {
            // child support
            monkreplyid = jQuery(this).attr('id').split("-")[1];
            _popup.find("input#comment_parent").val(monkreplyid);

            if (jQuery(this).hasClass('active')) {
                jQuery(this).removeClass('active');
                hidePopup(jQuery(this));
            }
            else {
                jQuery(this).addClass('active');
                showPopup(jQuery(this));
            }
            return false;
        });
        _popup.find('#cancel-comment-reply-link').click(function () {
            hidePopup();
            return false;
        });
    }
    var t_btn = -1;


    function showPopup(_btn) {
        t_btn = _btn;
        t_btn.parent().addClass('active');
        _popup.css({
            top: _btn.offset().top + _btn.outerHeight(),
            left: _btn.offset().left
        });
    }

    function hidePopup(_btn) {
        t_btn.parent().removeClass('active');
        t_btn = -1;
        _popup.css({
            top: -9999
        });
    }
    
    jQuery(document).mousedown(function (e) {
        e = e || event;
        var t = e.target || e.srcElement;
        t = jQuery(t);
        if (t_btn != -1 && t.parents('div.popup-comment').length == 0 && t.parents('a.btn-reply').length == 0 && t.attr('id') != 'comment-popup' && !t.hasClass('btn-reply')) {
            hidePopup();
        }
    });
    jQuery(window).resize(function () {
        if (t_btn != -1) _popup.css({
            top: t_btn.offset().top + t_btn.outerHeight(),
            left: t_btn.offset().left
        });
    });

}

function inputHovers() {
    jQuery('.searchBtn, .emailBtn').hover(

    function () {
        jQuery(this).toggleClass('hover');
    }, function () {
        jQuery(this).toggleClass('hover');
    });
}

function clearInputs() {
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "text") {
            inputs[i].valueHtml = inputs[i].value;
            inputs[i].onfocus = function () {
                this.value = "";
            }
            inputs[i].onblur = function () {
                this.value != "" ? this.value = this.value : this.value = this.valueHtml;
            }
        }
    }
}

function inputFocus() {
    jQuery('input[type="text"],#textarea').focus(function () {
        jQuery(this).parent().removeClass("idleField").addClass("focusField");
    });
    jQuery('input[type="text"],#textarea').blur(function () {
        jQuery(this).parent().removeClass("focusField").addClass("idleField");
    });
}




function featuredPosts() {
    if (jQuery('#slider .scrollContainer > div').length == 0) {
        return;
    }
    var monk_panels=jQuery('#slider .scrollContainer > div');
    var monk_cont=jQuery('#slider .scrollContainer');
    monk_panels.css({
        'float':'left',
        'position':'relative'
    });
    monk_cont.css('width',monk_panels[0].offsetWidth*monk_panels.length);
    var scroll=jQuery('#slider .scroll').css('overflow','hidden');
    function selectNav(){
        jQuery(this).parents('ul:first').find('a').removeClass('selected').end().end().addClass('selected')
    }
    jQuery('#slider .navigation').find('a').click(selectNav);
    function trigger(data){
        var el=jQuery('#slider .navigation').find('a[href$="'+data.id+'"]').get(0);
        selectNav.call(el)
    }
    if(window.location.hash){
        trigger({
            id:window.location.hash.substr(1)
        })
    }else{
        jQuery('ul.navigation a:first').click()
    }
    var offset=parseInt((true?monk_cont.css('paddingTop'):monk_cont.css('paddingLeft'))||0)*-1;
    var scrollOptions={
        target:scroll,
        items:monk_panels,
        navigation:'.navigation a',
        axis:'xy',
        onAfter:trigger,
        offset:offset,
        duration:500,
        force:true,
        interval:10000,
        easing:'swing'
    };

    jQuery('#slider').serialScroll(scrollOptions);
}

function mobile() {
	var windowSize = jQuery(window).width();
    if(windowSize <= 768){
    	jQuery('#posts h2 a').each(function() {
	    	var newsHeading = jQuery(this).attr('title');
	    	jQuery(this).html(newsHeading);
    	});
    	jQuery('.sd2-ress-wrapper').height(200); // Override inline CSS for slider's height.
    	// Make full block of post clickable
    	jQuery('.text').each(function() {
	    	var url = jQuery('a', this).attr('href');
    		var a = jQuery('<a/>').attr('href', url);
	    	jQuery(this).wrap(a);
    	});
    	
		jQuery('.new-element').each(function() {
			jQuery(this).wrap('<a style="display: block;" href="' + jQuery('a', this).attr('href') + '" />')
		});    	
    	
     	jQuery('.new-element h1.title a, .new-element .thumb_cont a').removeAttr('href');
		jQuery('.new-element img').unwrap();    	
    	
    	jQuery('.new-element').removeClass('new-element'); 
 
	    	
    } else {
	    jQuery('.page-navigation.category').show();
    }
}

function navEvents() {
	jQuery('#mobile-navigation').click(function(e) {
		e.preventDefault();
		jQuery('#search').slideUp(function() {
			jQuery('#navigation').slideToggle();
		});
	});
	jQuery('#mobile-search').click(function(e) {
		e.preventDefault();
		jQuery('#navigation').slideUp(function() {
			jQuery('#search').slideToggle();
		});
	});
}

function AllowZoom(flag) {
  if (flag == true) {
    jQuery('head meta[name=viewport]').remove();
    jQuery('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10.0, minimum-scale=1, user-scalable=1" />');
  } else {
    jQuery('head meta[name=viewport]').remove();
    jQuery('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0" />');              
  }
}

/*pii*/
function commentReplies(){

	if (jQuery('#respond').length == 0) return;
	
	var lastAuthorName = window.localStorage.getItem('comment_author'),
		lastAuthorEmail = window.localStorage.getItem('comment_email');
	
	setTimeout(function(){
		jQuery('#author').attr('placeholder','Ime');
		jQuery('#comment-textarea').attr('placeholder','Komentar');
		/*get back remembered name & email..*/
		if (jQuery('#author').length && !jQuery('#author').val().length && lastAuthorName)
			jQuery('#author').val(lastAuthorName);
		if (jQuery('#email').length && !jQuery('#email').val().length && lastAuthorEmail)
			jQuery('#email').val(lastAuthorEmail);
	},0);
	
	var $responseBlock = jQuery('#respond'),
		$responseParentInput = $responseBlock.find('#comment_parent'),
		$cancelReplyButton = jQuery('<a>',{'href':'javascript:;'}).html('Poništi odgovor')
			.css({'display':'none','margin':'2px 6px','font-size':'14px'})
			.on('click',function(){
				$responseParentInput.val(0);
				$responseBlock.appendTo(jQuery('#postcontainer'));
				$cancelReplyButton.hide();
				
				// back to previous styles
				$responseBlock.css({'float': 'none','max-width': 'none','padding-top': 0,'margin-top':0,'margin-bottom': 0})
					.find('.col-right').css({'max-width': 'none'})
					.find('.area-holder').css({'max-width': 'none'});
				
				// change "Reply" back to "Comment"
				$responseBlock.find('.holder h2:first').empty().html('Komentari');
					
				// scroll to bottom to see it again
				jQuery('html,body').animate({scrollTop: $responseBlock[0].offsetTop }, 500);
			})
			.appendTo($responseBlock.find('.notify'));
	
	// change "Comment" just for sync
	if (window.innerWidth > 768) $responseBlock.find('.holder h2:first').empty().html('Komentari');
	
	jQuery('.comments.block > .comments > .comment > .info').on('click','.comment-reply',function(){
		var $parentBlock = jQuery(this).closest('.comment'),
			isMobile = window.innerWidth <= 768,
			colRightMaxWidth = !isMobile ? '338px' : '100%';
			
		// additional styles
		$responseBlock.css('margin-top','15px')
			.find('.col-right').css({'max-width': colRightMaxWidth})
			.find('.area-holder').css({'max-width': '100%'});
			
		$responseParentInput.val( $parentBlock.attr('id').replace(/comment-/,'') );
		if ($parentBlock.find('.children').length) {
			$parentBlock.find('.children').prepend($responseBlock);
			if (isMobile) {
				$responseBlock.css({'float': 'none','max-width': 'none','padding-top': '0','margin-bottom': '10px'});
			} else {
				$responseBlock.css({'margin-bottom': '7px'});
			}
		} else {
			$parentBlock.append($responseBlock);
			if (isMobile) {
				$responseBlock.css({'float': 'right','max-width': '90%','padding-top': '40px','margin-bottom': '10px'});
			} else {
				$responseBlock.css({'margin-bottom': '7px'}).find('.col-right').css({'max-width': '363px'});	
			}
		}
		$cancelReplyButton.show();
		
		// change "Comment" to "Reply"
		$responseBlock.find('.holder h2:first').empty().html('Odgovori');
		
	});
	
	jQuery('.comment-form').submit(function(){
		/*remember name & email..*/
		var newAuthorName = jQuery.trim(jQuery('#author').val()),
			newAuthorEmail = jQuery.trim(jQuery('#email').val());
		if (jQuery('#author').length && newAuthorName.length && lastAuthorName != newAuthorName) {
			window.localStorage.setItem('comment_author',newAuthorName);
		}
		if (jQuery('#email').length && jQuery('#email').val().length && lastAuthorEmail != newAuthorEmail) {
			window.localStorage.setItem('comment_email',newAuthorEmail);
		}
	});
}

/*define localStorage if not exist or iOS, by using cookie*/
if (!window.localStorage || navigator.userAgent.match(/iOS|iPhone|iPad|iPod/i)) {
  Object.defineProperty(window, "localStorage", new (function () {
    var aKeys = [], oStorage = {};
    Object.defineProperty(oStorage, "getItem", {
      value: function (sKey) { return sKey ? this[sKey] : null; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "key", {
      value: function (nKeyId) { return aKeys[nKeyId]; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "setItem", {
      value: function (sKey, sValue) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "length", {
      get: function () { return aKeys.length; },
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "removeItem", {
      value: function (sKey) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    this.get = function () {
      var iThisIndx;
      for (var sKey in oStorage) {
        iThisIndx = aKeys.indexOf(sKey);
        if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
        else { aKeys.splice(iThisIndx, 1); }
        delete oStorage[sKey];
      }
      for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
      for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
        aCouple = aCouples[nIdx].split(/\s*=\s*/);
        if (aCouple.length > 1) {
          oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
          aKeys.push(iKey);
        }
      }
      return oStorage;
    };
    this.configurable = false;
    this.enumerable = true;
  })());
}

function initFlexslider(){
	if (!jQuery.flexslider) return;
	var $flexSliderWrp = jQuery('.related-section .flexslider');
	var lastWindowWidth = window.innerWidth;
	
	if ($flexSliderWrp && flexslider == null){
		var useCSS;
		var itemWidth = getFlexSliderItemWidth();
		var itemMargin = 28;
		// var itemMargin = 30;
		var animationSpeed = 600;
		var maxItems = 2;
		
		var forceTurnOffCarousel = false;
		// var forceTurnOffCarousel = true;
		
		if (isMobile || window.innerWidth <= 768) {
			itemMargin = 0;
			maxItems = 1;
			forceTurnOffCarousel = true;
			animationSpeed = 500;

			$flexSliderWrp.find('.slides > li').css({'width':itemWidth+10+'px'});
		}

		// $flexSliderWrp.addClass('not_use_css');

		if (is_iOS) {
			useCSS = false;
			$flexSliderWrp.addClass('ios');
			animationSpeed = 400;
		}

		flexslider = $flexSliderWrp.flexslider({
			animation: "slide",
			// animationLoop: animationLoop,
			// startAt: startAt, //Integer: The slide that the slider should start on. Array notation (0 = first slide)
			slideshow: false,
			itemWidth: itemWidth,
			itemMargin: itemMargin,
			minItems: 1,
			maxItems: maxItems,
			keepShowingPos: true,
			animationSpeed: animationSpeed,            //Integer: Set the speed of animations, in milliseconds
			
			forceTurnOffCarousel: forceTurnOffCarousel,

			useCSS: useCSS,
			

			// controlNav: false
			// directionNav: false
		}).data('flexslider');

		$win.on('resize.related-section-flexslider',function(){
			if (flexslider) {
				flexslider.vars.itemWidth = getFlexSliderItemWidth();
				if (window.innerWidth <= 768) {
					flexslider.vars.itemMargin = 0;
					flexslider.vars.maxItems = 1;
					flexslider.vars.forceTurnOffCarousel = true;
				}else{
					flexslider.vars.itemMargin = 28;
					flexslider.vars.maxItems = 2;
					flexslider.vars.forceTurnOffCarousel = false;
				}
				if (lastWindowWidth < 768 && window.innerWidth > 768
				|| lastWindowWidth > 768 && window.innerWidth < 768
				){
					// reset flexslider
					// flexslider.doMath();
					// update slider.slides
					// flexslider.slides = jQuery(flexslider.vars.selector + ':not(.clone)', flexslider);
					// re-setup the slider to accomdate new slide
					// flexslider.setup();
					// refresh
					window.location.reload();
					lastWindowWidth = window.innerWidth;
				}
			}
		});

		setTimeout(function(){
			jQuery('.related-section').show();
			$win.trigger('resize');
		},0);
	}
}

function getFlexSliderItemWidth(){

	var cssItemWidth = 276,
		cssMargin = 10;

	if(window.innerWidth <= 320){ // iPhone 3+4+5 portrait / Crappy Android landscape
		cssItemWidth = 276;
		cssMargin = 10;
	}else if(window.innerWidth <= 384){ // Android (Nexus 4) portrait
		cssItemWidth = 300;
		cssMargin = 20;
	}else if(window.innerWidth <= 480){ // iPhone 3+4 landscape
		cssItemWidth = 345;
		cssMargin = 46;
	}else if(window.innerWidth <= 568){ // iPhone 5 landscape
		cssItemWidth = 345;
		cssMargin = 46;
	}else if(window.innerWidth <= 600){ // Android (Nexus 4) landscape / Kindle portrait
		cssItemWidth = 345;
		cssMargin = 46;
	}else if(window.innerWidth <= 768){ // iPad portrait
		cssItemWidth = 380;
		cssMargin = 56;
	}else{ // desktop
		cssItemWidth = 267;
		cssMargin = 0;
	}

	return cssItemWidth+cssMargin;
}
