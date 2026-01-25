import type { ChatItem } from "./app/chat";

//@ts-ignore
export default async function FetchToWho( chats: ChatItem[]) {
    // const lastChat = chats[chats.length - 1];
    // if (!lastChat) return;
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    //     },
    //     body: JSON.stringify({
    //         model: "gpt-3.5-turbo",
    //         messages: [
    //             { role: "system", content: "You are a helpful assistant." },
    //             { role: "user", content: lastChat.message }
    //         ]
    //     })
    // });
    // const data = await response.json();
    // return data.choices[0].message.content;

    return "edit the FetchToWho";
}
