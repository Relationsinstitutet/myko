<script>
  const submitForm = (data) => {
    const formData = new FormData(data.currentTarget);
    // console.log(formData.get('name'));
  };
</script>

<svelte:head>
  <title>Tillverka aktivitet</title>
</svelte:head>

<h1>Tillverka aktivitet</h1>

<form on:submit|preventDefault={submitForm}>
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
