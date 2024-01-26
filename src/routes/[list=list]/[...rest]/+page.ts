import { fetchRefresh } from '../../../lib/helpers';
import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch: _fetch, url, depends, route }) => {
	depends(`app:${route.id}`);
	const fetch = (path: string) => fetchRefresh(_fetch, path);

	const { list, rest } = params;
	const limit = 18;
	const page = url.searchParams.get('page');

	const searchParams = new URLSearchParams({
		limit: `${limit}`,
		offset: page ? `${limit * (Number(page) - 1)}` : '0'
	}).toString();

	let request;
	let title;

	if (list === 'section' && rest === 'new-releases') {
		request = fetch(`/api/spotify/browse/new-releases?${searchParams}`);
		title = 'New Releases';
	}
	if (list === 'section' && rest === 'featured-playlists') {
		request = fetch(`/api/spotify/browse/featured-playlists?${searchParams}`);
		title = 'Featured Playlists';
	}
	if (list === 'category') {
		request = await fetch(`/api/spotify/browse/categories/${rest}/playlists?${searchParams}`);
		const catInfo = await fetch(`/api/spotify/browse/categories/${rest}`);
		const catInfoJSON: SpotifyApi.CategoryObject = catInfo.ok ? await catInfo.json() : undefined;
		title = catInfoJSON ? `${catInfoJSON.name} Playlists` : 'Playlists';
	}
	if (list === 'profile' && rest === 'following') {
		request = fetch(`/api/spotify/me/following?type=artist&${searchParams}`);
		title = 'Following';
	}
	if (list === 'artist') {
		const artistId = rest.split('/')[0];
		const dataType = rest.split('/')[1];
		if (!artistId || !['albums', 'appears-on', 'related-artists'].includes(dataType)) {
			throw error(404, { message: 'Page not found' });
		}
		const artistInfo = await fetch(`/api/spotify/artists/${artistId}`);
		const artistInfoJSON: SpotifyApi.SingleArtistResponse = artistInfo.ok
			? await artistInfo.json()
			: undefined;

		if (dataType === 'albums') {
			request = fetch(
				`/api/spotify/artists/${artistId}/albums?include_groups=album,single&${searchParams}`
			);
			title = artistInfoJSON ? `${artistInfoJSON.name} Albums` : 'Albums';
		}

		if (dataType === 'appears-on') {
			request = fetch(
				`/api/spotify/artists/${artistId}/albums?include_groups=appears_on&${searchParams}`
			);
			title = artistInfoJSON ? `${artistInfoJSON.name} Appearances` : 'Appearances';
		}
		if (dataType === 'related-artists') {
			request = fetch(`/api/spotify/artists/${artistId}/related-artists`);
			title = artistInfoJSON ? `${artistInfoJSON.name} Related Artists` : 'Related Artists';
		}
	}

	if (!request) {
		throw error(404, 'Not found');
	}

	const res = await request;

	if (!res.ok) {
		throw error(res.status, 'Failed to fetch');
	}

	const resJSON:
		| SpotifyApi.ListOfNewReleasesResponse
		| SpotifyApi.ListOfFeaturedPlaylistsResponse
		| SpotifyApi.CategoryPlaylistsResponse
		| SpotifyApi.UsersFollowedArtistsResponse
		| SpotifyApi.ArtistsAlbumsResponse
		| SpotifyApi.ArtistsRelatedArtistsResponse = await res.json();

	const getData = () => {
		if ('items' in resJSON) return resJSON.items;
		if ('playlists' in resJSON) return resJSON.playlists;
		if ('albums' in resJSON) return resJSON.albums;
		if ('artists' in resJSON) {
			if ('items' in resJSON.artists) return resJSON.artists;
			return { item: resJSON.artists };
		}
	};

	return {
		data: getData(),
		title
	};
};
