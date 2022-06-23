import type { Faq } from '$lib/models/faq';
import { createReadClient, notDraft } from '$lib/sanityClient';
import { sanitySchemaNames } from '$lib/util';
import type { RequestHandler, ResponseBody } from '@sveltejs/kit';

function getLatestUpdatedFaqDocument() {
  return `*[
    _type == "${sanitySchemaNames.faq}" &&
    ${notDraft}
  ] | order(_updatedAt desc) [0] {
    title,
    intro,
    questions,
    descriptionTitle,
    description
  }`;
}

export const get: RequestHandler<Record<string, string>, ResponseBody> = async () => {
  const client = await createReadClient();
  const faq = await client.fetch<Faq>(getLatestUpdatedFaqDocument());

  if (!faq) {
    return { status: 500 };
  }

  return {
    status: 200,
    body: { faq },
  };
};
