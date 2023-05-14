import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { graphqlBaseQuery } from "./helpers";
import { subgraphUrl } from "@/constants";
import { gql } from "graphql-request";

export const publicationsAPI = createApi({
  reducerPath: "publications",
  baseQuery: graphqlBaseQuery({ baseUrl: subgraphUrl }),
  endpoints: (builder) => ({
    listPublications: builder.query({
      query: () => ({
        body: gql`
            query{
                publications(first: 50) {
                id
                title
                profile {
                    id
                }
            }}
        `,
      }),
      transformResponse: (response: {
        publications: { id: string; title: string; profile: { id: string } }[];
      }) => {
        return response.publications;
      } 
    }),
  }),
});

export const { useListPublicationsQuery } = publicationsAPI;
