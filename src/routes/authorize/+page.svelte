<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { PUBLIC_ISSUER } from '$env/static/public'

	onMount(async () => {
		const url = $page.url;
		const params = $page.url.searchParams;
		let locationvariable = url.origin;
		let finalurl = `${PUBLIC_ISSUER}authorize`;
		const identity_redirect_uri = `${locationvariable}/auth/callback/auth1`;

		const generateURLfromParams = async () => {
			try {
				let paramList = '?';
				for (const [key, value] of params.entries()) {
					const encodedValue = encodeURIComponent(value);
					paramList +=
						key +
						'=' +
						(key === 'redirect_uri'
							? encodeURIComponent(identity_redirect_uri)
							: encodedValue) +
						'&';
				}
				paramList = paramList.substring(0, paramList.length - 1); // remove last '&'
				const parsedstate = {
					state: params.get('state'),
					redirect_uri: params.get('source_url')
				};
				let key = params.get('state') || 'EMPTY_STATE_KEY';
				console.log(
					'key set ',
					key,
					'parsed state',
					JSON.stringify(parsedstate)
				);

				localStorage.setItem(key, JSON.stringify(parsedstate));
				localStorage.setItem('state-backup', key);
				finalurl += paramList;
			} catch (ex) {
				console.log('INVALID REDIRECT URI: ', ex);
			}
		};

		try {
			await generateURLfromParams();
			console.log('REDIRECT to: ', finalurl);
			window.location.href = finalurl;
		} catch (ex: any) {
			console.log(
				'Unable to redirect user from identity/idplogin: ',
				ex
			);
		}
	});
</script>