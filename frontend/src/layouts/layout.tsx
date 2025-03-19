import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BgImage from "@/components/bgImage";
import ChatBot from "@/components/ChatBot";

type Props = {
    children: React.ReactNode;
    showBgImage?: boolean, 
};


const Layout = ({children, showBgImage = false}: Props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {(showBgImage && <BgImage/>) ? (<BgImage/>) : (<></>)}

            <div className="container mx-auto flex-1 py-10">{children}</div>

            <ChatBot/>
            
            <Footer/>
        </div>
    )
}

export default Layout;