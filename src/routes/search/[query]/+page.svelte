<script lang="ts">
    import {Card} from "$components";

    export let data

    $: albums = data.searchResults.albums?.items
    $: playlists = data.searchResults.playlists?.items
    $: artists = data.searchResults.artists?.items
</script>

<h1>{data.title}</h1>

{#if (!albums || albums.length === 0) && (!playlists || playlists.length === 0) && (!artists || artists.length === 0)}
  <p>No Results</p>
{/if}

{#if albums && albums.length > 0}
  <section class="section">
    <h2>albums</h2>
    <div class="grid-items">
      {#each albums as album}
        <div class="grid-item">
          <Card item={album}/>
        </div>
      {/each}
    </div>
  </section>
{/if}


{#if artists && artists.length > 0}
  <section class="section">
    <h2>artists</h2>
    <div class="grid-items">
      {#each artists as artist}
        <div class="grid-item">
          <Card item={artist}/>
        </div>
      {/each}
    </div>
  </section>
{/if}


{#if playlists && playlists.length > 0}
  <section class="section">
    <h2>playlists</h2>
    <div class="grid-items">
      {#each playlists as playlist}
        <div class="grid-item">
          <Card item={playlist}/>
        </div>
      {/each}
    </div>
  </section>
{/if}

<style lang="scss">
  h1 {
    font-size: functions.toRem(28);
  }

  h2 {
    font-size: functions.toRem(22);
  }

  .section {
    margin-bottom: 40px;
  }
</style>