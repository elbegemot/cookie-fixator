## Cookie-Fixator
Goal of addon monitor presense of specific cookie and to recover it after clearing by javasript or by user.
Addon checks cookie on each page load.

## Usage
Addon configured using standart browser setting

Open `about:config` in Firefox

Find property `extensions.cookie-fixator.elbegemot@gmail.com.master_cookie`

And set value in json format `{"name":"coockie_name", "value":"coockie_value", "domains":["somedomain.com"]}`

For example:  
`{"name":"developer", "value":"elbegemot", "domains":[ "dev.elbegemot.com", "qa.elbegemot.com", "stage.elbegemot.com"]}`


**Note**: to apply new setting browser must be restarted.
