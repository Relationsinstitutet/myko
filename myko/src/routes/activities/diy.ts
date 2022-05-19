// export const post = async ({ request }) => {
//   const body = await request.formData();
//   const name = body.get('name');
//   const email = body.get('email');
//

//   // console.log(res);
//   if (response.status === 200) {
//     return {
//       status: 200,
//       body: { message: 'success' },
//     };
//   } else {
//     return {
//       status: 404,
//       body: { message: 'failed' },
//     };
//   }
//
//   // https: return {};
// };

// console.log('hej');
// const formData = new FormData(data.currentTarget);
// console.log(formData);

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
  const data = await request.formData(); // or .json(), or .text(), etc
  console.log('data');

  // await create(data);
  // console.log(data.get('name'));
  const name = data.get('name');
  const email = data.get('email');
  const url = `https://docs.google.com/forms/d/e/1FAIpQLSdS9DRucqH91-yj6Ntf2G15ubI0G8kIMNwY07qyye8kZcsacA/formResponse?usp=pp_url&entry.1714084245=${name}&entry.1620787639=${email}&submit=Submit`;

  console.log(url);

  const res = await fetch(
    `https://docs.google.com/forms/d/e/1FAIpQLSdS9DRucqH91-yj6Ntf2G15ubI0G8kIMNwY07qyye8kZcsacA/formResponse?usp=pp_url&entry.1714084245=${name}&entry.1620787639=${email}&submit=Submit`
  );

  console.log(await res.text());

  return { status: 201 };
}

// export const post: RequestHandler<{ eventId: string }, ResponseBody> = async ({
//   params: { eventId },
//   locals,
// }) => {
//   console.log(`eventId: ${eventId}`);
//
//   const userdata = locals.user;
//   if (!userdata) {
//     return {
//       status: 401,
//     };
//   }
// };
//
//   // const submitForm = async (data: any) => {
//   //   const formData = new FormData(data.currentTarget);
//   //   const res = await fetch('diy.ts', {
//   //     method: 'POST',
//   //     body: formData,
//   //   });
//   //
//   //   // const { message } = await res.json();
//   // };
// };
//
