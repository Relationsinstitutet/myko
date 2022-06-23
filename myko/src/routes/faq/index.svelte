<script lang="ts">
  import PortableTextLink from '$lib/components/PortableTextLink.svelte';

  import type { Faq } from '$lib/models/faq';
  import PortableText from '@portabletext/svelte';

  // populated with data from the endpoint
  export let faq: Faq;
</script>

<main>
  <h1>{faq.title}</h1>

  <PortableText
    blocks={faq.intro}
    serializers={{
      marks: {
        link: PortableTextLink,
      },
    }}
  />

  {#each faq.questions as question}
    <details>
      <summary>{question.question}</summary>
      <PortableText
        blocks={question.answer}
        serializers={{
          marks: {
            link: PortableTextLink,
          },
        }}
      />
    </details>
  {/each}

  <h2>{faq.descriptionTitle}</h2>
  <PortableText
    blocks={faq.description}
    serializers={{
      marks: {
        link: PortableTextLink,
      },
    }}
  />
</main>

<style>
  main {
    background-color: var(--ocean-100);
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
</style>
