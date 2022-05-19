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
    <label for="">
      Name
      <input type="text" name="name" />
    </label>
  </div>

  <div>
    <label for="">
      Email
      <input type="email" name="email" />
    </label>
  </div>

  <div>
    <input type="submit" />
  </div>
</form>
