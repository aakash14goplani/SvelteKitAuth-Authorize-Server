<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { insertParam } from '$lib/auth/util';

	onMount(async () => {
		const params = $page.url.searchParams;
		try {
			const statekey = params.get('state') || 'EMPTY_STATE_KEY';
			let localstate = localStorage.getItem(statekey);
			if (!localstate) {
				const temp = localStorage.getItem('state-backup');
				if (temp) {
					localstate = localStorage.getItem(temp);
				}
			}
			if (localstate) {
				console.log('localstate:', localstate, JSON.stringify(localstate));
				const { state, redirect_uri } = JSON.parse(localstate);
				const jsonparams: any = {};
				for (const [key, value] of params.entries()) {
					jsonparams[key] = value;
				}
				const final_url_now = Object.keys(jsonparams)
					.reduce(
						(accumulator, eachParam) => {
							switch (eachParam) {
								case 'state':
									return insertParam(accumulator, eachParam, state);

								default:
									return insertParam(accumulator, eachParam, jsonparams[eachParam]);
							}
						},
						decodeURIComponent(redirect_uri) + '/auth/callback/auth1'
					)
					.replace('?&', '?')
					.replace('&&', '&');

				console.log('final_url_post_parsing::', final_url_now);
				window.location.href = final_url_now;
			} else {
				throw new Error('STATE_MISSING');
			}
		} catch (ex) {
			console.log('Exception while parsing state: ', ex);
		}
	});
</script>
