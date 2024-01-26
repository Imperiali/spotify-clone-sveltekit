<script lang="ts">
    import {PlaylistsForm} from "$components";

    export let data;
    export let form;
</script>

<h2>Add new Playlist</h2>

<PlaylistsForm userId={data.user?.id} {form}/>
