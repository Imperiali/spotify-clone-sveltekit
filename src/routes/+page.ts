import { fetchRefresh } from '$helpers'

export const load = async ({fetch: _fetch, parent}) => {
    const fetch = (path: string) => fetchRefresh(_fetch, path)
    const {user} = await parent()

    const newReleases = fetch('/api/spotify/browse/new-releases?limit=6')
    const featuredPlaylists = fetch('/api/spotify/browse/featured-playlists?limit=6')
    const userPlaylists = fetch(`/api/spotify/users/${user?.id}/playlists?limit=6`)

    const catsRes = await fetch(`/api/spotify/browse/categories`)
    const catsResJSON: SpotifyApi.MultipleCategoriesResponse | undefined = catsRes.ok
        ? await catsRes.json()
        : undefined
    const randomCats = catsResJSON
        ? catsResJSON?.categories.items.sort(() => Math.random() - 0.5).slice(0, 3)
        : []
    const randomCatsPromises = randomCats.map(cat => fetch(`/api/spotify/browse/categories/${cat.id}/playlists?limit=6`))

    const [newReleasesRes, featuredPlaylistsRes, userPlaylistsRes, ...randomCatsRes] = await Promise.all([
        newReleases,
        featuredPlaylists,
        userPlaylists,
        ...randomCatsPromises
    ])

    return {
        newReleases: newReleasesRes.ok
            ? (await newReleasesRes.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>)
            : undefined,
        featuredPlaylists: featuredPlaylistsRes.ok
            ? (await featuredPlaylistsRes.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse>)
            : undefined,
        userPlaylists: userPlaylistsRes.ok
            ? (await userPlaylistsRes.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>)
            : undefined,
        homeCategories: randomCats,
        categoriesPlaylists: await Promise.all(
            randomCatsRes.map((res) =>
                res.ok ? (res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse>) : undefined
            )
        )
    }
}