const Message = ({children,username,description,avatar}) => {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg">
        <div className="flex items-center gap-2">
            <img src={avatar} className="rounded-full border-cyan-500 border-2 w-10"/>
            <h2>{username}</h2>
        </div>
        <div className="py-4">
            <p>{description}</p>
        </div>
        {children}
    </div>
  )
}

export default Message