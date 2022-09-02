<script lang="ts">
  let message: string | null = null;
  let submitted = false;

  async function submitForm(e: Event) {
    const form = e.currentTarget as HTMLFormElement;
    const response = await fetch('/api/aktiviteter/tillverka', {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: new FormData(form),
    });

    if (response.status !== 201) {
      const { message: errorMessage } = await response.json();
      message = errorMessage;
      return;
    }

    submitted = true;
    message = 'Myko har noterat aktiviteten, tack!' + '\u2726';
  }
</script>

<main>
  <h1>Tillverka aktivitet</h1>

  {#if !submitted}
    <form on:submit|preventDefault={submitForm}>
      <div>
        <label for="activity-description"> Hur går aktiviteten till? </label>
        <p>
          Beskriv kort eller långt vad du eller ni gör. Några förslag är hur lång tid det tar och om
          det skulle kunna bli en aktivitet som alla kan göra samt kanske vad den skulle kunna ha
          för arbetsnamn.
        </p>
        <!--<input type="text" name="activity-description" required />-->
        <textarea name="activity-description" rows="5" />
      </div>

      <div>
        <label for=""> Vem är du/ni som gör aktiviteten? </label>
        <p>
          Bra att veta om det är en aktivitet för flera och om vi har frågor eller vill följa upp.
        </p>
        <input type="text" name="name" />
      </div>

      <div>
        <input type="submit" value="Notera aktiviteten" required class="btn" />
      </div>
    </form>
  {/if}

  {#if message}
    <div class="form-message">
      <p>{message}</p>
    </div>
  {/if}
</main>

<style>
  main {
    background-color: var(--peach-300);
    background-image: linear-gradient(
      var(--peach-100),
      var(--peach-300),
      var(--peach-500),
      var(--ocean-100)
    );
    padding-bottom: 144px;
  }

  label {
    --grey-800: hsla(0, 0%, 23%, 1);
    font-size: 1rem;
    color: var(--grey-800);
    margin-top: 2em;
    font-weight: 700;
    display: block;
  }

  input[type='text'],
  textarea {
    margin: 0.45rem 4px 1rem;
    padding: 4px 8px;
    width: 90%;
    border: 0;
    border-radius: 12px;
    outline: 1px solid var(--ocean-800);
  }

  textarea:focus,
  input:focus {
    outline-width: 2px;
  }

  input[type='submit'] {
    padding: 4px 8px;
    cursor: pointer;
    letter-spacing: 1px;
  }

  .form-message {
    position: relative;
    max-width: 90%;
    color: var(--ocean-900);
    font-family: 'Roboto Mono', monospace;
    font-weight: 500;
    margin-top: -0.5rem;
    margin-left: -1rem;
    /*border-top: 0.05rem solid var(--ocean-800);*/
  }

  .form-message > p {
    padding-top: 8px;
    padding-left: 1rem;
    max-width: 95%;
  }

  @media (min-width: 22rem) {
    main {
      padding-left: 48px;
      padding-right: 48px;
    }
  }

  @media (min-width: 45rem) {
    .form-message {
      max-width: 33rem;
    }
  }
</style>
