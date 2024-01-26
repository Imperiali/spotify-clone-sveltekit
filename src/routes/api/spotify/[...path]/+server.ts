import { SPOTIFY_BASE_URL } from '$env/static/private'
import {error, json} from '@sveltejs/kit'

export const GET = async ({fetch, cookies, params, url}) => {
    const accessToken = cookies.get('access_token')

    const response = await fetch(`${SPOTIFY_BASE_URL}/${params.path}${url.search}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    const result = await response.json()

    if (result.error) {
        throw error(result.error.status ,result.error.message)
    }

    return json(result)
}