var xtoken = btoa('s5,9YV+%:+HFX#l~ %RE`AZ/ptenisuzivo.comUzn<&<R%71t-|[H-L+}AtN9/thH&dMcVM8WN|Q}');

function startapp($) {
	try{
		// alert('here');
		// $('#deviceready').remove();
		$('.app').hide();
		$('#mainPage').show();
		/* 
		$.jsonp({
			// url: 'http://tenisuzivo/wp-content/plugins/live-score-widget/lsw_scraper.php?jsonp=1&callback=process&xtoken='+xtoken+'&get_live_info=1&max_num_of_matches=99',
			url: 'http://tenisuzivo/api/get_recent_posts/',
			// callbackParameter: "callback"
			success: function (json,textStatus,xOptions) {
				console.log('success, textStats:',textStatus);
				console.log('json:',json);
				console.log(xOptions);
				alert('success - '+textStatus);
				appendContent(data);
			},
			error: function(xOptions,textStatus){
				console.log('error, xOptions:',xOptions,' | ',textStatus);
				alert('error - '+textStatus);
			},
			complete: function (xOptions,textStatus) {
				console.log('complete, textStats:',textStatus);
				console.log('json:',json);
				alert('complete - '+textStatus);
				appendContent(data);
			},
			timeout: 10000
		});
		 */
		// var myAjax = new simpleMobileAjax();
		// myAjax.ajaxRequest('http://tenisuzivo/?jsonp=1&callback=process&xtoken='+xtoken, document.body);
		// myAjax.ajaxRequest('http://tenisuzivo.com/wp-content/plugins/live-score-widget/lsw_scraper.php?get_live_info=1&callback=process', document.body);
		// myAjax = null;

		// $( document ).on( "ready", function(){
			// console.log('before request');
			/* makeAJAX({
				type: 'GET',
				// url: 'http://tenisuzivo/?jsonp=1&callback=process&xtoken='+xtoken,
				url: 'http://tenisuzivo.com/wp-content/plugins/live-score-widget/lsw_scraper.php?get_live_info=1&callback=process',
				// url: 'http://tenisuzivo.com/?jsonp=1&callback=process&xtoken='+xtoken,
				// url: 'http://tenisuzivo.com/wp-content/plugins/live-score-widget/lsw_scraper.php?jsonp=1&callback=process&xtoken='+xtoken,
				// url: 'http://tenisuzivo/wp-content/plugins/live-score-widget/lsw_scraper.php?jsonp=1&callback=process&xtoken='+xtoken+'&get_live_info=1&max_num_of_matches=99&tz_offset='+(new Date).getTimezoneOffset()+'',
				// url: 'http://tenisuzivo/wp-content/plugins/live-score-widget/lsw_scraper.php?jsonp=1&callback=process&xtoken='+xtoken+'&get_live_info=1&max_num_of_matches=99',
				// url: 'http://tenisuzivo/api/get_recent_posts/',
				success: appendContent,
			}); */
			 
			var postData = {
						xtoken: xtoken
						// get_live_info:true
						// ,max_num_of_matches:99//maxMatches
						// ,tz_offset:tz_offset
						// ,last_server_index:last_server_index
						// ,fdays: forceFDays
					};
			$.ajax({
					// type: 'POST',
					type: 'GET',
					// url: "http://tenisuzivo.com/wp-content/plugins/live-score-widget/lsw_scraper.php",
					// url: 'http://tenisuzivo.com',
					// url: 'http://tenisuzivo/wp-content/plugins/live-score-widget/crontab-lsw_scraper_today.php?show_log=1&get_raw=107',
					// url: 'http://tenisuzivo/wp-content/plugins/live-score-widget/lsw_scraper.php?get_live_info=1',
					// url: 'http://tenisuzivo/wp-content/plugins/live-score-widget/lsw_scraper.php',
					// url: 'http://tenisuzivo.com/?jsonp=1&callback=process&xtoken='+xtoken,
					// url: 'http://tenisuzivo/?jsonp=1&callback=process&xtoken='+xtoken,
					// url: 'http://tenisuzivo.com/wp-content/plugins/live-score-widget/lsw_scraper.php?get_live_info=1&callback=process',
					// url: 'http://www.tjorndesign.se/mrtest/?jsonp=1&callback=process',
					url: 'http://tenisuzivo.com/api/get_recent_posts/',
					// data: postData,
					// dataType: 'json',
					// dataType: 'html',
					contentType: "application/json",
					dataType: "jsonp",
					// jsonp: 'jsonp',
					jsonpCallback: 'appendPosts',
					crossDomain: true,
					success: function (data,textStatus,jqXHR) {
						console.log('success, data:',data, 'jqXHR.statusCode():',jqXHR.statusCode(),' | ',textStatus);
						// alert('success, ' + jqXHR.statusCode() +' | '+ textStatus);
						// $('#mainPage').append("\nsuccess<br>");
						// appendPosts(data);
					},
					error: function(jqXHR,textStatus,errorThrown){
						console.error('error, ',jqXHR.statusCode(),' | ',textStatus,' | ',errorThrown);
						alert('error, ' + jqXHR.statusCode() +' | '+ textStatus +' | '+ errorThrown);
					},
					// complete: function(jqXHR,textStatus){
						// console.log('complete, ',jqXHR.statusCode(),' | ',textStatus);
						// alert('complete, ' + jqXHR.statusCode() +' | '+ textStatus);
					// },
					// statusCode: {
						// 0: function(a,b,c) {
							// console.log(a,b,c);
							// // alert( "status 0" );
							// // $('#mainPage').append('status 0<br>');
						// },
						// 200: function(a,b,c) {
							// console.log(a,b,c);
							// // alert( "status 200" );
							// // $('#mainPage').append('status 200<br>');
						// },
						// 404: function(a,b,c) {
							// console.log(a,b,c);
							// alert( "page not found" );
						// }
				  // },
				  timeout: 15000
			});
			
		// });
		 
		
		// alert('here2');
	}catch(ex){alert(ex+'');}
}

function process(data){}

function stripslashes(str) {
  //        example 1: stripslashes('Kevin\'s code');
  //        returns 1: "Kevin's code"
  //        example 2: stripslashes('Kevin\\\'s code');
  //        returns 2: "Kevin\'s code"

  return (str + '')
    .replace(/\\(.?)/g, function(s, n1) {
      switch (n1) {
        case '\\':
          return '\\';
        case '0':
          return '\u0000';
        case '':
          return '';
        default:
          return n1;
      }
    });
}

function loadScript(src){
	var sc = document.createElement('script'); sc.type = 'text/javascript'; sc.async = true;
	// sc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + src;
	sc.src = src
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(sc, s);
}

function prepareContentHTML(content_html){
	content_html = content_html.replace(/[\n\r\t]/g,'');
	content_html = content_html.replace(/^.*<!-- start body content -->/,'');
	content_html = content_html.replace(/<!-- end body content -->.*$/,'');
	return content_html;
}

function appendContent(data){
	console.log('start append data=',data);
	if(typeof data === 'object' && data.content) data = data.content;
	if(typeof data==='string' && data!==''){
		// var content_html = JSON.parse(data.content);
		
		var content_html = prepareContentHTML(data);
		
		var $page = jQuery('<div>').html(content_html);
		// $page.
		
		jQuery('#mainPage').append(
			$page
		);
		
		// allowedToGetFeed = true;
	}else{
		// console.error('!!! Not found data.content !!!');
		// alert('!!! Not found data.content !!!');
	}
}

var aPostTemplate = _.template(jQuery('#a_post_template').text(), null, { variable: "data" });
function appendPosts(data){
	console.log('start append posts...');
	if(data){
		if(data.posts && data.posts.length>0){
			
			var postsHTML = '';
			
			for(var i in data.posts){
				var the_post = data.posts[i],
					post = {};
					
				if(the_post.id) post.id = the_post.id;
				if(the_post.url) post.url = the_post.url;
				if(the_post.title_plain) post.title = the_post.title_plain;
				// if(the_post.excerpt) post.excerpt = the_post.excerpt.replace(/<\/?[^>]+(>|$)/g,'');
				// if(the_post.excerpt) post.excerpt = the_post.excerpt.replace(/(<([^>]+)>)/ig,'');//origin
				// if(the_post.excerpt) post.excerpt = the_post.excerpt.replace(/<[^>]+>/g,'');// still work
				if(the_post.excerpt) post.excerpt = jQuery(the_post.excerpt).text();// work for <img alt="a>b" src="a_b.gif" />
				if(the_post.custom_fields && the_post.custom_fields.Thumbnail && the_post.custom_fields.Thumbnail.length > 0) post.thumb = the_post.custom_fields.Thumbnail[0];
				
				postsHTML += aPostTemplate(post);
				
				// console.log(the_post);
				// console.log(post);
				// console.log(postsHTML);
			}
			
			jQuery('#posts').append(postsHTML);
		}
	}else{
		console.error('!!! Not found any posts !!!');
		// alert('!!! Not found data.content !!!');
	}
}

function callbackAfterGetContent(){
	jQuery("a[rel*=lightbox]").colorbox({speed:350,initialWidth:"300",initialHeight:"100",opacity:0.8,loop:false,scrolling:false,escKey:false,arrowKey:false,top:false,right:false,bottom:false,left:false});
	
	if (!jQuery.infinitescroll) return;
	var infinite_scroll = {
		loading: {
			img: "/img/ajax-loader.gif",
			msgText: "",
			finishedMsg: "All posts loaded."
		},
		"nextSelector":".page-navigation a:first",
		"navSelector":".page-navigation",
		"itemSelector":".post, .infscr",
		"contentSelector":"#posts, #postcontainer",
	};
	var i = 0;
	jQuery( infinite_scroll.contentSelector ).infinitescroll( infinite_scroll, function(arrayOfNewElems) {
		mobile();
		//cufon();
	} );
}

function makeAJAX(config) {
	// console.log('start load TU...');
    var request = new XMLHttpRequest();
    request.open(config.type, config.url, true);
    request.onreadystatechange = function() {//Call a function when the state changes.
        if (request.readyState == 4) {
			console.log(request.status);
            if (request.status == 200 || request.status == 0) {
				// var jsonText = request.responseText.replace(/process\(/,'').replace
				var resText = request.responseText;
				console.log(resText);
                // var data = JSON.parse(request.responseText);
				// if(!data) data = jQuery.parseJSON(request.responseText);
				
				// appendContent(resText);
				config.success(resText);
            }
        }
    }
    request.send();
}

/* 
var slideDeck2URLPath = "http://tenisuzivo.com/wp-content/plugins/slidedeck2-personal";
var slideDeck2iframeByDefault = false;

//iFrame Resize code from: https://github.com/johnymonster/iframe_height

(function($){window.SlideDeckiFrameResize=function(options,ratio,proportional){var el,iframe,i,script,messageHandler,element,container,xdomain,props={src:'',width:0,style:'padding: 0; margin: 0; border: none; display: block; height: 0; overflow: hidden;',scrolling:'no',frameBorder:0,id:''};var rtime=new Date(1,1,2000,12,00,00);var timeout=false;var delta=120;var debounceMilliseconds=150;var widthDelta=5;var startWidth;var endWidth;var startSlide=false;var ie=navigator.userAgent.toLowerCase().indexOf('msie')>-1;var ie9=navigator.userAgent.toLowerCase().indexOf('msie 9')>-1;var ie10=navigator.userAgent.toLowerCase().indexOf('msie 10')>-1;function setHeight(message){var messageParts=message.split('__');var SlideDeckUniqueId=messageParts[0];var newHeight=messageParts[1];if(SlideDeckUniqueId==props.id){startSlide=messageParts[2];document.getElementById(props.id).style.height=parseInt(newHeight)+'px';document.getElementById(props.id).style.width='100%'}}function messageHandler(e){var height,r,regex=new RegExp(xdomain+'$'),matches=e.origin.match(regex);if(matches){if(matches.length==1){strD=e.data+"";setHeight(strD)}}}function setProps(options,ratio){for(i in props){try{var prop=(props[i]==options[i]||typeof(options[i])=="undefined")?props[i]:options[i];if(i=='id'){props.id=prop;iframe.id=prop}else if(i!=='style'){iframe[i]=prop}else{iframe[i].cssText=prop}}catch(ex){}}}function setup(options,ratio){options=options||{};xdomain=options.domain||'*';element=options.element||'iframe-embed';container=document.getElementById(element);el=(!ie||ie9||ie10)?'iframe':'<iframe name="'+element+'" allowTransparency="true"></iframe>';iframe=document.createElement(el);setProps(options)}function resizeend(){if(new Date()-rtime<delta){setTimeout(resizeend,delta)}else{timeout=false;endWidth=parseInt(jQuery('#'+props.id+'-wrapper').width());var widthDiff=Math.abs(startWidth-endWidth);if(widthDiff>widthDelta){var newHeight=parseInt(jQuery('#'+props.id+'-wrapper').height());$('#'+props.id+'-wrapper iframe')[0].src=$('#'+props.id+'-wrapper iframe')[0].src.replace(/outer_width=[0-9]+/,'outer_width='+endWidth).replace(/outer_height=[0-9]+/,'outer_height='+newHeight).replace(/width=[0-9]+/,'width='+endWidth).replace(/height=[0-9]+/,'height='+newHeight).replace(/start=([0-9]+)?/,'start='+startSlide)}startWidth=endWidth}}function load(options,ratio){setup(options);if(!container)return;try{container.appendChild(iframe);if(window.postMessage){if(window.addEventListener){window.addEventListener('message',messageHandler,false)}else if(window.attachEvent){window.attachEvent('onmessage',messageHandler)}}else{setInterval(function(){var hash=window.location.hash,matches=hash.match(/^#message(.*)$/);if(matches){setHeight(matches[1])}},debounceMilliseconds)}}catch(ey){}if(proportional){jQuery(window).bind('resize',function(event){jQuery('#'+props.id+'-wrapper').css('height',parseInt(jQuery('#'+props.id+'-wrapper').width()*ratio))})}startWidth=parseInt(jQuery('#'+props.id+'-wrapper').width());$(window).resize(function(){rtime=new Date();if(timeout===false){timeout=true;setTimeout(resizeend,delta)}})}load(options,ratio)}})(jQuery);

var slideDeckUniqueId = "slidedeck_7665_533a5dbbc9e2b";
var proportional = true;
var slidedeck_7665_533a5dbbc9e2bratio = 0.61946902654867;

if( proportional ){
	jQuery('#' + slideDeckUniqueId + '-wrapper').css( 'height', parseInt( jQuery('#' + slideDeckUniqueId + '-wrapper').width() * slidedeck_7665_533a5dbbc9e2bratio ) );
}

var ressProperties = {"id":"slidedeck_7665_533a5dbbc9e2b","src":"","domain":"tenisuzivo.com","element":"slidedeck_7665_533a5dbbc9e2b-wrapper","style":""};
ressProperties.src = "http://tenisuzivo.com/wp-admin/admin-ajax.php?action=slidedeck_preview_iframe&uniqueid=1383231461&slidedeck=7665&width=565&height=350&outer_width=565&outer_height=350&slidedeck_unique_id=slidedeck_7665_533a5dbbc9e2b&post_id=18247&front_page=true&start=".replace(/width=[0-9]+/,'width=' + parseInt(jQuery('#' + slideDeckUniqueId + '-wrapper').width()) ).replace(/height=[0-9]+/,'height=' + parseInt(jQuery('#' + slideDeckUniqueId + '-wrapper').height()) );
new SlideDeckiFrameResize( ressProperties, slidedeck_7665_533a5dbbc9e2bratio, proportional );

 */
 
var simpleMobileAjax = function() {
  // main ajaxRequest, processResponse, getXmlNodeText only
  this.ajaxRequest = function(url, container) {
    var xhrRequest = null;

    if (window.XMLHttpRequest) {
      xhrRequest = new XMLHttpRequest();
    }

    xhrRequest.open('GET', url);

    if (window.XMLHttpRequest) {
      xhrRequest.source = this;
      xhrRequest.onreadystatechange = function() {
        xhrRequest.source.processResponse(xhrRequest, url, container); };
    }

    if (xhrRequest) {
      xhrRequest.send(null);
    }
  }

  this.processResponse = function(xhrResp, url, container) {
    if (!xhrResp || xhrResp.readyState < 4) {
      return;
    }
    if (xhrResp.readyState == 4) {
      if (xhrResp.status == 200 || xhrResp.status == 0) {
	  
		console.log(xhrResp);
		alert('success, '+xhrResp.status);
	  
        if (url && container) {
          /* url = url.toLowerCase();

          try {
            if (url.indexOf('.xml') == -1) {
              // display results as-is
              document.getElementById(container).innerHTML =
                xhrResp.responseText;
            }
            else {
              var xmlDoc = xhrResp.responseXML;
              var allnodes = xmlDoc.getElementsByTagName('*').item(0);

              // for xml, do simple node text display
              var nodetext = this.getXmlNodeText(allnodes);

              if (!window.XMLHttpRequest) {
                // note: no \r\n between some browser node values, only a space.
                // if your xml is simple enough, this replace might work:
                // (if not, ajaMobileAjax has a complete parent/child/cdata
                //  XML node parsing routine)
                nodetext = nodetext.replace(/\s/g, '<br\>');
              }
              else {
                // Mozilla etc support this
                nodetext = nodetext.replace(/\r|\n|\r\n/g, '<br\>');
              }

              document.getElementById(container).innerHTML = nodetext;

              // clean up after:
              xmlDoc = null;
              allnodes = null;
              nodetext = null;
            }
          }
          catch (e) {
            alert('Mobile Ajax.js error with ' + url + '\r\n' +
                  'check url and container ' + container);
          } */
        }
        else {
          alert('Mobile Ajax.js error: required parameters are missing');
        }
      }
      else {
        alert('Mobile Ajax.js error with ' + url);
      }
    }
  }

  this.getXmlNodeText = function(xmlnode) {
    try {
      // Mozilla, etc.
      if (xmlnode.textContent) {
        return xmlnode.textContent;
      }
      else {
        return xmlnode.text;
      }
    }
    catch (e) {
      alert(e.description);
      return null;
    }
  }
}