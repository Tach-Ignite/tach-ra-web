import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session } = useSession();

  return (
    <>
      {session && (
        <div>Logged in as {session?.user?.name ?? session?.user?.email}</div>
      )}
      {!session && <div>Not logged in</div>}
    </>
  );
}
