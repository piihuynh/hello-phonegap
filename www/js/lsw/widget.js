// alert('zzzzzzzzzzzzzzz');
var template_live_status_bar = _.template(jQuery('#template_live_status_bar').text(), null, { variable: "data" }),
	template_result_status_bar = _.template(jQuery('#template_result_status_bar').text(), null, { variable: "data" }),
	template_live_score_cols = _.template(jQuery('#template_live_score_cols').text(), null, { variable: "data" }),
	template_live_new_score_col = _.template(jQuery('#template_live_new_score_col').text(), null, { variable: "data" }),
	template_column_name = _.template(jQuery('#template_column_name').text(), null, { variable: "data" }),
	template_live_row = _.template(jQuery('#template_live_row').text(), null, { variable: "data" }),
	template_schedule_row = _.template(jQuery('#template_schedule_row').text(), null, { variable: "data" }),
	template_result_row = _.template(jQuery('#template_result_row').text(), null, { variable: "data" }),
	is_switch_to_finished_once = false,
	DISABLE_GAME_SCORE = !true,
	// DEBUG = !/tenisuzivo\.com/i.test(window.location.href),
	DEBUG = true,
	// GET_FEED_INTERVAL = DEBUG ? 30000 : 60000,
	GET_FEED_INTERVAL = 30000,
	FDAYS_NEG_1_INTERVAL = 30*1000, // 30s -> LIVE feeds only
	// FDAYS_0_INTERVAL = 1*60*1000, // 1 min -> TODAY (live,finished,schedule) feeds // test
	// FDAYS_1_INTERVAL = 3*60*1000, // 2 min -> TODAY (live,finished,schedule) feeds // test
	// FDAYS_2_INTERVAL = 6*60*1000, // 3 min -> TODAY (live,finished,schedule) feeds // test
	FDAYS_0_INTERVAL = 1*60*1000, // 1 min -> TODAY (live,finished,schedule) feeds
	FDAYS_1_INTERVAL = 1*60*60*1000, // 1 hr -> tomorrow (Schedule) feeds
	FDAYS_2_INTERVAL = 2*60*60*1000, // 2 hrs -> a day after tomorrow (Schedule) feeds
	defaultFdays = 0,
	defaultDelayTime = FDAYS_0_INTERVAL,
	// defaultDelayTime = FDAYS_1_INTERVAL,
	// defaultDelayTime = FDAYS_NEG_1_INTERVAL,
	calledTimes = 0,
	isGettingLiveFeeds = false,
	ignore_finished_matches = false;
	
;(function ($) {

	// "use strict";

	$(window).load(function () {

		var $win = $(window),
			isGreenDotOff = false,
			isMobile = navigator.userAgent.match(/Android|webOS|iOS|iPhone|iPad|iPod|BlackBerry/i),
			is_iOS = navigator.userAgent.match(/iOS|iPhone|iPad|iPod/i);

		var lswData = {},
			$lswWrp,// = $('#lsw_wrp'),
			$lswWrp_mobile,
			$lswWrp_desktop,
			$lswWrps,
			// last_server_index = 0,
			flexslider = null,
			isInitForDesktop = false,
			isInit = false,
			current_tab = 0;

		var itemWidth = 260,
			itemMargin = 31,
			maxItems = 3,
			windowWidth = window.innerWidth,
			animationLoop = false,
			startAt = 0,
			forceTurnOffCarousel = false,
			useCSS = true;

		function initSlider(){
			if (flexslider == null /*&& isMobile*/ && window.innerWidth <= 768) {

				// $lswWrp.addClass('not_use_css');

				if (is_iOS) {
					useCSS = false;
					$lswWrp.addClass('ios');
				}

				$lswWrp.addClass('flexslider')
					.find('.tab_contents').addClass('slides');
				// move lsw widget wrapper to above of slidedeck wrapper
				$lswWrp.find('.tab_content_live').prepend(
						$lswWrp.find('.tab_title_live').children()
					);
				$lswWrp.find('.tab_content_finished').prepend(
						$lswWrp.find('.tab_title_finished').children()
					);
				$lswWrp.find('.tab_content_schedule').prepend(
						$lswWrp.find('.tab_title_schedule').children()
					);

				$lswWrp.find('.bottom_link').each(function(i,linkWrp){
					var $linkWrp = $(linkWrp);
					$linkWrp.appendTo($linkWrp.parent().find('.matchs_wrp'));
				});

				itemWidth = getFlexSliderItemWidth();
				itemMargin = 0;
				maxItems = 1;
				animationLoop = true;
				// startAt = 0;
				forceTurnOffCarousel = true;

				$lswWrp.find('.slides > li').css({'width':itemWidth+10+'px'});

				flexslider = $lswWrp.flexslider({
					animation: "slide",
					// animation: "fade",
					// animationLoop: animationLoop,
					startAt: startAt, //Integer: The slide that the slider should start on. Array notation (0 = first slide)
					slideshow: false,
					itemWidth: itemWidth,
					itemMargin: itemMargin,
					minItems: 1,
					maxItems: maxItems,
					keepShowingPos: true,
					// animationSpeed: 300,            //Integer: Set the speed of animations, in milliseconds
					
					forceTurnOffCarousel: forceTurnOffCarousel,

					useCSS: useCSS,

					// controlNav: false
					directionNav: false
				}).data('flexslider');

				$win.on('resize.flexslider',function(){
					if (window.innerWidth <= 768) {
						flexslider.vars.itemWidth = getFlexSliderItemWidth();
					}
				});
				
				$greenLive2ndDot = $('.green_dot.the_2nd_dot');

				setTimeout(function(){
					$win.trigger('resize');
				},0);
			}
			
			var eventClick = 'ontouchstart' in window ? 'touchstart' : 'click';
			$lswWrp.find('.match_row').on(eventClick,function(){
				var $this = $(this);
				if(/tenisuzivo/.test($this.attr('href'))){
					// $this.addClass('hover');
					$this.css({background: 'rgba(255, 255, 255, .1)'});
					// $win.trigger('resize');
					setTimeout(function(){
						// $this.removeClass('hover');
						$this.css({background: 'none'});
					},1000);
				}
			});
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
			}else{// if(window.innerWidth == 768){ // iPad portrait
				cssItemWidth = 380;
				cssMargin = 56;
			}

			return cssItemWidth+cssMargin;
		}

		function initForDesktop(){
			if (isInitForDesktop) return;
			
			$lswWrp.find('.tab_titles a').click(function(){
				var $this = $(this);
				
				if ($this.parent().hasClass('active')) return false;
				
				$lswWrp.find('.tab_titles .active').removeClass('active');
				$this.parent().addClass('active');
				
				var cb = function(){
					$lswWrp.find($this.attr('ref')).css('opacity',0)
						.addClass('active')
						.animate({opacity:1},400);
				}
				
				if(!$lswWrp.find('.tab_contents .active').length) {
					cb();
				} else {
					$lswWrp.find('.tab_contents .active').animate({opacity:0},100,function(){
						$(this).removeClass('active');
						cb();
					});
				}
				
			});

			// set local time
			// var UTC_time_str = (new Date).toTimeString().replace(/:[^:]+ GMT/,' GMT').replace(/ \([\s\S]+\)$/,''),
				// timeStr = UTC_time_str.replace(/^(\d\d):(\d\d) [\s\S]*$/,'<span class="hrs">\$1</span><span class="clock_blinker">:</span><span class="mins">\$2</span>'),
				// utcStr = UTC_time_str.replace(/^\d\d:\d\d( [\s\S]*)$/,'\$1').replace(/\+(\d\d)(\d\d)/,' +\$1:\$2');

			// $('.locale_time').html(timeStr + utcStr);
			
			// var $localeTimeHolder = $('.locale_time'),
				// $localeTimeHours = $localeTimeHolder.find('.hrs'),
				// $localeTimeMins = $localeTimeHolder.find('.mins'),
				// tiktok = function(){
					// $localeTimeHours.empty().html(
							// (new Date).toTimeString().replace(/^(\d\d):\d\d[\s\S]*$/,'\$1')
						// );
					// $localeTimeMins.empty().html(
							// (new Date).toTimeString().replace(/^\d\d:(\d\d)[\s\S]*$/,'\$1')
						// );
					// setTimeout(tiktok,60000); // 60 secs
				// };
			// tiktok();
			
			switch(startAt){
				case 0: activeTab('live'); break;
				case 1: activeTab('finished'); break;
				case 2: activeTab('schedule'); break;
			}
			
			isInitForDesktop = true;
		}

		function activeTab(type) {
			$lswWrp_desktop.find('.active').removeClass('active');
			$lswWrp_desktop.find('.tab_titles .tab_title_'+type).addClass('active');
			$lswWrp_desktop.find('.tab_contents .tab_content_'+type).addClass('active');
		}
		
		$lswWrp_desktop = $('.lsw_wrp:first');
		if($('#tabs').length) $lswWrp_desktop.insertBefore($('#tabs'));
		$lswWrp_mobile = $lswWrp_desktop.clone(true,true);
		if($('#content .lsw-full-width').length)
			$lswWrp_mobile.insertBefore($lswWrp_desktop);
		else
			$lswWrp_mobile.insertBefore($('.sd2-ress-wrapper'));
		$lswWrps = $('.lsw_wrp');
		var $greenLive2ndDot = $('.green_dot.the_2nd_dot');
		
		// $lswWrps = [$lswWrp_desktop[0],$lswWrp_mobile[0]];
		if(DISABLE_GAME_SCORE) $lswWrps.addClass('no_game_score');

		if (isMobile || window.innerWidth <= 768) $lswWrps.addClass('is_mobile');

		function initLSW(byResize){
			if (typeof byResize == 'undefined') byResize = false;

			if (isInit && !byResize) return;

			// init active (current is live tab)
			if (!isInitActiveTab){

				if(typeof lswData.live == 'undefined'){
					if (typeof lswData.schedule != 'undefined') {
						startAt = 2;
					} else {
						startAt = 1;
					}
				}else{
					startAt = 0;
				}
				
				// base on /livescore#hash
				if(window.location.hash=='#result') startAt = 1;
				else if(window.location.hash=='#schedule') startAt = 2;

				isInitActiveTab = true;
			}

			if (window.innerWidth > 768) {
				
				// just orientated to landscape (e.g iPad)
				// $lswWrp_mobile.hide();
				$lswWrp_mobile.addClass('tmp_hi');
				// $lswWrp_desktop.show();
				$lswWrp = $lswWrp_desktop;
			
				initForDesktop();
			} else {

				// $lswWrp_desktop.hide();
				$lswWrp_desktop.addClass('tmp_hi');
				// $lswWrp_mobile.show();
				$lswWrp = $lswWrp_mobile;

				initSlider();

			}

			if (!isInit) {
				$win.on('resize.redraw-lsw',function(){
					initLSW(true);
				});//.trigger('resize.redraw-lsw');
			}

			// show widget
			$lswWrp.removeClass('tmp_hi');

			isInit = true;
		}


		var tz_offset = (new Date).getTimezoneOffset()+''
		,isLiveScorePage = $('body').hasClass('page-id-11')
		,isInitActiveTab = false
		,numOfMatchs = {
			'live': 0,
			'schedule': 0,
			'finished': 0
		}
		// ,all_tour_ids = {
		,all_tour_n_match_ids = {
			'live': [],
			'schedule': [],
			'finished': []
		}
		// ,all_match_ids = {
			// 'live': [],
			// 'schedule': [],
			// 'finished': []
		// }
		,all_backup_match_ids = {
			'live': [],
			'schedule': [],
			'finished': []
		}
		,maxMatches = isLiveScorePage?99:(window.innerWidth>768&&!isMobile?4:3)
		,maxNumOfMatchs = {
			'live': maxMatches,
			'schedule': maxMatches,
			'finished': maxMatches
		};
	
		// show widget again
		function showLiveScoreWidget(){
			
		}
		// hide widget when error occur while getting feeds
		function hideLiveScoreWidget(){
			
		}
		
		function removeRow(type, tournament_id, match_id){

			if(type!='finished') numOfMatchs[type]--;

			// if (window.innerWidth <= 768) {

			// 	$lswWrp.find('.tab_content_'+type).find('.'+tournament_id).each(function(i,court){
			// 		if ($(court).find('.match_row').length == 1) {

			// 			// if there is no match in tournament -> remove tournament
			// 			$(court).remove();
			// 			delete lswData[type]['tournaments'][tournament_id];

			// 		} else {

			// 			$(court).find('.'+match_id).remove();
			// 			delete lswData[type]['tournaments'][tournament_id]['matchs'][match_id];
						
			// 		}
			// 	});			

			// } else {

				if ($lswWrp.find('.tab_content_'+type).first().find('.'+tournament_id).find('.match_row').length == 1) {

					// if there is no match in tournament -> remove tournament
					$lswWrps.find('.tab_content_'+type).find('.'+tournament_id).remove();
					delete lswData[type]['tournaments'][tournament_id];

				} else {

					// remove match row only
					$lswWrps.find('.tab_content_'+type).find('.'+tournament_id+' .'+match_id).remove();
					delete lswData[type]['tournaments'][tournament_id]['matchs'][match_id];
					
				}

			// }
		}
		
		function updateLiveMatchScore(score_type /*score or tb_score*/, holder,infor){
			holder.find('.p'+infor.player+'_current_'+score_type).html(infor.newScore+'');
			// re-set opaque
			if (infor.oldScore < infor.otherScore){
				// already opaque (less than)
				if (infor.newScore == infor.otherScore){
					// equal now -> remove opaque
					holder.find('.p'+infor.player+'_current_'+score_type).removeClass('opaque');
				} // else -> still less than
			} else {
				// not opaque (equal or greater) --> always greater other player
				holder.find('.p'+(3-infor.player)+'_current_'+score_type).addClass('opaque');
			}
		}
		
		function updateLiveMatchInfor(type, tournament_id, match_id, oldMatchData, newMatchData){
		
			var matchHolder = /*window.innerWidth <= 768 ?*/ $lswWrps.find('.tab_content_'+type).find('.inner_matchs_wrp').find('.'+tournament_id).find('.'+match_id) /*: lswData[type]['tournaments'][tournament_id]['tournament_wrp'].find('.'+match_id)*/,
				old_cur_set = parseInt(oldMatchData.current_set),
				new_cur_set = parseInt(newMatchData.current_set),
				// old scores/points
				p1_old_score = parseInt(oldMatchData.player_1.current_score),
				p1_old_tb_score = oldMatchData.player_1.current_tb_score ? parseInt(oldMatchData.player_1.current_tb_score) : 0,
				p1_old_point = oldMatchData.player_1.current_point == 'A' ? 50 : parseInt(oldMatchData.player_1.current_point),

				p2_old_score = parseInt(oldMatchData.player_2.current_score),
				p2_old_tb_score = oldMatchData.player_2.current_tb_score ? parseInt(oldMatchData.player_2.current_tb_score) : 0,
				p2_old_point = oldMatchData.player_2.current_point == 'A' ? 50 : parseInt(oldMatchData.player_2.current_point),
				// new scores/points
				p1_new_score = parseInt(newMatchData.player_1.current_score),
				p1_new_tb_score = newMatchData.player_1.current_tb_score ? parseInt(newMatchData.player_1.current_tb_score) : 0,
				p1_new_point = newMatchData.player_1.current_point == 'A' ? 50 : parseInt(newMatchData.player_1.current_point),

				p2_new_score = parseInt(newMatchData.player_2.current_score),
				p2_new_tb_score = newMatchData.player_2.current_tb_score ? parseInt(newMatchData.player_2.current_tb_score) : 0,
				p2_new_point = newMatchData.player_2.current_point == 'A' ? 50 : parseInt(newMatchData.player_2.current_point),

				old_big_val = old_cur_set*100000+(p1_old_score+p2_old_score+1)*1000+(p1_old_tb_score+p2_old_tb_score)*100+p1_old_point+p2_old_point,
				new_big_val = new_cur_set*100000+(p1_new_score+p2_new_score+1)*1000+(p1_new_tb_score+p2_new_tb_score)*100+p1_new_point+p2_new_point;
			
			// if (DEBUG) console.log(old_big_val,'===>',new_big_val);
			
			// if (old_cur_set < new_cur_set
				// || old_big_val < new_big_val
				// || (old_big_val == new_big_val && (newMatchData.player_1.current_point == 'A'||newMatchData.player_2.current_point == 'A'))

				// || (newMatchData.is_cancelled && typeof oldMatchData.is_cancelled == 'undefined')
				// || (newMatchData.game_time != oldMatchData.game_time)
				
			// )
			{
				// var newHTML = template_live_row(newMatchData);
				// newHTML = newHTML.replace(/<a[^>]*>([\s\S]+)<\/a>/,'\$1');
				// matchHolder.empty().html(newHTML);

				// add animation for changing cell
				// check if change serving turn
				if (oldMatchData.player_serving != newMatchData.player_serving){
					matchHolder.find('.c_ball .current_ball').addClass('ball_changing');
				}
				
				// check if change point
				if (oldMatchData.player_1.current_point != newMatchData.player_1.current_point){
					matchHolder.find('.p1_current_point').addClass('score_changing');
				}
				if (oldMatchData.player_2.current_point != newMatchData.player_2.current_point){
					matchHolder.find('.p2_current_point').addClass('score_changing');
				}
				
				// check if change score
				if (oldMatchData.player_1.current_score != newMatchData.player_1.current_score){
					matchHolder.find('.p1_current_score').addClass('score_changing');
				}
				if (oldMatchData.player_2.current_score != newMatchData.player_2.current_score){
					matchHolder.find('.p2_current_score').addClass('score_changing');
				}
				
				// check if change tb score
				if (oldMatchData.player_1.current_tb_score != newMatchData.player_1.current_tb_score){
					matchHolder.find('.p1_current_tb_score').addClass('score_changing');
				} else if (oldMatchData.player_2.current_tb_score != newMatchData.player_2.current_tb_score){
					matchHolder.find('.p2_current_tb_score').addClass('score_changing');
				}

				// check if cancelled by weather/smth..
				// if (newMatchData.is_cancelled){
					// matchHolder.find('.c_cancel').addClass('cancelled');
					// var cancelReason = newMatchData.cancel_reason || 'weather_light_showers';
					// matchHolder.find('.cancel_reason').addClass(cancelReason);
					// if(typeof oldMatchData.is_cancelled == 'undefined'){
						// matchHolder.find('.cancel_reason').addClass('time_changing');
					// }
				// }

				// check if changed time...
				if (newMatchData.game_time != oldMatchData.game_time){
					matchHolder.find('.time').addClass('time_changing');
				}

				// update new data
				// lswData[type]['tournaments'][tournament_id]['matchs'][match_id]['data'] = newMatchData;
			}
			
		}
		
		// function updateScheduleMatch(type, holder, infor){
		// 	switch(type){
		// 		case 'is_cancelled':
		// 			holder.find('.c_cancel').addClass('cancelled');
		// 			var cancelReason = infor.cancel_reason || 'weather_light_showers';
		// 			holder.find('.cancel_reason').addClass(cancelReason);
		// 			break;
		// 	}
		// }
		

		function updateScheduleMatchInfor(type, tournament_id, match_id, oldMatchData, newMatchData){
		
			var matchHolder = /*window.innerWidth <= 768 ?*/ $lswWrps.find('.tab_content_'+type).find('.inner_matchs_wrp').find('.'+tournament_id).find('.'+match_id) /*: lswData[type]['tournaments'][tournament_id]['tournament_wrp'].find('.'+match_id)*/;
				
			// check if cancelled by weather/smth..
			// if (
				// (newMatchData.is_cancelled && newMatchData.is_cancelled != oldMatchData.is_cancelled)
				// || (newMatchData.cancel_reason && newMatchData.cancel_reason != oldMatchData.cancel_reason)
				// || (newMatchData.game_time != oldMatchData.game_time)
				// || (newMatchData.is_live && newMatchData.is_live != oldMatchData.is_live)
				// || (newMatchData.post_permalink && newMatchData.post_permalink != oldMatchData.post_permalink)
			// )
			{
				// redraw
				// var newHTML = template_schedule_row(newMatchData);
				// newHTML = newHTML.replace(/<a[^>]*>([\s\S]+)<\/a>/,'\$1');
				// matchHolder.empty().html(newHTML);
				
				// +anim
				if (newMatchData.game_time != oldMatchData.game_time) {
					matchHolder.find('.cancel_reason').addClass('time_changing');
				}
			
				// update new data
				// lswData[type]['tournaments'][tournament_id]['matchs'][match_id]['data'] = newMatchData;
			}
		}
		
		function sort_finished_games(){
			
		}

		var backupData;
		function processData(data, cb){
			
			if (!data) {
				// $('.green_dot.the_2nd_dot.blinker').removeClass('blinker').addClass('off');
				if(!isGreenDotOff){$greenLive2ndDot.removeClass('blinker').addClass('off');isGreenDotOff=true;}
				$('.tab_content_wrapper').addClass('err no-data');
			} else {
			
				// sorting
				// go through types
				$.each(['finished', 'live', 'schedule'], function(i,type){
						
						// sort by tournaments
						if(!_.isEmpty(data[type]) && !_.isEmpty(data[type]['tournaments'])){
						
							// sort matches
							for(var tour_id in data[type]['tournaments']) {
								var tournament = data[type]['tournaments'][tour_id];
								var numericIndexMatches = _.values(tournament['matchs']);
								// sort by time game
								if(!_.isEmpty(tournament['matchs']) && _.size(tournament['matchs']) > 1){
									numericIndexMatches = _.sortBy(numericIndexMatches, function(match){
													if(match.game_type=='finished') return -1*match.game_timestamp_gmt;
													return match.game_timestamp_gmt;
												});
								}
								data[type]['tournaments'][tour_id]['matchs'] = numericIndexMatches;
							}
							
							// console.log('asdfasdfasfasdfsdf',data[type]['tournaments']);
							
							// sort tournaments
							if(_.size(data[type]['tournaments'])>1){
								var numericIndexTours = _.values(data[type]['tournaments']);
								 numericIndexTours = _.sortBy(numericIndexTours, function(tournament){
												if(tournament.game_type == 'finished') return -1*(tournament.datestamp_gmt + tournament['matchs'][0].game_timestamp_gmt);
												return (tournament.datestamp_gmt + tournament['matchs'][0].game_timestamp_gmt);
											});
								
								data[type]['tournaments'] = numericIndexTours;
							}
						}
				});// end sorting
				
				// remove rows which are not appearing in new feeds
				if (lswData) {
				
					// var live_match_ids = !lswData['live'] || !lswData['live']['tournaments'][tournament_id] || _.isEmpty(lswData['live']['tournaments'][tournament_id]['matchs']) ? [] : _.keys(lswData['live']['tournaments'][tournament_id]['matchs']);
					// var finished_match_ids = !lswData['finished'] || !lswData['finished']['tournaments'][tournament_id] ||  _.isEmpty(lswData['finished']['tournaments'][tournament_id]['matchs']) ? [] : _.keys(lswData['finished']['tournaments'][tournament_id]['matchs']);
					// var schedule_match_ids = !lswData['schedule'] || !lswData['schedule']['tournaments'][tournament_id] ||  _.isEmpty(lswData['schedule']['tournaments'][tournament_id]['matchs']) ? [] : _.keys(lswData['schedule']['tournaments'][tournament_id]['matchs']);
					backupData = _.cloneDeep(lswData);
					all_backup_match_ids['schedule'] = [];
					// get all schedule match ids
					if(backupData['schedule'] && backupData['schedule'].num_of_games>0){
						for(var tournament_id in backupData['schedule']['tournaments']){
							for(var match_id in backupData['schedule']['tournaments'][tournament_id]['matchs']){
								all_backup_match_ids['schedule'].push(match_id);
							}
						}
					}
					
					for(var type in lswData){
					
						if(type=='finished') continue;// not remove finished rows
					
						// if (typeof data[type] == 'undefined'){
						
							// remove all tab contents
							// for(var tournament_id in lswData[type]['tournaments']){
								// for(var match_id in lswData[type]['tournaments'][tournament_id]['matchs']){
									// removeRow(type, tournament_id, match_id);
								// }
							// }
							// delete lswData[type];
							
						// } else {
						
							// remove by tournament_id
							for(var tournament_id in lswData[type]['tournaments']){
							
								// if ( typeof data[type]['tournaments'][tournament_id] == 'undefined') {
								
									// remove all match in tournament_id
									// for(var match_id in lswData[type]['tournaments'][tournament_id]['matchs']){
										// removeRow(type, tournament_id, match_id)
									// }
									// delete lswData[type]['tournaments'][tournament_id];
									
								// } else {
								
									// remove by match_id not exists
									for(var match_id in lswData[type]['tournaments'][tournament_id]['matchs']){
									// for(var index in lswData[type]['tournaments'][tournament_id]['matchs']){
										// if (typeof data[type]['tournaments'][tournament_id]['matchs'][match_id] == 'undefined') {
											// remove this row
											removeRow(type, tournament_id, match_id);
											// removeRow(type, tournament_id, lswData[type]['tournaments'][tournament_id]['matchs'][index]['id']);
										// }else{
											// if ((type=='live' || type=='finished')
												// &&  _.contains(schedule_match_ids, match_id)
											// ) {
												// removeRow('schedule', tournament_id, match_id);
											// }
											// if (type=='finished'
												// && (_.contains(live_match_ids, match_id)
												// )
											// ){
												// removeRow('live', tournament_id, match_id);
											// }
										// }
									}  // end for matchs in lswData
									
								// }
								
							} // end for tours in lswData
							
						// }
						
					} // end for types in lswData
				}
				 
				 // for each type (tab)
				 // initialize for all types / update for live
				for(var type in data){

					if (numOfMatchs[type] >= maxNumOfMatchs[type]){
						if(type!='finished'||!ignore_finished_matches) continue;
					}
					
					if (!lswData[type]){
						lswData[type] = {'tournaments':{}};
						lswData[type]['num_of_games'] = 0;
					}

					if(type!='finished'||!ignore_finished_matches) lswData[type]['num_of_games'] = data[type]['num_of_games'];
					
					// for each tournament/place
					for(var tour_index in data[type]['tournaments']){
					// for(var tournament_id in data[type]['tournaments']){

						if (numOfMatchs[type] >= maxNumOfMatchs[type])
							if(type!='finished'||!ignore_finished_matches)
								break;
					
						var tour = data[type]['tournaments'][tour_index]
						// var tour = data[type]['tournaments'][tournament_id]
							,tournament_id = tour['id'];
							
						// if($.inArray(tournament_id,all_tour_ids['finished'])!=-1)
						// if($.inArray(tour['tournament_id'],all_tour_ids['finished'])!=-1) continue;
						if(!_.isEmpty(lswData[type]['tournaments'][tournament_id])) continue;
							
						// if(type=='finished' && !ignore_finished_matches) all_tour_ids['finished'].push(tournament_id);
						
						if (!lswData[type]['tournaments'][tournament_id] && tour.name && tour.date) {
						
							// backup tournament
							lswData[type]['tournaments'][tournament_id] = {};
							// display tournament
							// if (numOfMatchs[type] < maxNumOfMatchs[type]) 
							{
								lswData[type]['tournaments'][tournament_id]['tournament_wrp'] = $('<div>', {'class':'court '+tournament_id});

								if (type == 'live') {
									lswData[type]['tournaments'][tournament_id]['status_bar'] = template_live_status_bar({tournament:tour.name+(tour.stage?' - '+tour.stage:''),date:tour.date});
								} else if (type == 'finished') {
									lswData[type]['tournaments'][tournament_id]['status_bar'] = template_result_status_bar({tournament:tour.name+(tour.stage?' - '+tour.stage:''),date:tour.date});
								} else {
									lswData[type]['tournaments'][tournament_id]['status_bar'] = template_result_status_bar({tournament:tour.name+(tour.stage?' - '+tour.stage:''),date:tour.date});
								}
								
								lswData[type]['tournaments'][tournament_id]['tournament_wrp'].append(lswData[type]['tournaments'][tournament_id]['status_bar']);
								if(!ignore_finished_matches || type!='finished')
									lswData[type]['tournaments'][tournament_id]['tournament_wrp'].appendTo($lswWrps.find('.tab_content_'+type).find('.inner_matchs_wrp'));
								else
									lswData[type]['tournaments'][tournament_id]['tournament_wrp'].prependTo($lswWrps.find('.tab_content_'+type).find('.inner_matchs_wrp'));
							}
						}
						
						// for each match
						// for(var match_id in tour['matchs']){
						for(var index in tour['matchs']){

							if (numOfMatchs[type] >= maxNumOfMatchs[type])
								if(type!='finished'||!ignore_finished_matches)
									break;
							
							// var matchData = tour['matchs'][match_id];
							var matchData = tour['matchs'][index], match_id = tour['matchs'][index]['id'];

							// last_server_index = matchData['last_server_index'];
							
							if (!lswData[type]['tournaments'][tournament_id]['matchs']) {
								lswData[type]['tournaments'][tournament_id]['matchs'] = {};
							}
							if (!lswData[type]['tournaments'][tournament_id]['matchs'][match_id]
								// || !lswData[type]['tournaments'][tournament_id]['matchs'][match_id]['html']
								// && numOfMatchs[type] < maxNumOfMatchs[type]
							) {
								// backup
								if (type == 'live') {
									// if(lswData['finished']['tournaments'][tournament_id] && lswData['finished']['tournaments'][tournament_id]['matchs'][match_id]) continue;
									
									lswData[type]['tournaments'][tournament_id]['matchs'][match_id] = {
										html: template_live_row(matchData),
										data: matchData
									}
									// switch to live tab auto
									if($.inArray(match_id,all_backup_match_ids['schedule'])!=-1){
										if (flexslider != null) {// for mobile
											if (flexslider.currentSlide==2) {
												flexslider.flexAnimate(0, true);
											}
										}else{// for desktop
											if($lswWrp_desktop.find('.tab_titles .tab_title_schedule').hasClass('active')) {
												$lswWrp_desktop.find('.tab_titles .tab_title_live > a').click();
											}
										}
									}
								} else if (type == 'finished') {
									lswData[type]['tournaments'][tournament_id]['matchs'][match_id] = {
										html: template_result_row(matchData),
										data: matchData
									}
									// save finished match id
									// if(type=='finished' && !ignore_finished_matches) all_match_ids['finished'].push(match_id);
									if(type=='finished' && !ignore_finished_matches) all_tour_n_match_ids['finished'].push({tournament_id:tournament_id,match_id:match_id});
								} else {
									lswData[type]['tournaments'][tournament_id]['matchs'][match_id] = {
										html: template_schedule_row(matchData),
										data: matchData
									}
								}
								// display
								if(!ignore_finished_matches || type!='finished')
									$lswWrps.find('.tab_content_'+type).find('.inner_matchs_wrp').find('.'+tournament_id).append(lswData[type]['tournaments'][tournament_id]['matchs'][match_id]['html']);
								else{
									$lswWrps.find('.tab_content_'+type).find('.inner_matchs_wrp').find('.'+tournament_id+' .status_bar').after(lswData[type]['tournaments'][tournament_id]['matchs'][match_id]['html']);
									
									// remove last finished match if needed
									if(numOfMatchs[type]>=maxMatches){
										var //all_finished_tour_ids = Object.keys(lswData[type]['tournaments']),
											// last_finished_tour_id = all_finished_tour_ids[all_finished_tour_ids.length-1],
											// last_finished_tour_id = all_tour_ids['finished'][all_tour_ids['finished'].length-1],
											last_finished_tour_n_match_id = all_tour_n_match_ids['finished'][all_tour_n_match_ids['finished'].length-1],
											last_finished_tour_id = last_finished_tour_n_match_id['tournament_id'],
											// all_finished_match_ids = Object.keys(lswData[type]['tournaments'][last_finished_tour_id]['matchs']),
											// last_finished_match_id = all_match_ids['finished'][all_match_ids['finished'].length-1];
											last_finished_match_id = last_finished_tour_n_match_id['match_id'];
										removeRow(type, last_finished_tour_id, last_finished_match_id);
										// delete all_tour_ids['finished'][all_tour_ids['finished'].length-1];
										// delete all_tour_n_match_ids['finished'][all_tour_n_match_ids['finished'].length-1];
										all_tour_n_match_ids['finished'].pop();
									}
								}
								
								if(type=='finished') lswData[type]['num_of_games']++;
								numOfMatchs[type]++;
								
								if (type!='finished' && backupData && backupData[type] && backupData[type]['tournaments'][tournament_id] && backupData[type]['tournaments'][tournament_id]['matchs'][match_id]) {
									if (type == 'live') {
										updateLiveMatchInfor(
											type
											, tournament_id
											, match_id
											, backupData[type]['tournaments'][tournament_id]['matchs'][match_id]['data'] // oldMatchData
											// , data[type]['tournaments'][tournament_id]['matchs'][match_id] // newMatchData
											// , data[type]['tournaments'][tournament_id]['matchs'][index] // newMatchData
											,matchData
										);
									} else if (type == 'schedule') {
										updateScheduleMatchInfor(
											type
											, tournament_id
											, match_id
											, backupData[type]['tournaments'][tournament_id]['matchs'][match_id]['data'] // oldMatchData
											// , data[type]['tournaments'][tournament_id]['matchs'][match_id] // newMatchData
											// , data[type]['tournaments'][tournament_id]['matchs'][index] // newMatchData
											,matchData
										);
									}
								}
							} else {
								// update current live matchs
								// if (lswData[type]['tournaments'][tournament_id]['matchs'][match_id]) {
									// if (type == 'live') {
										// updateLiveMatchInfor(
											// type
											// , tournament_id
											// , match_id
											// , lswData[type]['tournaments'][tournament_id]['matchs'][match_id]['data'] // oldMatchData
											// , data[type]['tournaments'][tournament_id]['matchs'][match_id] // newMatchData
										// );
									// } else if (type == 'schedule') {
										// updateScheduleMatchInfor(
											// type
											// , tournament_id
											// , match_id
											// , lswData[type]['tournaments'][tournament_id]['matchs'][match_id]['data'] // oldMatchData
											// , data[type]['tournaments'][tournament_id]['matchs'][match_id] // newMatchData
										// );
									// }
								// }
							}
						} // end for matchs
					} // end for tournaments
				} // end for types
				
				// show/hide bottom links,...
				jQuery.each(['live','schedule','finished'], function(i,type){

					if(numOfMatchs[type] <= 0){
						$lswWrps.find('.tab_content_'+type).addClass('err no-data');
					} else {
						$lswWrps.find('.tab_content_'+type).removeClass('err no-data');
						if(is_switch_to_finished_once && type=='live') is_switch_to_finished_once = false;//re-enable to switch once again
					}

					// if(numOfMatchs[t]>maxNumOfMatchs[t]){
					if(lswData[type] && lswData[type]['num_of_games']>maxNumOfMatchs[type]){
					// if((type=='finished' && lswData[type] && lswData[type]['num_of_games']>maxNumOfMatchs[type])
					// || numOfMatchs[type]>maxNumOfMatchs[type]){
					// if(numOfMatchs[type]>maxNumOfMatchs[type]){
						// show
						$lswWrps.find('.tab_content_'+type).find('.bottom_link.tmp_hi').removeClass('tmp_hi');

						//remove border conflicted by shadow when have at least 4 match rows for each
						// if ($lswWrp.find('.tab_content_'+type).find('.match_row:not(.bottom_link)').length >= 4) {
							// $lswWrps.find('.tab_content_'+type).find('.bottom_link').addClass('no-top-border');
							// $lswWrps.find('.tab_content_'+type).find('.bottom_link .inner_bottom_link').addClass('no-top-border');
						// } else {
							// $lswWrp.find('.tab_content_'+type).find('.bottom_link.no-top-border').removeClass('no-top-border');
						// 	$lswWrp.find('.tab_content_'+type).find('.bottom_link .inner_bottom_link.no-top-border').removeClass('no-top-border');
						// }
						
					}else{
						// hide
						if(type=='finished' && ignore_finished_matches){}else
						$lswWrps.find('.tab_content_'+type).find('.bottom_link').addClass('tmp_hi');
					}
				});
				
				// if live tab is active -> active result tab
				if(numOfMatchs['live'] == 0 && numOfMatchs['finished'] > 0){
					if (flexslider != null) {// for mobile
						if (!is_switch_to_finished_once && (flexslider.currentSlide==0 || flexslider.currentSlide==3)) {
							flexslider.flexAnimate(1, true);
							is_switch_to_finished_once = true;
						}
					}else{// for desktop
						if(!is_switch_to_finished_once && $lswWrp_desktop.find('.tab_titles .tab_title_live').hasClass('active')) {
							$lswWrp_desktop.find('.tab_titles .tab_title_finished > a').click();//activeTab('finished');
							is_switch_to_finished_once = true;
						}
					}
				}

				if (typeof cb == 'function') {
					cb();
				}
				
				if (DEBUG && data['feed_from_server']) console.log('!!! feed from server !!!', data['xmlObject']);
				// if (DEBUG && data['live']['feed_from_server']) console.log('!!! feed from server !!!', data['live']['xmlObject']);

			} // if have data
			 
			if (numOfMatchs['live'] == 0) {
				// $('.green_dot.the_2nd_dot.blinker').removeClass('blinker').addClass('off');
				if(!isGreenDotOff){$greenLive2ndDot.removeClass('blinker').addClass('off');isGreenDotOff=true;}
				// if(numOfMatchs['schedule'] > 0){
					// fdays = 1;
				// }
				defaultFdays = 0;
				defaultDelayTime = FDAYS_0_INTERVAL;
			}else{
				// $('.green_dot.the_2nd_dot.off').removeClass('off').addClass('blinker');
				if(isGreenDotOff){$greenLive2ndDot.removeClass('off').addClass('blinker');isGreenDotOff=false;}
				// fdays = -1;
				defaultFdays = -1;
				defaultDelayTime = FDAYS_NEG_1_INTERVAL;
			}
			
		}
		
		function successAutoCallback(data,forceFDays,delayTime){
			if (typeof data.error != 'undefined') {
				if (DEBUG) console.error(data);
			} else {
				processData(data, initLSW);	
			}
			
			// if(forceFDays == -1){
				// if(calledTimes==-1) delayTime = FDAYS_NEG_1_INTERVAL;
				/* if(calledTimes%6==0 || defaultFdays==0) {
					forceFDays = 0;
					// delayTime = FDAYS_0_INTERVAL;
				} */
				// else if(fdays==1) delayTime = FDAYS_1_INTERVAL;
				// else if(fdays==2) delayTime = FDAYS_2_INTERVAL;
			// }else{
				if(defaultFdays==-1){
					// forceFDays = -1;
					delayTime = FDAYS_NEG_1_INTERVAL;
				}else{
					// forceFDays = 0;
					delayTime = FDAYS_0_INTERVAL;
				}
			// }
			
			/* 
			if(defaultFdays==-1 && !isGettingLiveFeeds){
				getFeeds(-1,FDAYS_NEG_1_INTERVAL);
				isGettingLiveFeeds = true;
			}
			
			// terminate getting live feed
			// if (delayTime == FDAYS_NEG_1_INTERVAL && defaultFdays == 0) {
			if (forceFDays == -1 && defaultFdays == 0) {
				isGettingLiveFeeds = false;
				return;
			} */

			ignore_finished_matches = true;
			// maxNumOfMatchs['finished'] = maxMatches+9;
			setTimeout(function(){
				getFeeds(forceFDays,delayTime);
			},delayTime);
		}
		
		var testFileNumber = 0;
		function getFeeds(forceFDays,delayTime,cb){
		
			++calledTimes;
			
			if(typeof forceFDays == 'undefined') forceFDays = defaultFdays;//0
			if(typeof delayTime == 'undefined') delayTime = defaultDelayTime;//GET_FEED_INTERVAL;
			
			if (DEBUG) console.log('Getting feed... fdays=',forceFDays,' & delay=',delayTime/60000,'min');
			
			if (++testFileNumber>5) testFileNumber=1;
			var postData = {
					get_live_info:true
					,max_num_of_matches:99//maxMatches
					,tz_offset:tz_offset
					// ,last_server_index:last_server_index
					// ,fdays: forceFDays
				};
			// if(isLiveScorePage && !(isMobile || window.innerWidth <= 768)) postData['is_livescore_page'] = 1;
			if(ignore_finished_matches) postData['ignore_finished_matches'] = true;
			
			$.ajax({
				// type: 'POST',
				type: 'GET',
				// url: "http://tenisuzivo.com/wp-content/plugins/live-score-widget/lsw_scraper.php",
				url: "http://tenisuzivo.com/wp-content/plugins/live-score-widget/lsw_scraper.php",
				data: postData,
				dataType: 'jsonp',
				jsonpCallback: 'lswProcess',
				crossDomain: true,
				success: function (data) {
					if (DEBUG) console.log(data);
					
					successAutoCallback(data,forceFDays,delayTime);
					
					if(typeof cb == 'function') cb();
				},
				error: function(err){
					if (DEBUG) console.log('Error while getting feed.');
					console.error(err);
					hideLiveScoreWidget();

					setTimeout(function(){
						// getFeeds(0,5000);
						getFeeds(forceFDays,delayTime);
						// getFeeds();
					},delayTime/2);
					if (DEBUG) console.log('error...re-get feed...');
					
					if(typeof cb == 'function') cb();
				}
			});
			
		}
		// alert('b4 getFeeds..............');
		getFeeds(defaultFdays,defaultDelayTime,function(){});
	});
}(jQuery));
