import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const SUGGESTIONS = [
    {icon: "fa-lightbulb", text: "Explain a complex topic simply"},
    {icon: "fa-code", text: "Help me debug my code"},
    {icon: "fa-feather", text: "Draft a professional email"},
    {icon: "fa-wand-magic-sparkles", text: "Brainstorm creative ideas"}
];

function Chat() {
    const {newChat, prevChats, reply, setPrompt} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null); //prevchat load
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])

    if(newChat && (!prevChats || prevChats.length === 0)) {
        return (
            <div className="chat-area">
                <div className="empty-state">
                    <div className="empty-logo">&Sigma;</div>
                    <h1 className="empty-title">How can I help you today?</h1>
                    <p className="empty-subtitle">
                        Ask anything — SigmaGPT is your modern AI assistant for ideas, code, and writing.
                    </p>
                    <div className="suggestions">
                        {
                            SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    className="suggestion-card"
                                    onClick={() => setPrompt(s.text)}
                                >
                                    <i className={`fa-solid ${s.icon}`}></i>
                                    <span>{s.text}</span>
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-area">
            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) =>
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user"?
                                <p className="userMessage">{chat.content}</p> :
                                <div className="gptMessage">
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                                </div>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0  && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"}>
                                        <div className="gptMessage">
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"}>
                                        <div className="gptMessage">
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Chat;
