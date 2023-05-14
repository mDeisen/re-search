import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlBaseQuery } from "./helpers";
import { subgraphUrl } from "@/constants";
import { gql } from "graphql-request";
import { LensClient, PublicationFragment, development } from "@lens-protocol/client";
import { BigNumber } from "ethers";

type LenspubPublication = {
    id: string;
    title: string;
    profile: {
        id: string;
    }
}

export type MergedPublication = { graphPub: LenspubPublication; lensPub: PublicationFragment };

export const publicationsAPI = createApi({
  reducerPath: "publications",
  baseQuery: graphqlBaseQuery({ baseUrl: subgraphUrl }),
  endpoints: (builder) => ({
    listPublications: builder.query<MergedPublication[], {titleSearchString: string}>({
      queryFn: async (
        { titleSearchString },
        { signal, dispatch, getState },
        extraOptions,
        baseQuery
      ) => {
        const pubs = await baseQuery({
          body: gql`
            query ListPublications($titleSearchString: String!) {
              publications(
                first: 50
                where: { title_contains: $titleSearchString }
              ) {
                id
                title
                profile {
                  id
                }
              }
            }
          `,
          variables: { titleSearchString },
        //   @ts-ignore
        }).then((res) => res.data.publications) as LenspubPublication[];

        // @ts-ignore
        development.name = "staging";
        // @ts-ignore
        development.url = "https://api-sandbox-mumbai.lens.dev";
  
        const lensClient = new LensClient({
          environment: development,
        });

        const publicationIds = pubs.map(({id, profile}) => `${BigNumber.from(profile.id).toHexString()}-${BigNumber.from(id).toHexString()}`);


        const lensPubs = await lensClient.publication.fetchAll({
            publicationIds
        }).then((res) => res.items);

        const mergePubs: MergedPublication[] = pubs.map((pub, i) => ({
            graphPub: pub,
            lensPub: lensPubs[i]
        }));

        return {
            data: mergePubs,
        }
      },
 
    }),
  }),
});

export const { useListPublicationsQuery } = publicationsAPI;
