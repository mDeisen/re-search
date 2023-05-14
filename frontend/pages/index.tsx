import { useListPublicationsQuery } from "@/rtk/lenspub.api";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";

type MockArticle = {
  id: string;
  title: string;
  author: string;
  abstract: string;
  date: Dayjs;
  citeString?: string;
};

export const mock_articles: MockArticle[] = [
  {
    id: "1",
    title:
      "Polysomnography: Collective experiments on EthGlobal participants reveals swag directly correlated with sleep quality",
    author: "Eth Ledger",
    date: dayjs("2019-10-10"),
    abstract: `In this groundbreaking study, we delved deep into the realm of sleep quality and its bizarre yet undeniable association with the level of swag acquired during EthGlobal events. Polysomnography experiments were conducted on participants, revealing an astonishing correlation between the amount of tech company goodies received, affectionately referred to as "swag," and the quality of their sleep. Brace yourselves for a tale of sleepless nights, fabulous freebies, and the mysterious power of branded merchandise.`,
  },
  {
    id: "2",
    title:
      "The Hackathon Hustle: Unveiling the Secrets of Superhuman Coding Speed and How to Stay Sane",
    author: "Eth Ledger",
    date: dayjs("2022-10-10"),
    abstract:
      "In this riveting exploration of the hackathon phenomenon, we delve into the captivating world of superhuman coding speed and the delicate balance of maintaining sanity amidst the chaos. With a focus on uncovering the secrets behind extraordinary coding prowess, our study aims to shed light on the strategies and mental fortitude required to thrive in the hackathon hustle. Prepare to be enthralled as we peel back the layers of caffeine-fueled brilliance, sleep-deprived determination, and the occasional desperate search for a missing semicolon.",
  },
  {
    id: "3",
    title:
      "Unleashing Lisbon's Vibes: The Unique Influence of Culture and Atmosphere on Hackathon Participants",
    author: "Víncius Buterino",
    date: dayjs(),
    abstract:
      "In this captivating study, we delve into the remarkable impact of Lisbon's vibrant vibes on the participants of hackathons held in this cosmopolitan city. From the moment hackers set foot in Lisbon, they are enveloped by an atmosphere unlike any other, infused with cultural richness, artistic inspiration, and an undeniable sense of community. This research explores how these distinct Lisbon vibes shape the mindset, collaboration, and innovation of hackathon participants, transforming their experiences into something truly extraordinary",
  },
];

export default function Home() {
  const { data: publications } = useListPublicationsQuery({});

  return (
    <main className={`flex min-h-screen flex-col p-3`}>
      <input
        type="text"
        placeholder="Author, Keyword, or Title"
        className="input input-bordered input-primary w-full"
      />
      <div className="flex flex-col gap-2 mt-2">
        {publications?.map(({ title, id }: { id: string; title: string }) => {
          return (
            <Link key={id} href={`/publication/${id}`}>
              <div className="border p-2 hover:bg-gray-50">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-blue-400 italic font-extralight">
                  {"Author"}
                  <span> - {dayjs().format("MMMM YYYY")}</span>
                </p>
                <p className="font-normal">{"Abstract"}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
