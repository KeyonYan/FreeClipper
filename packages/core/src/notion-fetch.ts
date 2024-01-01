import { Client } from '@notionhq/client'

async function uploadToNotion() {
  const notion = new Client({
    auth: '', // TODO
  })

  const newHeadingResponse = await notion.blocks.children.append({
    block_id: '', // TODO
    // Pass an array of blocks to append to the page: https://developers.notion.com/reference/block#block-type-objects
    children: [
      {
        // image: {
        //   external: {
        //     url:
        //       "https://file.notion.so/f/f/1e5bf823-1d18-49cd-85bf-7e2469e91333/76c12ffd-e887-4579-bde7-cd328dabbcaf/Untitled.png?id=8247b949-4a61-4400-8757-104163d22407&table=block&spaceId=1e5bf823-1d18-49cd-85bf-7e2469e91333&expirationTimestamp=1703808000000&signature=XO566WzMOnTYAqSheqeQQKUxSKTqaLVZH88MBoi0Eb4&downloadName=Untitled.png",
        //   },
        //   caption: [{ text: { content: "hello world" } }],
        // },
        paragraph: {
          rich_text: [
            { text: { content: 'hello world' } },
            { equation: { expression: 'a + b = c' } },
            { annotations: { code: true }, text: { content: 'hello world' } },
          ],
        },
      },
    ],
  })
}
