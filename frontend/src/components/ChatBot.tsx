import { Toggle } from "@/components/ui/toggle";
import { useEffect, useRef, useState } from "react";
import { IoChatboxEllipses, IoSend, IoClose, IoPerson, IoPersonCircle} from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button, ButtonProps } from "@/components/ui/button";
import { getChatBotResponseRequest } from "@/api/ChatBotApi";
import chatbotIcon from "@/assets/chatbot.png";
import { useGetMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";

const messageHistory = [
    { text: "Hi! How can I assist you today?", isUser: false, timestamp: new Date() },
];

const ChatBot = () => {
    const {isAuthenticated} = useAuth0();

    const {currentUser, isLoading: isGetLoading} = useGetMyUser();

    // console.log("Current user id: ", currentUser?._id);

    const [isToggled, setIsToggled] = useState(false);

    const [inputValue, setInputValue] = useState("");

    const [updatedMessageHistory, setUpdatedMessageHistory] = useState(messageHistory);

    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [updatedMessageHistory]);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const formatTextForBoldTags = (text: string): string => {
        return text
        .replace(/^##\s*(.*?)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold for double *
        .replace(/\*\s(.*?)\n/g, "<br>• $1<br>") // Bullet points with newline after single *
        .replace(/(?:\r\n|\r|\n)/g, "<br>");
    };    

    const handleSubmit = async () => {
        if (inputValue.trim() !== "") {
            const newUserMessage = {
                text: inputValue.trim(),
                isUser: true,
                timestamp: new Date(),
            };

            setUpdatedMessageHistory(prevMessages => [...prevMessages, newUserMessage]);

            setInputValue("");

            const placeholderMessage = {
                text: "Generating response...",
                isUser: false,
                timestamp: new Date(),
            }; 
    
            setUpdatedMessageHistory(prevMessages => [...prevMessages, placeholderMessage]);

            try {
                // Wait for the chatbot response
                const chatbotResponse = await getChatBotResponseRequest({
                    prompt: inputValue.trim(),
                    userId: currentUser?._id as string,
                });

                console.log("chatbot response: ", chatbotResponse);
    
                // Update the placeholder message with the actual response
                setUpdatedMessageHistory(prevMessages => 
                    prevMessages.map((message, index) =>
                        index === prevMessages.length - 1 // Replace the last (placeholder) message
                            ? {
                                text: formatTextForBoldTags(chatbotResponse?.response) || "Error: No response",
                                isUser: false,
                                timestamp: new Date(),
                            }
                            : message
                    )
                );
            } catch (error) {
                console.error("Error fetching chatbot response:", error);
    
                // Update the placeholder message to show an error
                setUpdatedMessageHistory(prevMessages => 
                    prevMessages.map((message, index) =>
                        index === prevMessages.length - 1 // Replace the last (placeholder) message
                            ? {
                                text: "Error generating response. Please try again.",
                                isUser: false,
                                timestamp: new Date(),
                            }
                            : message
                    )
                );
            }

        }
    }

    return (
        <>
            <Card className={`${isToggled ? "pointer-events-none pointer-events-auto" : "hidden"} fixed w-1/4 h-[70%] right-[5%] bottom-[12%] border-[1px] border-black shadow-lg
            `}>
                <CardHeader className="bg-orange-500 rounded-t-lg">
                    <CardTitle className="text-center text-white font-bold">FredFood Assistant</CardTitle>
                </CardHeader>

                <Separator className="border-[0.5px] border-black"/>

                <CardContent className="relative flex flex-col p-2 max-h-[60vh] gap-2">
                    {/* List of messageHistory */}
                    {
                        isAuthenticated ? (<div className="space-y-4 flex-grow overflow-y-auto px-1 pb-5" ref={messageContainerRef}>
                            {
                            updatedMessageHistory.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-1 ${message.isUser ? "justify-end" : "justify-start"}`}
                                >
    
                                    <div className="flex items-center space-x-2">
                                        {!message.isUser && (
                                            <img className="h-11 w-11 border rounded-full border-black" src={chatbotIcon}/>
                                        ) }
                                    </div>
    
                                    <div
                                        className={`max-w-[75%] p-3 rounded-xl ${
                                            message.isUser ? "bg-gray-300 text-black" : "bg-orange-500 text-white"
                                        }`}
                                    >
                                        {
                                            message.isUser ? (
                                                <p>{message.text}</p>
                                            ) : (
                                                <p dangerouslySetInnerHTML={{ __html: message.text }}></p>
                                            )
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>) : (
                            <div className="flex items-center justify-center h-full text-lg font-bold">
                                {/* <IoPersonCircle className="w-16 h-16"/> */}
                                <span>Please log in to use the Assistant</span>
                            </div>
                        )
                    }

                    {/* Form fixed at the bottom */}
                    <div className="fixed bottom-[13%] bg-white w-[24%]">
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <Input value={inputValue} onChange={handleInputChange} placeholder="Enter your prompt"/>
                            <Button onClick={handleSubmit}><IoSend/></Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
            
            {/* Toggle button to activate the chatbot */}
            <Toggle onClick={handleToggle} className={`fixed bottom-[3%] right-[1%] w-20 h-20 rounded-full !bg-orange-500 text-white flex items-center 
                justify-center shadow-lg border border-black transform transition-transform duration-500 ${
                    isToggled ? "rotate-180" : "rotate-360"
                }`}>
                {
                    isToggled ? <IoClose className="w-16 h-16"/> : <IoChatboxEllipses className="w-12 h-12"/> 
                }
            </Toggle>
        </>
    )
}

export default ChatBot