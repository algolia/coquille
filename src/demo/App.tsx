import Coquille from '../Coquille';
import commands from './commands';

function App() {
  return (
    <section className="h-[100vh] flex items-center justify-center -mt-24">
      <div className="w-3/4 max-w-4xl drop-shadow-lg rounded-lg p-4 bg-[#0E2058] text-white text-sm font-mono">
        <Coquille
          className="h-[500px]"
          promptPrefix={
            <span className="font-mono font-bold text-blue-100 flex mr-2">{'$ >'}</span>
          }
          commands={commands}
        />
      </div>
    </section>
  );
}

export default App;
