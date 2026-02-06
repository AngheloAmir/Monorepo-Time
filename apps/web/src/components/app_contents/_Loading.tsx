import Header from "../Header";

export default function Loading() {
    return (
        <div className='w-screen h-screen overflow-hidden'>
            <Header />
            <div className="flex flex-1 overflow-hidden ">
                <main className="flex-1 relative overflow-hidden bg-gray-900">
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_100%,rgba(168,85,247,0.1),transparent_50%)]"></div>
                    </div>
                </main>
            </div>
        </div>
    )
}