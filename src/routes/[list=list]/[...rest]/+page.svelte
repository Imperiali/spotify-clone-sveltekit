<script lang="ts">

    import {Card, Pagination} from "$components";
    import {toasts} from "$stores";

    export let data

    $: itemsData = data.data

    let isLoading = false

    const onLoadMoreItems = async () => {
        if (itemsData && 'next' in itemsData && itemsData.next) {
            isLoading = true
            const res = await fetch(itemsData.next.replace('https://api.spotify.com/v1', '/api/spotify'))
            if (!res.ok) {
                isLoading = false;
                return toasts.error('Could not load')
            }
            const resJSON = await res.json()
            const newData = resJSON.albums || resJSON.artists || resJSON.playlists || resJSON
            itemsData = {...newData, items: [...itemsData.items, ...newData.items]}
            isLoading = false;
        }
    }
</script>

<div class="content">
  <h1>{data.title}</h1>
  {#if itemsData?.items}
    <div class="grid-items">
      {#each itemsData.items as item}
        <div class="grid-item">
          <Card {item}/>
        </div>
      {/each}
    </div>

    {#if 'next' in itemsData}
      <Pagination
          {isLoading}
          paginatedList={itemsData}
          on:loadmore={onLoadMoreItems}
      />
    {/if}

  {/if}
</div>

<style lang="scss">
  .grid-items {
    margin-bottom: 40px;
  }

  .content {
    padding-bottom: 60px;
  }

</style>