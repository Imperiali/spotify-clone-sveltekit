<script>
  import {invalidateAll} from "$app/navigation";
  import {Button} from "$components";

  const handleSubmit = async () =>{
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    })

    if(response.ok) {
      invalidateAll()
    }
  }
</script>

<form method="post" action="/api/auth/logout" on:submit|preventDefault={handleSubmit}>
  <Button element="button" type="submit">Logout</Button>
</form>