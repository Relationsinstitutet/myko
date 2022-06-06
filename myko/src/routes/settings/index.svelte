<script lang="ts">
  import { page } from '$app/stores';

  import type { Client } from '$lib/auth/client';
  import createClient from '$lib/auth/client';
  import { isAuthenticated, user } from '$lib/auth/store';

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  const currentPath = get(page).url.pathname;

  let authClient: Client;
  onMount(async () => {
    authClient = await createClient();
    await authClient.updateState();
  });

  function logout() {
    authClient.logout();
  }

  function login() {
    authClient.login(currentPath);
  }
</script>

<div class="top-menu">
  <div class="user-menu">
    {#if $isAuthenticated}
      {$user.nickname}
      <button on:click={logout}>Logga ut</button>
    {:else}
      <button on:click={login}>Logga in</button>
    {/if}
  </div>
</div>

<h1>Bokade aktiviteter</h1>

<style>
  .top-menu {
    background-color: var(--ocean-100);
    height: 3em;
  }

  .user-menu {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
