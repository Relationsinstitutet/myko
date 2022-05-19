export async function post({ request }) {
  const data = await request.formData(); // or .json(), or .text(), etc

  const name = data.get('name');
  const activityDesc = data.get('activity-description');
  const url = `https://docs.google.com/forms/d/e/1FAIpQLSdS9DRucqH91-yj6Ntf2G15ubI0G8kIMNwY07qyye8kZcsacA/formResponse?usp=pp_url&entry.1469164367=${activityDesc}&entry.1714084245=${name}&submit=Submit`;

  const res = await fetch(url);

  // console.log(await res.json());

  return { status: 201 };
}

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
