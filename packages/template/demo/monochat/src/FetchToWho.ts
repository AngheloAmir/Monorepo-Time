export const FetchToWhoTs = `
interface ChatItem {
    id: number;
    who: "user" | "system";
    timestamp: number;
    message: string;
}

export default async function FetchToWho(chats: ChatItem[]) {
    if (chats.length === 0) return "";
    
    //example of connecting to n8n webhook
    // const res = await fetch("http://localhost:5678/webhook/test", {
    //     method: "POST",
    //     headers: {
    //         "content-type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         usermessage: chats[chats.length - 1].message 
    //     })
    // });
    // const text = await res.text();
    // return text;

    return "please edit _FetchToWho.ts file to connect to your webhook";
}
`;