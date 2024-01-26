import { fetchRefresh } from '../../../lib/helpers';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch: _fetch, params, depends, route, url, parent }) => {
	depends(`app:${route.id}`);
	const { user } = await parent();

	const fetch = (path: string) => fetchRefresh(_fetch, path);

	const limit = 100;
	const page = url.searchParams.get('page');

	const [playlistRes, isFollowingRes] = await Promise.all([
		fetch(`/api/spotify/playlists/${params.id}`),
		fetch(
			`/api/spotify/playlists/${params.id}/followers/contains?${new URLSearchParams({
				ids: user ? user.id : ''
			}).toString()}`
		)
	]);

	if (!playlistRes.ok) {
		throw error(playlistRes.status, 'Failed to load');
	}

	let isFollowing: boolean | null = null;

	if (isFollowingRes.ok) {
		const isFollowingJSON: SpotifyApi.UsersFollowPlaylistResponse = await isFollowingRes.json();
		isFollowing = isFollowingJSON[0];
	}

	const playlistResJson: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();

	if (page && page !== '1') {
		const tracksRes = await fetch(
			`/api/spotify/playlists/${params.id}/tracks?${new URLSearchParams({
				limit: `${limit}`,
				offset: `${limit * (Number(page) - 1)}`
			}).toString()}`
		);

		if (!tracksRes.ok) {
			throw error(tracksRes.status, 'Failed to load');
		}
		const tracksResJson = await tracksRes.json();
		playlistResJson.tracks = tracksResJson;
	}

	let color = null;

	if (playlistResJson.images.length > 0) {
		const colorRes = await fetch(
			`/api/avarage-color?${new URLSearchParams({
				image: playlistResJson.images[0].url
			}).toString()}`
		);

		if (colorRes.ok) {
			color = (await colorRes.json()).color;
		}
	}

	return {
		playlist: playlistResJson,
		color,
		title: playlistResJson.name,
		isFollowing
	};
};
