import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, isSidebarOpen, setIsSidebarOpen} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setIsSidebarOpen(false);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        setIsSidebarOpen(false);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <>
            <div
                className={`sidebar-backdrop ${isSidebarOpen ? "show" : ""}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-top">
                    <div className="brand">
                        <span className="brand-mark">&Sigma;</span>
                        <div className="brand-text">
                            <span className="brand-name">SigmaGPT</span>
                            <span className="brand-tag">AI Assistant</span>
                        </div>
                        <button
                            className="sidebar-close"
                            onClick={() => setIsSidebarOpen(false)}
                            aria-label="Close menu"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <button className="new-chat-btn" onClick={createNewChat}>
                        <i className="fa-solid fa-pen-to-square"></i>
                        <span>New chat</span>
                    </button>
                </div>

                <div className="history-wrap">
                    <p className="history-label">Recent</p>
                    <ul className="history">
                        {
                            allThreads?.length === 0 && (
                                <li className="history-empty">No conversations yet</li>
                            )
                        }
                        {
                            allThreads?.map((thread) => (
                                <li key={thread.threadId}
                                    onClick={() => changeThread(thread.threadId)}
                                    className={`history-item ${thread.threadId === currThreadId ? "highlighted" : ""}`}
                                    title={thread.title}
                                >
                                    <i className="fa-regular fa-message chat-ico"></i>
                                    <span className="history-title">{thread.title}</span>
                                    <button className="delete-btn"
                                        aria-label="Delete chat"
                                        onClick={(e) => {
                                            e.stopPropagation(); //stop event bubbling
                                            deleteThread(thread.threadId);
                                        }}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="sidebar-footer">
                    <div className="user-card">
                        <span className="user-avatar"><i className="fa-solid fa-user"></i></span>
                        <div className="user-meta">
                            <span className="user-name">Guest</span>
                            <span className="user-plan">Free plan</span>
                        </div>
                        <i className="fa-solid fa-bolt upgrade-ico"></i>
                    </div>
                    <p className="sign">Crafted by ApnaCollege &hearts;</p>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;
