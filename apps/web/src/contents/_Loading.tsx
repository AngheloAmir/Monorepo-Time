import Header from "../components/Header";

export default function Loading() {
    return (
        <div className='w-screen h-screen overflow-hidden'>
            <Header />
            <div className="flex flex-1 overflow-hidden ">
                <main className="flex-1 relative overflow-hidden bg-gray-900">
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
                    </div>
                </main>
            </div>
        </div>
    )
}