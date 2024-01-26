<script lang="ts">
  import type {ComponentType, HTMLButtonAttributes} from "svelte";
  import type {Icon} from "lucide-svelte";

  interface $$Props extends HTMLButtonAttributes {
      icon: ComponentType<Icon>;
      label: string;
  }

  export let icon: ComponentType<Icon>
  export let label: string;

  let button: HTMLButtonElement;

  export function getButton() {
      return button
  }
</script>

<button bind:this={button} on:click on:mouseover on:focus on:keydown {...$$restProps}>
  <svelte:component
      this={icon}
      color="var(--text-color)"
      aria-hidden="true"
      focusable="false"
  ></svelte:component>
  <span class="visually-hidden">{label}</span>
</button>

<style lang="scss">
  button {
    width: 38px;
    height: 38px;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    :global(svg) {
      vertical-align: center;
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &:active {
      background-color: var(--menu-background-color);
    }
  }
</style>