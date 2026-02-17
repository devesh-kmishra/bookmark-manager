# Bookmark Manager

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Problems Faced

- Since I had never implemented Supabase OAuth or used its realtime feature, it took me some time to familiarize myself with everything. I faced problems with the RLS policies, which made Supabase throw errors when I tried to add a new bookmark.
- Upon signing in with Google I was not getting redirected to the dashbord route.
- I mistakenly created a trigger for the bookmarks table, due to which I was getting errors while trying to add a new bookmark.

## How I Solved Them

- I took the help of AI tools to solve the problems I was facing with RLS policies.
- Supabase's documentation was useful to properly implement the OAuth flow, and sent me in the right direction to correct the solution given by AI tools.
- After finding the trigger by selecting the bookmarks table I promptly deleted it and the issue was solved.
- I set the type for URL input field as 'url' but later changed it to 'text' as it was not accepting URL's without the 'https://' prefix.
