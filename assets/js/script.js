
window.onpopstate = function goBack() {
   window.location.href = "https://google.com"
}; history.pushState({}, '');
  

// ---------- series.js ----------
var page_submitted = false;
var field_validator,
	current_page,
	scroll_position_x;

window.addEvent('domready', function() {
	current_page = document.querySelectorAll('body')[0].id;
});

var iframe_selector = new Class({
	Implements: Options,
	options: {
		target_window : 'popped_iframe'
	},

	regex_pdf: /\.pdf$/,
	regex_javascript : /^javascript/,

	initialize: function(options) {
		var _self = this;
		_self.setOptions(options);
		_self.check_selectors();
	},

	check_selectors: function() {
		var _self = this;

		Object.each(_self.options.selectors, function(value,key) {
			for(var i = 0; i< $$(key).length; i++) {
				if($$(key)[i].get('tag') == 'a') {
					if(value.regex && typeOf(value.regex) == 'object') {
						if(_self.check_selector_regex($$(key)[i], value.regex) === true) {
							_self.setup_selector($$(key)[i], value.type);
						}
					} else {
						_self.setup_selector($$(key)[i], value.type);
					}
				} else {
					i = $$(key).length +1;
					var links = $$(key+ ' a');
					for(var x = 0; x < links.length; x++) {
						if(value.regex && typeOf(value.regex) == 'object') {
							if(_self.check_selector_regex(links[x], value.regex) === true) {
								_self.setup_selector(links[x], value.type);
							}
						} else {
							_self.setup_selector(links[x], value.type);
						}
					}
				}
			}
		});
	},

	setup_selector: function(element, type) {
		var _self = this;

		if(element.hasClass('advertiselink') || element.hasClass('ignore') || element.href.test(_self.regex_javascript, 'i')) return;

		if(element.href) {
			element.removeEvents();
			if(element.href.test(_self.regex_pdf) == false) {
				if(type == 'iframe') {
					_self.add_open_iframe_events(element);
				}
				if(type == 'layer') {
					element.target = _self.options.target_window;
					element.addEvent('click', function() {
						open_layer(element, element.href);
					});
				}
			} else {
				_self.add_open_iframe_events(element);
			}
		}
	},

	add_open_iframe_events: function(element) {
		var _self = this;
		element.target = _self.options.target_window;
		element.addEvent('click', function(e) {

			// prevent browser from opening the link in a new tab (wheel-click)
		    if(e.event.button == 1) {
		        element.click();
		        return false;
		    }

			open_iframe();
		});
	},
});


var open_iframe = function() {
	//save scroll position
	scroll_position_x = window.getScroll().y;
	$('pop_iframe').setStyle('display', 'block');
	$('content_wrapper').setStyle('display','none');

	if(window.innerHeight) {
		var height = window.innerHeight;
	} else if (document.body) {
		var height = document.body.clientHeight;
	} else {
		var height = $(document.body).getStyle('height');
	}

	window.scroll(0, 0);
};

var add_pop_iframe_closer_events = function() {
	if ($('pop_iframe_closer')) {
        $('pop_iframe_closer').addEvent('click', function() {
            if($('content_wrapper')){
                $('content_wrapper').setStyle('display', 'block');
            }
            if ($('pop_iframe')) {
                $('pop_iframe').setStyle('display', 'none');
                $('pop_iframe').setStyle('height', '0px');
			}
			if ($('popped_iframe')) {
                $('popped_iframe').set('src', 'about:blank');
			}
            if($('popped_layer')) {
                $('popped_layer').empty();
                $('popped_layer').destroy();
                $$('#pop_iframe iframe')[0].removeProperty('style');
                $('pop_iframe_closer').removeClass('popped_layer');
            }
            window.scroll(0,scroll_position_x);
        });
	}
};
// set classname filled in input to change the postion of label, if the input is without classname validate
var setFilledClass = function(){
	$$('[id^=form_reg]').getElements('input[type=text]:not(.validate)').each(function(el){
		el.addEvent('blur', function(){
			if(this.get('value') != ''){
				this.addClass('filled');
			}
			else{
				this.removeClass('filled');
			}
		});
	});
}

//---------- sweepstake.js ----------
window.addEvent('domready', function() {
	/* mapper defines which anchor tags open in either iframe or layer */
	new iframe_selector({
		selectors: {
			'.formrow_optin .poplink': {
				'type': 'iframe'
			},
			'#footer': {
				'type': 'iframe'
			}
		}
	});

	add_pop_iframe_closer_events();

	if(current_page == 'page_pregame') {
		initialize_quiz();
	}

	if(current_page == 'page_reg_half' || current_page == 'page_reg_full'){
		var this_page = current_page.replace('page_','');
		
		control_form.initialize();

		$$('.formrow_title label').addEvent('click', function() {
			$$('.formrow_title label').removeClass('active');
			$(this).addClass('active');
		});

		$$('select').each(function(el) {
			if(el.get('data-value')) {
			  el.set('value', el.get('data-value'));
			}
		});

		if ($$('#optin_layer').length > 0) {
			var optinlayer = new Optin_layer({
				form_id: 'form_'+this_page
			});
		}

		mooli = new Moolidator_Lite({
			'form_id': 'form_'+this_page,
			'debug' : false,
			'submit_button_id': 'submit_'+this_page,
			'rules': moolidator_lite_rules,
			'countries': moolidator_lite_countries
		});
		mooli.addEvents({
			'moolidator_lite_submit': function() {
				if(optinlayer){
					if(optinlayer.test_checkboxes() === false) {
						optinlayer.show();
					} else {
						if(page_submitted === false) {
							page_submitted = true;
						}
					}
				} else {
					if(page_submitted === false) {
						page_submitted = true;
						$('form_'+this_page).submit();
					}
				}          
                return false;
            }
		});

		

	}
});

/* filling city from zipcode */
control_form = new Object();
control_form.initialize = function() {}

// moolidator
var mooli = '';
var moolidator_lite_countries = {'default':'default'};


var moolidator_lite_rules = {
	'default': {
		'invalid': {
			'trimming': [],
			'positive': [/^\t{100}$/],
			'negative': []
		},
		'gender': {
			'trimming': [],
			'positive': [/^(male|female)$/],
			'negative': []
		},
		'wingame_special_marital_status': {
			'trimming': [],
			'positive': [/^(single|married)$/],
			'negative': []
		},
		'title': {
			'trimming': [],
			'positive': [/^(Mr|Ms|Miss|Mrs)$/],
			'negative': []
		},
		'firstname': {
			'trimming': [],
			'positive': [/^.{1,50}$/],
			'negative': [/[\@]/, /^\D*(\d\D*){1,2}$/]
		},
		'firstname2': {
			'trimming': [],
			'positive': [/^.{1,50}$/],
			'negative': [/[\@]/, /^\D*(\d\D*){1,2}$/]
		},
		'lastname': {
			'trimming': [],
			'positive': [/^.{1,50}$/],
			'negative': [/[\@]/, /^\D*(\d\D*){1,2}$/]
		},
		'lastname2': {
			'trimming': [],
			'positive': [/^.{1,50}$/],
			'negative': [/\d/]
		},
		'email': {
			'trimming': [],
			'positive': [/^[\w.=+-]+@(?:[\da-zA-Z](?:[\w+-]*[\da-zA-Z])*\.)+[a-zA-Z]{2,}$/],
			'negative': []
		},
		'agb': {
			'trimming': [],
			'positive': [/^1$/],
			'negative': []
		},
		'agb2': {
            'trimming': [],
            'positive': [/^1$/],
            'negative': []
        },
        'agb3': {
            'trimming': [],
            'positive': [/^1$/],
            'negative': []
        },
		'street_type': {
			'trimming': [],
			'positive': [/\w/],
			'negative': []
		},
		'street': {
			'trimming': [],
			'positive': [/\w{2,}/],
			'negative': [/^[\d\s]+$/]
		},
		'street1': {
			'trimming': [],
			'positive': [/\w/],
			'negative': []
		},
		'street2': {
			'trimming': [],
			'positive': [/\w/],
			'negative': []
		},
		'street3': {
			'trimming': [],
			'positive': [/\w/],
			'negative': []
		},
		'streetnr': {
			'trimming': [],
			'positive': [/\d/],
			'negative': []
		},
		'door': {
			'trimming': [],
			'positive': [/\w/],
			'negative': []
		},
		'apartment': {
			'trimming': [],
			'positive': [/\w/],
			'negative': []
		},
		'region': {
			'trimming': [],
			'positive': [/^.+$/],
			'negative': []
		},
		'state': {
			'trimming': [],
			'positive': [/^\d+$/],
			'negative': []
		},
		'province': {
			'trimming': [],
			'positive': [/^\d+$/],
			'negative': []
		},
		'neighborhood': {
			'trimming': [],
			'positive': [/[A-Za-za-z]{1,}/],
			'negative': []
		},
		'telco_company': {
			'trimming': [],
			'positive': [/^[A-Z]{3}$/],
			'negative': []
		},
		'tel_areacode': {
			'trimming': [/\s/g],
			'positive': [/^\d{2,}$/],
			'negative': []
		},
		'tel_number': {
			'trimming': [/\s/g],
			'positive': [/^\d{5,}$/],
			'negative': []
		},
		'country': {
			'trimming': [],
			'positive': [/^\d+$/],
			'negative': []
		},
		'countryofbirth': {
			'trimming': [],
			'positive': [/^\d+$/],
			'negative': []
		},
		'dayofbirth': {
			'trimming': [],
			'positive': [/^0?[1-9]$|^[1-2][0-9]$|^3[0-1]$/],
			'negative': [/[4-9]\d|3[2-9]/]
		},
		'monthofbirth': {
			'trimming': [],
			'positive': [/^0?[1-9]$|^1[0-2]$/],
			'negative': [/[2-9]\d|1[3-9]/]
		},
		'yearofbirth': {
			'trimming': [],
			'positive': [/19\d\d|20\d\d/],
			'negative': []
		}
	},
	
};