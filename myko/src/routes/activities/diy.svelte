<script lang="ts">
  // const submitForm = async (data: any) => {
  //   const formData = new FormData(data.currentTarget);
  //   const res = await fetch('diy.ts', {
  //     method: 'POST',
  //     body: formData,
  //   });
  //
  //   // const { message } = await res.json();
  // };
</script>

<svelte:head>
  <title>Tillverka aktivitet</title>
</svelte:head>

<h1>Tillverka aktivitet</h1>

<!-- <form on:submit|preventDefault={submitForm}> -->
<!-- <form action="/activities/diy"> -->
<form method="post">
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
      <input type="text" name="name" required />
    </label>
  </div>

  <div>
    <input type="submit" value="Notera aktiviteten" />
  </div>
</form>
