<script lang="ts">
    import {PlaylistsForm} from "$components"

    export let form;
    export let data;

    $: playlist = data.playlist;
</script>

<h2>{data.title}</h2>

<PlaylistsForm {form} {playlist} action="?redirect"/>