import { redirect } from '@sveltejs/kit';
import { SPOTIFY_BASE_URL } from '$env/static/private';

export const load = async ({ cookies, fetch, url }) => {
	const accessToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');
	if (!accessToken) {
		return {
			user: null
		};
	}

	const profileRes = await fetch(`${SPOTIFY_BASE_URL}/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (profileRes.ok) {
		const profile: SpotifyApi.CurrentUsersProfileResponse = await profileRes.json();
		let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
		const userPlaylistRes = await fetch('/api/spotify/me/playlists?limit=50');
		if (userPlaylistRes.ok) {
			const userPlaylistResJSON: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
				await userPlaylistRes.json();
			userAllPlaylists = userPlaylistResJSON.items;
		}
		return {
			user: profile,
			userAllPlaylists
		};
	}

	if (profileRes.status === 401 && refreshToken) {
		//refresh token and try again
		const refresjRes = await fetch('/api/auth/refresh');
		if (refresjRes.ok) {
			throw redirect(307, url.pathname);
		}
	}

	return {
		user: null
	};
};
