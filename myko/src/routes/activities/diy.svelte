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

<h1>Tillverka aktivitet</h1>

{#if errorMessage}
  <div>
    <p>{errorMessage}</p>
  </div>
{/if}

<form on:submit|preventDefault={submitForm}>
  <div>
    <label for="activity-description">
      Hur går aktiviteten till?
      <span>
        Beskriv kort eller långt vad du eller ni gör. Några förslag är hur lång tid det tar och om
        det skulle kunna bli en aktivitet som alla kan göra samt kanske vad den skulle kunna ha för
        arbetsnamn.
      </span>
      <input type="text" name="activity-description" required />
    </label>
  </div>

  <div>
    <label for="">
      Vem är du/ni som gör aktiviteten?
      <span>
        Bra att veta om det är en aktivitet för flera och om vi har frågor eller vill följa upp.
      </span>
      <input type="text" name="name" />
    </label>
  </div>

  <div>
    <input type="submit" value="Notera aktiviteten" required />
  </div>
</form>

<style>
  p {
    color: red;
  }
</style>
