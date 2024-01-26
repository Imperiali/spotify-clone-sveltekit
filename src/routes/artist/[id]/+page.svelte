<script lang="ts">
    import {ItemPage, TrackList, Card, Button} from '$components'

    export let data;

    $: color = data.color
    $: artist = data.artist
    $: topTracks = data.topTracks
    $: albums = data.albums
    $: relatedArtists = data.relatedArtists
    $: appearsOn = data.appearsOn

    const followersFormat = Intl.NumberFormat('en', {notation: 'compact'})
</script>

<ItemPage
    title={artist.name}
    image={artist.images.length ? artist.images[0].url : undefined}
    type={artist.type}
    {color}
>
  <p class="meta" slot="meta">
    {followersFormat.format(artist.followers.total)} Followers
  </p>
  <div class="content">
    {#if topTracks && topTracks.tracks.length > 0}
      <div class="section">
        <div class="section-title">
          <h2>Top Tracks</h2>
        </div>
        <TrackList
            tracks={topTracks.tracks}
            userPlaylists={data.userAllPlaylists?.filter((pl) => pl.owner.id === data.user?.id)}
        />
      </div>
    {/if}

    {#if albums && albums.items.length > 0}
      <div class="section">
        <div class="section-title">
          <h2>Albums</h2>
          <Button
              element="a"
              href={`/artist/${artist.id}/albums`}
              variant="outline"
          >
            View All <span class="visually-hidden">Albums</span>
          </Button>
        </div>
        <div class="grid-items">
          {#each albums.items as album}
            <div class="grid-item">
              <Card item={album}/>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if appearsOn && appearsOn.items.length > 0}
      <div class="section">
        <div class="section-title">
          <h2>Appears On</h2>
          <Button
              element="a"
              href={`/artist/${artist.id}/appears-on`}
              variant="outline"
          >
            View All <span class="visually-hidden">artist appearances</span>
          </Button>
        </div>
        <div class="grid-items">
          {#each appearsOn.items as album}
            <div class="grid-item">
              <Card item={album}/>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if relatedArtists && relatedArtists.artists.length > 0}
      <div class="section">
        <div class="section-title">
          <h2>Related Artists</h2>
          <Button
              element="a"
              href={`/artist/${artist.id}/related-artists`}
              variant="outline"
          >
            View All <span class="visually-hidden">Related artists</span>
          </Button>
        </div>
        <div class="grid-items">
          {#each relatedArtists.artists.splice(0, 6) as artist}
            <div class="grid-item">
              <Card item={artist}/>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</ItemPage>

<style lang="scss">
  .section {
    margin-bottom: 40px;

    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      h2 {
        font-size: functions.toRem(26);
        font-weight: 600;
      }
    }
  }
</style>