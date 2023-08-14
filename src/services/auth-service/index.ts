import { GitHubParamsForAccessToken } from "@/protocols";
import axios from "axios";
import dotenv from "dotenv";
import qs from "query-string";
dotenv.config();

export async function loginUserWithGitHub(code: string) {
  const token = await exchangeCodeForAccessToken(code);
  return token;
}
async function exchangeCodeForAccessToken(code: string) {
  const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;
  const params: GitHubParamsForAccessToken = {
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  };

  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, params, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  const { access_token } = qs.parse(data);
  return Array.isArray(access_token) ? access_token.join("") : access_token;
}

export async function fetchUserFromGitHub(token: string) {
  const GITHUB_USER_URL = "https://api.github.com/user";
  const response = await axios.get(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}
