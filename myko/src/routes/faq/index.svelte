<script lang="ts">
</script>

<main>
  <h1>Vad är nu detta</h1>

  <div class="wrap">
    <p>
      Hej, vi på Relationsinstitutet välkomnar dig till Myko. Myko är en art och samtidigt en app vi
      odlat fram för att utforska relationer, digitalisering och organisationspraktik. Med Myko kan
      du göra aktiviteter, under <a href="/activities" class="menu-link">göra</a>. När du gjort en
      aktivitet så påverkar det konstverket, under <a href="/activities" class="menu-link">vi</a>.
      Det är den korta versionen, längre berättelse längre ner. Välkommen!
    </p>
  </div>

  <details>
    <summary>Vad är samtid</summary>
    Det är satta tider för när vi gör aktiviteter samtidigt och ibland tillsammans.
  </details>

  <details>
    <summary>Hur genomför jag en aktivitet</summary>
    Du trycker på göra, väljer en aktivitet, skriver upp dig på den genom att klicka på tiden eller trycker
    på gör nu om du vill göra direkt. När tiden är inne (och en stund innan) blir bokningsknappen till
    en starta-knapp.
  </details>

  <details>
    <summary>Vad är tillverka aktivitet</summary>
    Det kanske finns en aktivitet som du gör inom ramen för Ri men som inte har en upplagd aktivitet
    än, eller så har du kommit på en som alla borde kunna göra.
  </details>

  <details>
    <summary>Är det här distans/lokalt</summary>
    Det är både och/varken eller. Om du bokar in dig så kan du göra vissa aktiviteter med andra, då får
    du en videolänk till Around som är ett videoverktyg. Du kan också göra en aktivitet med folk lokalt,
    då väljer du gör nu-knappen.
  </details>

  <details>
    <summary>Vad för videoverktyg</summary>
    Around och en länk dit.
  </details>

  <details>
    <summary>Hur hjälper jag till</summary>
    Bli medlem! Länk till Ri-byråkrati!
  </details>

  <details>
    <summary>Jag har tekniskt problem</summary>
    Ojoj! Hör av dig till:
  </details>

  <details>
    <summary>Jag har relationellt problem</summary>
    Har det hänt något konstigt när du var med på en aktivitet eller liknande? Eller har du något annat
    du vill bolla kring det dära. Hör av dig till:
  </details>

  <details>
    <summary>Hur är appen byggd</summary>
    Den är byggd i SvelteKit som är ett JavaScript-baserat applikationsramverk. Vi har också använt något
    som heter Sanity för att förvara allt innehåll i.
  </details>

  <h2>Myko den längre versionen</h2>
  <p>
    Hur kan vi jobba med relationsfrågor när ingen vill vara med i en till facebook-grupp? Det hela
    började 2021 när Relationsinstitutet fick finansiering av Kulturbryggan för ett utforskande
    konstprojekt. Projektet spände över flera frågor vi ville undersöka som hade med närhet och
    distans, ritualer, relationerna i vår organisation och hur vi kan göra saker tillsammans. Syftet
    med det var att ta fram en slags art som kan koppla samman persner, främja samhörigheten i en
    grupp eller organisation. Hur, var, vad den skulle bestå av var ganska öppet. Efter ett tag blev
    det mer tydligt att vi behövde jobba med något som var digitalt, speciellt eftersom Ri:s
    medlemmar inte är på samma platser.
  </p>
  <p>
    Följande personer har bidragit till projektet: Nellie, Vicc, Samuel, Nasim, Simon, Julia, Sonja,
    Bobbi, Dana, Livia, med flera.
  </p>
  <a
    href="https://www.konstnarsnamnden.se/stipendier-och-bidrag/kulturbryggan/lar-kanna-projektagarna/mykoremediering-av-relationella-ekosystem/"
    >Läs gärna mer om projektet på Konstnärsnämndens sida.</a
  >
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
