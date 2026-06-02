import axios from "axios";

export const fetchUser = async (username: string, signal?: AbortSignal) => {
  const url = `https://api.github.com/users/${username}`;
  const res = await axios.get(url, {
    signal,
  });
  return res.data;
};

export const fetchRepo = async (username: string, signal: AbortSignal) => {
  if (username == "") {
    return [];
  } else {
    const url = `https://api.github.com/users/${username}/repos`;
    const res = await axios.get(url, {
      signal,
    });
    return res.data;
  }
};
