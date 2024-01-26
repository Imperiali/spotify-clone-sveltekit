import { SPOTIFY_BASE_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const actions = {
	addItem: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const track = data.get('track');
		const playlist = data.get('playlist');
		const redirectTo = url.searchParams.get('redirect');

		const res = await fetch(`${SPOTIFY_BASE_URL}/playlists/${playlist}/tracks`, {
			method: 'POST',
			body: JSON.stringify({
				uris: [`spotify:track:${track}`]
			}),
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`
			}
		});

		if (!res.ok) {
			throw redirect(
				303,
				redirectTo
					? `${redirectTo}?error=${res.statusText}`
					: `/playlist/${playlist}?error=${res.statusText}`
			);
		}

		if (redirectTo) {
			throw redirect(303, `${redirectTo}?success=Track added successfully`);
		}

		throw redirect(303, `/playlist/${playlist}?success=Track added successfully`);
	}
};
