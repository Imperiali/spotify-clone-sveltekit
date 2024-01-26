import { fetchRefresh } from '../../../lib/helpers';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch: _fetch, params, parent, depends, route }) => {
	depends(`app:${route.id}`);
	const fetch = (path: string) => fetchRefresh(_fetch, path);
	const { user } = await parent();
	const artistRes = await fetch(`/api/spotify/artists/${params.id}`);
	if (!artistRes.ok) {
		throw error(artistRes.status, 'Failed to fetch artist');
	}
	const artistResJSON: SpotifyApi.SingleArtistResponse = await artistRes.json();

	let colorReq;

	if (artistResJSON?.images?.length > 0) {
		colorReq = fetch(
			`/api/avarage-color?${new URLSearchParams({
				image: artistResJSON?.images[0].url
			}).toString()}`
		);
	}

	const [albumRes, appearsOnRes, topTracksRes, relatedArtistsRes, colorRes] = await Promise.all([
		fetch(`/api/spotify/artists/${params.id}/albums?limit=6&include_groups=album,single`),
		fetch(`/api/spotify/artists/${params.id}/albums?limit=6&include_groups=appears_on`),
		fetch(`/api/spotify/artists/${params.id}/top-tracks?market=${user?.country}`),
		fetch(`/api/spotify/artists/${params.id}/related-artists`),
		colorReq
	]);

	return {
		title: artistResJSON.name,
		artist: artistResJSON,
		albums: albumRes.ok
			? ((await albumRes.json()) as Promise<SpotifyApi.ArtistsAlbumsResponse>)
			: undefined,
		appearsOn: appearsOnRes.ok
			? ((await appearsOnRes.json()) as Promise<SpotifyApi.ArtistsAlbumsResponse>)
			: undefined,
		topTracks: topTracksRes.ok
			? ((await topTracksRes.json()) as Promise<SpotifyApi.ArtistsTopTracksResponse>)
			: undefined,
		relatedArtists: relatedArtistsRes.ok
			? ((await relatedArtistsRes.json()) as Promise<SpotifyApi.ArtistsRelatedArtistsResponse>)
			: undefined,
		color: colorRes?.ok ? colorRes.json().then((r) => r.color) : null
	};
};
