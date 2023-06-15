import Coquille from '../Coquille';
import commands, { runOnStart } from './commands';

function App() {
  return (
    <section className="cq-h-[100vh] cq-flex cq-items-center cq-justify-center -cq-mt-24">
      <div className="cq-w-3/4 cq-max-w-4xl cq-drop-shadow-lg cq-rounded-lg cq-p-4 cq-bg-[#0E2058] cq-text-white cq-text-sm cq-font-mono">
        <Coquille
          className="cq-h-[500px]"
          promptPrefix={
            <span className="cq-font-mono cq-font-bold cq-text-blue-100 cq-flex cq-mr-2">
              {'$ >'}
            </span>
          }
          commands={commands}
          runOnStart={runOnStart}
          onCommandRun={(fullCommand, parsedOne) => {
            console.log('onCommandRun', { fullCommand, parsedOne });
          }}
        />
      </div>
    </section>
  );
}

export default App;
