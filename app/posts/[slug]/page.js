import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const response = await fetch(
    `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch post: ${response.status}`);
  }

  const posts = await response.json();
  const post = posts[0];

  if (!post) {
    notFound();
  }

  const date = new Date(post.date).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main>
      <article className={styles.post}>
        <time className={styles.date} dateTime={post.date}>
          {date}
        </time>
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <div
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
        <p>
          <Link href="/posts">Back to posts</Link>
        </p>
      </article>
    </main>
  );
}
