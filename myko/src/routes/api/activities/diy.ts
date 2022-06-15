import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

function isNonEmptyString(s: FormDataEntryValue | null): boolean {
  if (typeof s === 'string' && s.trim().length > 0) {
    return true;
  }

  return false;
}

export const post: RequestHandler<Record<string, string>, ResponseBody> = async ({ request }) => {
  const data = await request.formData(); // or .json(), or .text(), etc

  const name = data.get('name');
  if (!isNonEmptyString(name)) {
    return {
      status: 400,
      body: {
        message: 'Vi saknar vem du/ni är, fyll i den rutan för att kunna skicka in.',
      },
    };
  }

  const activityDesc = data.get('activity-description');
  if (!isNonEmptyString(activityDesc)) {
    return {
      status: 400,
      body: {
        message:
          'Vi saknar beskrivningen av aktiviteten, fyll i den rutan för att kunna skicka in.',
      },
    };
  }

  const url = `https://docs.google.com/forms/d/e/1FAIpQLSdS9DRucqH91-yj6Ntf2G15ubI0G8kIMNwY07qyye8kZcsacA/formResponse?usp=pp_url&entry.1469164367=${activityDesc}&entry.1714084245=${name}&submit=Submit`;
  const response = await fetch(url);

  if (response.status !== 200) {
    return {
      status: response.status,
      body: {
        message: `Något oerhört konstigt har hänt och vi kunde inte ta emot det här. Hmm. Säg till någon på Ri vad som hände och säg gärna felkod "${response.status}: ${response.statusText}"`,
      },
    };
  }

  return { status: 201 };
};
