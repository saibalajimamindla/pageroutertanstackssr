import { User } from "@/types/user";
import { Comment } from "@/types/comment";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";

const getPosts = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const getComments = async () => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts/1/comments"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

// This could also be getServerSideProps
export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function Posts() {
  //we are using useQuery here instead of useSuspenseQuery.
  // Because this data has already been prefetched, there is no need to
  // ever suspend in the component itself. If we forget or remove the
  // prefetch, this will instead fetch the data on the client
  const { data: postsData } = useQuery<User[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  // This query was not prefetched on the server and will not start
  // fetching until on the client
  const { data: commentsData } = useQuery<Comment[]>({
    queryKey: ["posts-comments"],
    queryFn: getComments,
  });

  return (
    <div>
      <h1 className=" text-red-500 bg-black p-10 h-4">Users Server Side</h1>
      <ul>
        {postsData?.map((user: User) => (
          <li className=" text-blue-600 bg-white p-2" key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
      <br></br>
      <br></br>
      <h1>Comments Client Side</h1>
      <ul>
        {commentsData?.map((comment: Comment) => (
          <li key={comment.id}>{comment.name}</li>
        ))}
      </ul>
    </div>
  );
  // ...
}

export default function PostsRoute({
  dehydratedState,
}: {
  dehydratedState: any;
}) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  );
}
