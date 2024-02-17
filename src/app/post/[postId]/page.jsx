// pages/post/[postId]/index.jsx
import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { Vote } from "@/components/Vote";
import { db } from "@/db";
import Head from 'next/head';

// to be able to change the page's title acording to the post's title, I did a search online and ChatGPT's suggestion was a good approach in my view which is a combination of Next.js's data fetching methods and React's useEffect hook
// // here is the explanation
// 1st Refactor Data Fetching with getServerSideProps: Move your database query into getServerSideProps to fetch the post data server-side.
// 2nd Pass Post Data as Props to the Page Component: Use the fetched data as props in your page component.
// 3rd Set Dynamic Page Titles: Use the Head component from next/head to set the page title dynamically within your page component.

export default function SinglePostPage({ post }) {
  return (
    <>
      <Head>
        <title>{`${post.vote_total} - ${post.title}`}</title>
      </Head>
      <div className="max-w-screen-lg mx-auto pt-10">
        <h1 className="text-2xl">
          {post.vote_total} - {post.title}
        </h1>
        <p className="text-zinc-400 border-b border-zinc-800 mb-4">
          Posted by {post.name}
        </p>
        <main className="whitespace-pre-wrap">{post.body}</main>

        <h2>Votes</h2>
        <Vote postId={post.id} votes={post.vote_total} />

        <CommentForm postId={post.id} />
        <CommentList postId={post.id} />
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const postId = params.postId;

  const { rows: posts } = await db.query(
    `SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, 
    COALESCE(SUM(votes.vote), 0) AS vote_total
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN votes ON votes.post_id = posts.id
    WHERE posts.id = $1
    GROUP BY posts.id, users.name
    LIMIT 1;`,
    [postId]
  );

  if (posts.length === 0) {
    return {
      notFound: true,
    };
  }

  const post = posts[0];

  return {
    props: { post }, // will be passed to the page component as props
  };
}
