<script lang="ts">
  let errorMessage: string | null = null;

  async function submitForm(e: Event) {
    const form = e.currentTarget as HTMLFormElement;
    const response = await fetch('/activities/diy', {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: new FormData(form),
    });

    if (response.status !== 201) {
      const { message } = await response.json();
      errorMessage = message;
    }
  }
</script>

<svelte:head>
  <title>Tillverka aktivitet</title>
</svelte:head>

<main>
  <h1>Tillverka aktivitet</h1>

  {#if errorMessage}
    <div>
      <p>{errorMessage}</p>
    </div>
  {/if}

  <form on:submit|preventDefault={submitForm}>
    <div>
      <label for="activity-description"> Hur går aktiviteten till? </label>
      <p>
        Beskriv kort eller långt vad du eller ni gör. Några förslag är hur lång tid det tar och om
        det skulle kunna bli en aktivitet som alla kan göra samt kanske vad den skulle kunna ha för
        arbetsnamn.
      </p>
      <input type="text" name="activity-description" required />
    </div>

    <div>
      <label for=""> Vem är du/ni som gör aktiviteten? </label>
      <p>
        Bra att veta om det är en aktivitet för flera och om vi har frågor eller vill följa upp.
      </p>
      <input type="text" name="name" />
    </div>

    <div>
      <input type="submit" value="Notera aktiviteten" required />
    </div>
  </form>
</main>

<style>
  main {
    background-color: var(--peach-300);
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-top: 48px;
    padding-left: 48px;
    padding-right: 48px;
    padding-bottom: 256px;
    font-family: 'Lato', sans-serif;
    color: var(--grey-800);
  }

  h1 {
    font-family: 'Roboto Mono', monospace;
    font-weight: 400;
    text-transform: uppercase;
    font-size: var(--24px);
    color: var(--grey-800);
    margin-top: 1em;
    margin-bottom: var(--30px);
  }

  form {
    width: 35rem;
    max-width: 100%;
    margin: 0 auto;
  }

  label {
    --grey-800: hsla(0, 0%, 23%, 1); /* Typography */

    font-size: 1rem;
    color: var(--grey-800);
    margin-top: 2em;
    font-weight: 700;
    display: block;
  }

  input[type='text'] {
    border: 1px solid #333334;
    border-radius: 8px;
    margin: 0.65rem 8px 1rem;
    padding: 4px;
    width: 90%;
  }

  input[type='submit'] {
    border: 2px solid var(--ocean-600);
    border-radius: 4px;
    background: var(--ocean-800);
    color: white;
    font-weight: 500;
    margin: 0.65rem 12px;
    padding: 4px 8px;
  }
  /* TODO: add errorMessage styling */
</style>
