import { getRepoParts } from "./git";
import axios, { AxiosRequestConfig } from "axios";

export async function getStashApiRoot(folder: string) {
    const config = await getRepoParts(folder);
    return `https://${config.url}/rest/api/1.0/projects/${config.project}/repos/${config.repo}`;
}


export async function getRepoPath(folder: string) {
    const config = await getRepoParts(folder);
    return `https://${config.url}/projects/${config.project}/repos/${config.repo}`;
}

export function getPullRequest( apiRoot: string, options: AxiosRequestConfig) {
    return axios.get(`${apiRoot}/pull-requests`, options)
}

export async function getComments(pullRequest: any, apiRoot: string, options: AxiosRequestConfig) {
    console.log("Pull Request:");
    console.log(pullRequest);
    let activities = await axios.get(`${apiRoot}/pull-requests/${pullRequest.id}/activities`, options);
    console.log("activities");
    console.log(activities);
    return activities.data.values.filter((activity: any) => activity.action == "COMMENTED");
}