import { User } from "@/types/user";
import axios from "axios";

export default function UsersPage({ data }: { data: User[] }) {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  const data: User[] = await res.data;

  // Pass data to the page via props
  return { props: { data } };
}
