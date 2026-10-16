// server/api/github.ts

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.githubToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
        {
          viewer {
            pinnedItems(first: 6, types: [REPOSITORY]) {
              nodes {
                ... on Repository {
                  name
                  description
                  url
                  stargazerCount
                  forkCount
                  primaryLanguage {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      `,
        }),
    })
    const data = await res.json()
    if (!res.ok) {
        throw createError({
            status: res.status,
            data: data,
            message: 'Failed to fetch GitHub data',

        })
    }
    return data.data.viewer.pinnedItems.nodes
})
