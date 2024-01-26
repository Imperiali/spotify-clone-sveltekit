import { error } from '@sveltejs/kit';
import { fetchRefresh } from '$helpers';

export const load = async ({ fetch, params }) => {
	const playlistRes = await fetchRefresh(
		fetch,
		`/api/spotify/playlists/${params.id}?${new URLSearchParams({
			fields: 'id,name,description'
		}).toString()}`
	);

	if (!playlistRes.ok) {
		throw error(playlistRes.status, 'An error occurred');
	}

	const playlistJson: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();

	return {
		playlist: playlistJson,
		title: `Edit ${playlistJson.name}`
	};
};
