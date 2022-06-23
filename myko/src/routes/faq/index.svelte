<script lang="ts">
  import PortableTextLink from '$lib/components/PortableTextLink.svelte';

  import type { Faq } from '$lib/models/faq';
  import PortableText from '@portabletext/svelte';

  // populated with data from the endpoint
  export let faq: Faq;
</script>

<main>
  <h1>{faq.title}</h1>
 <div class="wrap">
  <PortableText
    blocks={faq.intro}
    serializers={{
      marks: {
        link: PortableTextLink,
      },
    }}
  />
  </div>

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
  }

  .menu-link {
    font-family: 'Roboto Mono', monospace;
    color: var(--grey-800);
    font-weight: 700;
  }

  details:first-of-type {
    padding-top: 1rem;
  }

  details {
    padding: 0 0 1rem 0;
    margin-left: 32px; /**/
  }
  summary {
    padding: 0.25rem 0;
    margin-left: -32px;
    color: var(--grey-600);
    font-family: 'Roboto Mono', monospace;
  }

  @media (min-width: 45rem) {
    .wrap {
      width: 35rem;
      display: block;
    }

    .wrap > * {
      display: inline;
    }

    .menu-link {
      /*background: blanchedalmond;
      width: fit-content;
      height: fit-content;
      a
      align-self: unset;
      lign-self: initial;
      justify-self: initial;*/
    }

    details {
      /**/
      width: 35rem;
      padding: 0 0 1rem 16px;
    }
  }

</style>
