## ajax-intercept

intercept XHR and modify response.

```
// [paste index.js here]

// intercept demo
intercept_ajax([
    {
		method: 'get',
		pattern: /app\.json/gi,
		callback: function(response){
			var result = JSON.stringify({ name: "Debug Anywhere", version: "1.0" });
			return result;
		}
	}
]);

```
