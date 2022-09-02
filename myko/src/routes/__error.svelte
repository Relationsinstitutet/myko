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
</script>

<main>
  {#if status === 404}
    <h1>Attans, det blev en 404</h1>
    <div class="error-message">
      <p>
        Sidan kunde inte hittas, alltså. Du kan testa ladda om sidan eller klicka i menyn, och se om
        det går bättre.
      </p>
      <p>Om du vill kan du meddela oss på <span> info@relationsinstitutet.gmail</span></p>
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
    align-items: flex-start;
    font-weight: 400;
    font-size: var(--16px);
    color: var(--ocean-900);
    padding-top: 2rem;
  }

  span {
    display: inline;
    margin-left: 8px;
    font-weight: bold;
    text-decoration: underline;
  }
</style>
