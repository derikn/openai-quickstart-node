import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [articleInput, setArticleInput] = useState("");
  const [result, setResult] = useState();
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true)
    setResult(null)
    setTitle(null)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article: articleInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      let dataList = data.result.split(/[0-9]+\./);
      setLoading(false);
      setTitle(dataList[1])
      setResult(dataList.slice(2));
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Playground</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Summarize Chinese Article</h3>
        <form onSubmit={onSubmit}>
          <label>Enter a URL</label>
          <input
            type="text"
            name="article"
            placeholder="Enter a URL"
            value={articleInput}
            onChange={(e) => setArticleInput(e.target.value)}
          />
          <input type="submit" value="Summarize" />
        </form>
        {loading &&
          <div className={styles.loading}>
            <img src="/loader.gif"></img>
            <p>Retrieving from AI...</p>
          </div>
        }
        {result &&
        <div className={styles.result}>
          {title && <h1>{title}</h1>}
          {result?.map( (x,i) =>
            <div className={styles.summaryPoint}>
              <label className={styles.number}>{i}</label>
              <span className={styles.description}>{x}</span>
            </div>)
            }
        </div>
        }
      </main>
    </div>
  );
}
