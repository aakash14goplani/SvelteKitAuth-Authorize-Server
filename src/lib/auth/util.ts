export function insertParam(url: string, thekey: string, thevalue: string) {
	const theurl = new URL(url);
	const key = encodeURIComponent(thekey);
	const value = encodeURIComponent(thevalue);

	const kvp = theurl.search.substring(1).split('&');
	let i = 0;

	for (; i < kvp.length; i++) {
		if (kvp[i].startsWith(key + '=')) {
			const pair = kvp[i].split('=');
			pair[1] = value;
			kvp[i] = pair.join('=');
			break;
		}
	}

	if (i >= kvp.length) {
		kvp[kvp.length] = [key, value].join('=');
	}

	// can return this or...
	const params = kvp.join('&');

	// reload page with new params
	theurl.search = params;
	return theurl.toString();
}
