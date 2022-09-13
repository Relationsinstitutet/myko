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

  <div class="logos">
    <img src="/Logo(Portrait4)-Relationsinstitutet.png" alt="Relationsinstitutet Logo" id="ri" />
    <div class="kn">
      <p>Med stöd från Kulturbryggan</p>
      <img src="/Kulturbryggan_svart.png" alt="Kulturbryggan Logo" id="kulturbryggan" />
    </div>
  </div>
</main>

<style>
  main {
    background-color: var(--ocean-100);
  }

  details:first-of-type {
    padding-top: 1.5rem;
  }

  details {
    padding: 0 0 1rem 0;
    margin-left: 32px; /**/
    font-family: 'Roboto Mono', monospace;
    font-size: var(--14px);
  }

  summary {
    padding: 0.25rem 0;
    margin-left: -32px;
    color: var(--grey-600);
    font-size: var(--16px);
  }

  .logos {
    padding-top: 3rem;
  }

  .kn > p {
    padding-top: 1.75rem;
    padding-bottom: 0;
    text-align: center;
  }

  img {
    padding: 0;
    max-height: 150px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 45rem) {
    .logos {
      max-width: 32rem;
      display: flex;
    }
    .wrap {
      padding-bottom: 24px;
    }
    details {
      width: 35rem;
      padding: 0 0 1.2rem 16px;
    }
  }
</style>
