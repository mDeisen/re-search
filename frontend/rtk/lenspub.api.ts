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
    citedPublications: {
        id: string;
    }[]
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
                citedPublications {
                  id
                }
              }
            }
          `,
          variables: { titleSearchString },
        //   @ts-ignore
        }).then((res) => res.data.publications) as LenspubPublication[];

        console.log(pubs);

        // @ts-ignore
        development.name = "staging";
        // @ts-ignore
        development.url = "https://api-sandbox-mumbai.lens.dev";
  
        const lensClient = new LensClient({
          environment: development,
        });

        const publicationIds = pubs.map(({id, profile}) => {
          const publicationId = BigNumber.from(id).mod(BigNumber.from("1000000")).toHexString();
          const profileId = BigNumber.from(id).div(BigNumber.from("1000000")).toHexString();

          return profileId + "-" + publicationId;
        });


        const lensPubs = await lensClient.publication.fetchAll({
            publicationIds
        }).then((res) => res.items);

        const mergePubs: MergedPublication[] = pubs.map((pub, i) => ({
            graphPub: pub,
            lensPub: lensPubs[i]
        }))

        // Sort by lensPub.createdAt
        mergePubs.sort((a, b) => {
            if (a.lensPub.createdAt < b.lensPub.createdAt) {
                return -1;
            } else if (a.lensPub.createdAt > b.lensPub.createdAt) {

                return 1;
            } else {
                return 0;
            }
        })

        return {
            data: mergePubs,
        }
      },
    }),
    getPublication: builder.query<MergedPublication, string>({
      queryFn: async (
        publicationId,
        { signal, dispatch, getState },
        extraOptions,
        baseQuery
      ) => {
        const pub = await baseQuery({
          body: gql`
            query GetPublication($publicationId: String!) {
              publication(id: $publicationId) {
                id
                title
                profile {
                  id
                }
                citedPublications {
                  id
                }
              }
            }
          `,
          variables: { publicationId },
        //   @ts-ignore
        }).then((res) => res.data.publication) as LenspubPublication;

        console.log(pub);

        // @ts-ignore
        development.name = "staging";
        // @ts-ignore
        development.url = "https://api-sandbox-mumbai.lens.dev";
  
        const lensClient = new LensClient({
          environment: development,
        });

        const lensPub = await lensClient.publication.fetch({
            publicationId
        });

        return {
            data: {
                graphPub: pub,
                lensPub
            },
        }
      }
    })
  }),
});

export const { useListPublicationsQuery, useGetPublicationQuery } = publicationsAPI;
