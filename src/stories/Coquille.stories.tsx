import type { Meta, StoryObj } from '@storybook/react';
import Coquille from '../Coquille';
import commands, { runOnStart } from './commands';

const meta: Meta<typeof Coquille> = {
  title: 'Coquille',
  component: Coquille,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <section className="h-[100vh] flex items-center justify-center -mt-24">
      <div className="w-3/4 max-w-4xl drop-shadow-lg rounded-lg p-4 bg-[#0E2058] text-white text-sm font-mono">
        <Coquille
          className="h-[500px]"
          promptPrefix="$"
          commands={commands}
          runOnStart={runOnStart}
        />
      </div>
    </section>
  ),
};
