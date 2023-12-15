import { authentication } from "@commercelayer/js-auth";
import { CommerceLayer } from "@commercelayer/sdk";

export default async function getClient() {
  if (!process.env.NEXT_PUBLIC_CL_ORGANIZATION) {
    throw new Error("Missing NEXT_PUBLIC_CL_ORGANIZATION env variable");
  }

  const token = await getIntegration();

  const client = CommerceLayer({
    accessToken: token,
    organization: process.env.NEXT_PUBLIC_CL_ORGANIZATION,
  });

  return client;
}

async function getIntegration() {
  if (!process.env.NEXT_PUBLIC_CL_SALES_CLIENT_ID) {
    throw new Error("Missing NEXT_PUBLIC_CL_CLIENT_ID env variable");
  }

  if (!process.env.NEXT_PUBLIC_CL_ORGANIZATION) {
    throw new Error("Missing NEXT_PUBLIC_CL_ORGANIZATION env variable");
  }

  const token = await authentication("client_credentials", {
    clientId: process.env.NEXT_PUBLIC_CL_SALES_CLIENT_ID,
    slug: process.env.NEXT_PUBLIC_CL_ORGANIZATION,
    scope: "market:16202",
  });

  return token.accessToken;
}
