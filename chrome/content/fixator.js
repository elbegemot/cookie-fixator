var fixator = fixator || {};

var fixator = (function() {

	return {

		cookieConfig : {},
        
        
		progressListinner : {
			onLocationChange : function(aProgress, aRequest, aURI) {
				fixator.checkCoockie();
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

        
		checkCoockie : function() {
			Application.console.log("[INFO] fixator checkCoockie");
		},


		changeStatuesLabel : function(text) {
			Application.console.log('[INFO] fixator update status label with value=' + text);
			document.getElementById("cookie-fixator-label").value = "Fixed coockie:" + text;
		},

		init : function() {
			Application.console.log('[INFO] fixatorinit');
			// observe changes in url bar
			window.getBrowser().addProgressListener(this.progressListinner);

			this.readPreferences();
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
					Application.console.log("[INFO] detector OK readed config");
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
