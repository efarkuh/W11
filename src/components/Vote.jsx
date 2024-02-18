import { db } from "@/db";
import auth from "../app/middleware";
import { revalidatePath } from "next/cache";
import { VoteButton } from "./VoteButton";

export async function Vote({ postId, votes }) {
  async function upvote() {
    "use server";
    const session = await auth();
    if (session?.user?.id != null) {
    console.log("Upvote", postId, "by user", session.user.id);

    // my approach here was to check and sum if the vote exist (vote+user+post) if it does, do nothing, else add a row with vote 1
    const result = await db.query(
      "SELECT user_id, post_id, SUM(vote) AS total_votes FROM votes WHERE user_id = $1 AND post_id = $2 GROUP BY user_id, post_id",
      [session.user.id, postId]
    );
    const totalVotes = result.rows[0].total_votes;
    console.log(totalVotes);
    // If the user hasn't voted yet, insert the new vote
    if (totalVotes < 1) {

    await db.query(
      "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, $4)",
      [session.user.id, postId, 1, "post"]
    );

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
    }}   }
   
   
  async function downvote() {
    "use server";
    const session = await auth();
    if (session?.user?.id != null) {
    console.log("Downvote", postId, "by user", session.user.id);
    await db.query(
      "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, $4)",
      [session.user.id, postId, -1, "post"]
    );

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
  }};

  
  return (
    <>
      {votes} votes
      <div className="flex space-x-3">
        <form action={upvote}>
          <VoteButton label="Upvote" />
        </form>
        <form action={downvote}>
          <VoteButton label="Downvote" />
        </form>
      </div>
    </>
  );
}
