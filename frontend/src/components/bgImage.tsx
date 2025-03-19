import backgroundImage from "../assets/backgroundImage.png"

const BgImage = () => {
    return (
        <div>
            <img src={backgroundImage} className="w-full max-h-[600px] object-cover"/>
        </div>
    )
}

export default BgImage