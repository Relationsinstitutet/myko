<script context="module" lang="ts">
  export function load({ error, status }: { error: Error; status: number }) {
    return {
      props: {
        status: status,
        message: error.message,
      },
    };
  }
</script>

<script lang="ts">
  export let status: number;
  export let message: string;

  console.log(message);
</script>

<main>
  {#if status === 404}
    <h1>Attans, det blev en 404</h1>
    <div class="error-message">
      <p>Sidan kunde inte hittas, alltså. Du kan testa klicka i menyn, och se om det går bättre.</p>
      <img src="./confused-cat.png" alt="Confused Ribot!" />
      <p>Om du vill kan du meddela oss på <span> myko@relationsinstitutet.org</span></p>
    </div>
  {:else}
    <h1>Tusan, något gick fel!</h1>
    <p class="error-message">
      Du kan testa att ladda om sidan, eller klicka i menyn och se om det går bättre.
    </p>
  {/if}
</main>

<style>
  h1 {
    margin: 0;
    color: var(--ocean-600);
  }
  .error-message {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    font-weight: 400;
    font-size: var(--16px);
    color: var(--ocean-900);
    padding-top: 1.5rem;
  }

  .error-message > * {
    display: inline;
  }

  span {
    margin-left: 8px;
    font-weight: bold;
  }

  img {
    max-height: 160px;
    max-width: 190px;
    margin: 3.5rem 0 0.5rem 25%;
  }

  @media (min-width: 45rem) {
    .error-message {
      width: 35rem;
    }
  }
</style>
