<script>
  import {Button} from "$components";
  import logo from '$assets/Spotify_Logo_RGB_White.png';
  import cover from '$assets/cover.png';
</script>

<div class="wrapper">
  <div class="content">
    <img width="170px" src={logo} alt="Spotify" class="logo"/>
    <h1>EGP 0.00 for 3 months of Premium</h1>
    <p>Enjoy ad-free la la la la </p>
    <div class="buttons">
      <Button
          element="a"
          variant="outline"
          href="https://www.spotify.com/"
          target="_blank"
          rel="noopener noreferrer"
      >
        Sign up
      </Button>
      <Button element="a" href="/api/auth/login">Login</Button>
    </div>
  </div>
  <div class="cover">
    <img src={cover} alt="Svelte album cover">
  </div>
</div>

<style lang="scss">
  :global(body) {
    background-image: linear-gradient(230deg, var(--sidebar-color), var(--bg-color));
    height: 100vh;
  }
  .wrapper {
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: 80px auto 0;
    align-items: center;
    flex-direction: column;
    @include breakpoint.up('md') {
      flex-direction: row;
    }
  }
  .cover {
    flex: 1;
    margin-top: 40px;
    @include breakpoint.up('md') {
      margin-left: 20px;
    }
    img {
      max-width: 100%;
    }
  }
  .content {
    flex: 1.8;
    h1 {
      font-size: functions.toRem(40);
    }
    p {
      font-size: functions.toRem(20);
    }
    .buttons {
      margin-top: 40px;
      :global(.button) {
        margin-right: 20px;
        padding: 10px 20px;
        text-transform: uppercase;
      }
    }
    .logo {
      max-width: 100%;
      margin-bottom: 30px;
    }
  }
</style>