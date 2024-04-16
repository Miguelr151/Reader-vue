import { defineStore } from "pinia";

interface Source {
  id: number;
  name: string;
  url: string;
}

interface CurrentState {
  source: Source | null;
  items: { title: string; content: string }[] | null;
}

interface SourcesStore {
  sources: Source[];
  current: CurrentState;
}

export const useStore = defineStore("sourcesStore", {
  state: (): SourcesStore => {
    return {
      sources: [
        {
          id: 0,
          name: "Xataka",
          url: "https://hacks.mozilla.org/feed/",
        },
        {
          id: 1,
          name: "El universal",
          url: "https://www.theverge.com/rss/index.xml",
        },
      ],
      current: {
        source: null,
        items: null,
      },
    };
  },

  //actions
  actions: {
    async loadSource(source: Source): Promise<void> {
      const response = await fetch(source.url);
      let text = await response.text();
      text = text.replace(/content:encoded/g, "content");
      const domParser = new DOMParser();
      let doc = domParser.parseFromString(text, "text/xml");

      console.log(doc);
      const posts: { title: string; content: string }[] = [];
      doc.querySelectorAll("item, entry").forEach((item) => {
        const post = {
          title: item.querySelector("title").textContent,
          content: item.querySelector("content").textContent,
        };

        posts.push(post);
      });
      this.current.items = [...posts];
      this.current.source = source;
    },

    async registerNewSource(url: string): Promise<void> {
      const response = await fetch(url);
      let text = await response.text();

      text = text.replace(/content:encoded/g, "content");
      const domParser = new DOMParser();
      let doc = domParser.parseFromString(text, "text/xml");

      console.log(doc);

      const title =
        doc.querySelector("channel")?.querySelector("title") ||
        doc.querySelector("feed title");

      const source: Source = {
        id: crypto.randomUUID(),
        name: title?.textContent || "Unknown",
        url: url,
      };
      this.sources.push(source);
    },
  },

  //getters
});
