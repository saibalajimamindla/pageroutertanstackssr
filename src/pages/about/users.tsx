"use client";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const NewPage = () => {
  const { data, isLoading, isSuccess } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () =>
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => res.data),
  });

  console.log(data, "userdata");
  return <div>NewPage</div>;
};

export default NewPage;
