export default function Pheebo() {

    return <>
        <div className="grid items-center justify-items-center justify-center min-h-screen">
            <div>

                <h1 className=" animate-pulse text-center w-full text-3xl mb-1.5 text-black dark:text-white">Ja! Pheebo!</h1>
                <iframe style={{ width: 700, height: 400, display: 'block' }}
                    src="https://www.bilibili.com/blackboard/live/live-activity-player.html?cid=27372839&quality=0"
                    frameBorder="no" scrolling="no" allow="autoplay; encrypted-media" allowFullScreen={true}>
                </iframe>

            </div>
        </div>
    </>
}