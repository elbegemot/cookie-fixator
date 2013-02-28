var fixator = fixator || {};

var fixator = (function() {

	return {

		cookieConfig : {},
		uriCache : [],
		COOCKIE_SERVICE : Components.classes["@mozilla.org/cookieService;1"]
				.getService(Components.interfaces.nsICookieService),
		ETLD_SERVICE : Components.classes["@mozilla.org/network/effective-tld-service;1"]
				.getService(Components.interfaces.nsIEffectiveTLDService),

		progressListinner : {
			onLocationChange : function(aProgress, aRequest, aURI) {
				fixator.checkCoockie(aURI);
			},
			onStateChange : function() {
			},
			onProgressChange : function() {
			},
			onStatusChange : function() {
			},
			onSecurityChange : function() {
			}
		},

		getBaseDomain : function() {
			var suffix = ETLD_SERVICE.getPublicSuffix(aURI);
			var basedomain = ETLD_SERVICE.getBaseDomain(aURI); // this includes
			// the TLD
			basedomain = basedomain.substr(0, (basedomain.length
							- suffix.length - 1)); // - 1 to remove the period
			// before the tld
			return basedomain;
		},

		checkCoockie : function(aUri) {
			Application.console.log("[INFO] fixator checkCoockie");

			// reset label
			this.changeStatuesLabel('');

			// find coockie for domains and set it such not exists
			var strCoockie = this.cookieConfig.name + "="
					+ this.cookieConfig.value;

			for (var i = 0; i < this.uriCache.length; i++) {
				var uri = this.uriCache[i];
				var str = this.COOCKIE_SERVICE.getCookieString(uri, null);

				if (str == null || str.indexOf(strCoockie) == -1) {
					this.COOCKIE_SERVICE.setCookieString(uri, null, strCoockie,
							null);
					Application.console.log('[INFO] fixator created coockie '
							+ strCoockie + ' for ' + uri.host);
				} else {
					Application.console.log('[INFO] fixator finded coockie '
							+ str + ' for ' + uri.host);
				}

				if (uri.prePath == aUri.prePath) {
					// check again and show results to user
					var checkValue = this.COOCKIE_SERVICE.getCookieString(aUri,
							null);
					if (checkValue != null
							&& checkValue.indexOf(strCoockie) != -1) {
						this.changeStatuesLabel(strCoockie);
					} else {
						this.changeStatuesLabel("NOT_SET");
					}
				}
			}

		},

		changeStatuesLabel : function(text) {
			Application.console
					.log('[INFO] fixator update status label with value='
							+ text);
			document.getElementById("cookie-fixator-label").value = text;
		},

		init : function() {
			Application.console.log('[INFO] fixator init');
			// observe changes in url bar
			window.getBrowser().addProgressListener(this.progressListinner);

			this.readPreferences();

			this.changeStatuesLabel("STARTED");

			this.initCacheValues();

			this.initCoockies();
		},

		initCacheValues : function() {
			// read all domians and create uri for them
			var ios = Components.classes["@mozilla.org/network/io-service;1"]
					.getService(Components.interfaces.nsIIOService);

			// '{"name":"coockie_name", "value":"coockie_value",
			// "domains":["somedoman.com"]}'
			this.uriCache = []
			if (this.cookieConfig.domains) {
				// create uri fore each domain
				for (var i = 0; i < this.cookieConfig.domains.length; i++) {

					var domain = this.cookieConfig.domains[i];
					var url = "http://" + domain;
					try {
						var uri = ios.newURI(url, null, null);
						this.uriCache.push(uri);
						Application.console
								.log('[INFO] fixator initCacheValues uri='
										+ uri.prePath);
					} catch (e) {
						Application.console
								.log('[WARN] fixator initCacheValues can\'t create uri for domain='
										+ domain);
					}

				}
			}

			Application.console.log('[INFO] fixator uriCache initialized with'
					+ this.uriCache.length + ' uris');
		},

		initCoockies : function() {
			var strCoockie = this.cookieConfig.name + "="
					+ this.cookieConfig.value;

			for (var i = 0; i < this.uriCache.length; i++) {
				var uri = this.uriCache[i];
				this.COOCKIE_SERVICE.setCookieString(uri, null, strCoockie,
						null);

				Application.console.log('[INFO] fixator created coockie '
						+ strCoockie + ' for ' + uri.host);
			}
		},

		readPreferences : function() {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService);
			prefs = prefs
					.getBranch("extensions.cookie-fixator.elbegemot@gmail.com.");

			if (prefs.getPrefType('master_cookie')) {
				var strConfValue = prefs.getCharPref('master_cookie');

				try {
					this.cookieConfig = JSON.parse(strConfValue);
					Application.console.log("[INFO] fixator OK readed config");
				} catch (e) {
					Application.console
							.log("[WARN] fixator: can't convert to JSON string="
									+ strConfValue);
				}
			} else {
				Application.console
						.log("[WARN] fixator: can't find preferences");
			}
		},

		destroy : function() {
			Application.console.log('[INFO] fixator destroy');
			window.getBrowser().removeProgressListener(this.progressListinner);
		},

		// register addon lifecircle handlers
		registerAddonHandlers : function() {
			window.addEventListener("load", function() {
						fixator.init();
					}, false);
			window.addEventListener("unload", function() {
						fixator.destroy();
					}, false);
		}

	};

})();

fixator.registerAddonHandlers();
