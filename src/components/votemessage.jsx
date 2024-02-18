import { db } from "@/db";
import auth from "../app/middleware";
import { revalidatePath } from "next/cache";
import { VoteButton } from "./VoteButton";

export async function Vote({ postId, votes }) {
  async function upvote() {
    "use server";
    const session = await auth();
    if (session?.user?.id != null) {
        return <p>Please login</p>;
    }}}