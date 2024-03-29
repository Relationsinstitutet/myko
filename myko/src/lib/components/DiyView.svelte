<script lang="ts">
  import { tick } from 'svelte';

  let message: string | null = null;
  let errorMessage: string | null = null;
  let submitted = false;
  let errorMessageElement: HTMLElement;

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
      let json = await response.json();
      ({ message: errorMessage } = json);

      await tick(); // wait for error message element to be rendered
      errorMessageElement.scrollIntoView({ block: 'end', behavior: 'smooth' });

      return;
    } else {
      errorMessage = null;
    }

    submitted = true;
    message = 'Myko har noterat aktiviteten, tack!' + '\u2726';
  }
</script>

<main>
  <h1>Tillverka aktivitet</h1>

  {#if errorMessage}
    <div bind:this={errorMessageElement} class="form-message error-message">
      {errorMessage}
    </div>
  {/if}

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
        <label for="">
          Vem är du/ni som gör aktiviteten? <span class="required-field-mark">*</span>
          <span class="required-field-text">Obligatorisk</span>
        </label>
        <p>
          Bra att veta om det är en aktivitet för flera, och om vi har frågor eller vill följa upp.
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
      {message}
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
    position: relative;
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
    padding: 0.75rem 0.25rem;
  }

  .error-message {
    padding: 0.25rem;
    border-top: 0.1rem solid;
    font-size: 0.9em;
    color: var(--peach-900);
    background: hsla(0, 100%, 99%, 0.7);
  }

  .required-field-mark {
    padding: 0.4em;
    color: var(--peach-900);
    font-size: 1.65em;
    font-family: 'Roboto-Mono';
  }

  .required-field-text {
    visibility: hidden;
    position: absolute;
    bottom: 20%;
    padding: 0.25em 0.5em;
    background: var(--grey-700);
    border-radius: 4px;
    color: var(--grey-050);
    font-size: 0.7em;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .required-field-mark:hover ~ .required-field-text {
    visibility: visible;
  }

  @media (min-width: 22rem) {
    main {
      padding-left: 48px;
      padding-right: 48px;
    }
  }

  @media (min-width: 45rem) {
    .form-message {
      max-width: 35rem;
    }
  }
</style>
