"use client"

import React, {useRef} from 'react';
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
export type AddUserProps = {
}

const AddUser = (props: AddUserProps) => {

  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);



  const allUsers = useQuery(api.users.getAllUsers)
 return (
    <>
      <input ref={username} placeholder={"username"}/>
      <input ref={password} placeholder={"password"}/>
  <button onClick={async ()=> {
    console.log("adding user")
  }}>submit</button>
      <ul>
        {allUsers?.map((user) => {
          return <li>{user.username}</li>
        })}
      </ul>
    </>
 );}

export default AddUser;
