import Background from './components/Background';
import Header from './components/Header';

export default function App() {
    return (
        <div className={`
      h-[100vh]
      w-[100vw]
      overflow-hidden
      bg-zinc-900   
    `}>
            <div className='w-full h-full'>
                <Background />
                <Header />
            </div>
        </div>
    );
}