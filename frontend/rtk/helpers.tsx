import { request, ClientError } from "graphql-request";

export const graphqlBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
  async ({ body, variables }: { body: string; variables: any }) => {
    try {
      const result = await request(baseUrl, body, variables);
      return { data: result };
    } catch (error) {
      if (error instanceof ClientError) {
        return { error: { status: error.response.status, data: error } };
      }
      return { error: { status: 500, data: error } };
    }
  };
