import auth from "../app/middleware";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

export async function UserInfo() {
  const session = await auth();
  // console.log("session", session);

  return (
    <div>
      {session ? (
        <div>
          You logged in, {session.user.name} (#{session.user.id})!{" "}
          <LogoutButton />
        </div>
      ) : (
        <div>
          <span className="mr-4">Welcome, Guest!</span>
          <LoginButton />
        </div>
      )}
    </div>
  );
}
