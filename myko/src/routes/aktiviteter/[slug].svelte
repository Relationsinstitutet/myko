<script lang="ts">
  import createClient, { Client } from '$lib/auth/client';
  import { isAuthenticated } from '$lib/auth/store';

  import Activity from '$lib/components/Activity.svelte';
  import StartActivityButton from '$lib/components/StartActivityButton.svelte';
  import type { IActivityWithCotime } from '$lib/models/activity';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/stores';
  import type StartedActivityData from '$lib/models/startedActivity';
  import CotimeInfo from '$lib/components/cotime/CotimeInfo.svelte';
  import CotimeActions from '$lib/components/cotime/CotimeActions.svelte';
  import FullPageModal from '$lib/components/FullPageModal.svelte';
  import StartedActivityView from '$lib/components/StartedActivityView.svelte';
  import DiyView from '$lib/components/DiyView.svelte';
  import { goto } from '$app/navigation';

  const currentSlug = get(page).params.slug;
  const currentPage = get(page).url.pathname;

  let authClient: Client;
  let startedActivityData: StartedActivityData;
  let showStartedActivityModal = false;
  let activityCompleted = false;

  onMount(async () => {
    authClient = await createClient();
    await authClient.updateState();

    if (get(isAuthenticated)) {
      // if user is logged-in, include token in request to get
      // booking status of the logged-in user for each event
      const accessToken = await authClient.getUserAccessToken();
      const response = await fetch(`/aktiviteter/${currentSlug}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      });

      const parsedJson = await response.json();
      activity = parsedJson.activity;
    }
  });

  function login() {
    authClient.login(currentPage);
  }

  function activityStarted(e: CustomEvent<StartedActivityData>) {
    startedActivityData = e.detail;
    showStartedActivityModal = true;
  }

  function activityWasCompleted() {
    activityCompleted = true;
  }

  function activityModalClosed() {
    goto('/');
  }

  // populated with data from the endpoint
  export let activity: IActivityWithCotime;
</script>

<svelte:head>
  <title>{activity.name}</title>
</svelte:head>

<FullPageModal
  bind:shown={showStartedActivityModal}
  on:done={activityWasCompleted}
  on:closed={activityModalClosed}
>
  {#if currentSlug == 'tillverka-aktivitet'}
    <DiyView />
  {:else}
    <StartedActivityView data={startedActivityData} />
  {/if}
</FullPageModal>

<main>
  {#if activityCompleted}
    <div class="activity-completed-wrapper">
      <div class="transition-message">Myko äter...</div>
      <div class="lds-default">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  {:else}
    {#if activity.cotime}
      <CotimeInfo cotime={activity.cotime} showActivityNameWhenSelected={false} />
    {/if}

    <Activity {activity} />
    <div class="wrapper">
      <div class="booking-btns">
        {#if activity.cotime}
          <CotimeActions cotime={activity.cotime} onActivityStarted={activityStarted} />
        {/if}
      </div>
      <div class="instant-btn">
        {#if activity.instant}
          {#if $isAuthenticated}
            <StartActivityButton
              on:activityStarted={activityStarted}
              data={{ activityId: activity.id }}
              enabled
            >
              Gör nu
            </StartActivityButton>
          {:else}
            <button on:click={login}> Gör nu </button>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    background-color: var(--peach-300);
  }

  .wrapper {
    position: fixed;
    bottom: 0;
    margin-bottom: 72px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    left: 0;
    padding: 8px;
  }

  .wrapper > .instant-btn,
  .booking-btns {
    flex-grow: 1;
  }

  .booking-btns {
    max-width: 40%;
  }

  .instant-btn {
    max-width: 23%;
  }
  button {
    height: fit-content;
  }

  .activity-completed-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-top: 192px;
  }

  .transition-message {
    font-size: var(--16px);
    font-family: 'Roboto Mono', monospace;
    margin-bottom: 24px;
    font-weight: 700;
  }

  .lds-default {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-default div {
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--ocean-800);
    border-radius: 50%;
    animation: lds-default 1.2s linear infinite;
  }
  .lds-default div:nth-child(1) {
    animation-delay: 0s;
    top: 37px;
    left: 66px;
  }
  .lds-default div:nth-child(2) {
    animation-delay: -0.1s;
    top: 22px;
    left: 62px;
  }
  .lds-default div:nth-child(3) {
    animation-delay: -0.2s;
    top: 11px;
    left: 52px;
  }
  .lds-default div:nth-child(4) {
    animation-delay: -0.3s;
    top: 7px;
    left: 37px;
  }
  .lds-default div:nth-child(5) {
    animation-delay: -0.4s;
    top: 11px;
    left: 22px;
  }
  .lds-default div:nth-child(6) {
    animation-delay: -0.5s;
    top: 22px;
    left: 11px;
  }
  .lds-default div:nth-child(7) {
    animation-delay: -0.6s;
    top: 37px;
    left: 7px;
  }
  .lds-default div:nth-child(8) {
    animation-delay: -0.7s;
    top: 52px;
    left: 11px;
  }
  .lds-default div:nth-child(9) {
    animation-delay: -0.8s;
    top: 62px;
    left: 22px;
  }
  .lds-default div:nth-child(10) {
    animation-delay: -0.9s;
    top: 66px;
    left: 37px;
  }
  .lds-default div:nth-child(11) {
    animation-delay: -1s;
    top: 62px;
    left: 52px;
  }
  .lds-default div:nth-child(12) {
    animation-delay: -1.1s;
    top: 52px;
    left: 62px;
  }
  @keyframes lds-default {
    0%,
    20%,
    80%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }
  @media (min-width: 22rem) {
    main {
      padding-left: 48px;
      padding-right: 48px;
    }
    .wrapper {
      padding: 24px;
      padding-bottom: 12px;
    }
    .instant-btn {
      max-width: 18%;
    }
  }

  @media (min-width: 45rem) {
    .wrapper {
      padding: 24px;
      padding-bottom: 12px;
      justify-content: space-around;
    }
    .booking-btns {
      max-width: 20%;
    }
    .instant-btn {
      max-width: 8%;
    }
  }
  @media (min-width: 70rem) {
    .wrapper {
      justify-content: space-evenly;
    }
  }
</style>