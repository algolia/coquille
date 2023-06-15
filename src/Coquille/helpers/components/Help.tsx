import React, { FC, Fragment, ReactNode } from 'react';
import { Commands, Flags } from '../../types';

interface HelpProps {
  examples?: string[];
  flags?: Flags;
  learnMore?: ReactNode;
  shortDesc?: string;
  subcommands?: Commands;
  usage?: string;
}
export const Help: FC<HelpProps> = ({
  usage,
  shortDesc,
  subcommands,
  flags,
  examples,
  learnMore,
}) => (
  <>
    {shortDesc ? <p>{shortDesc}</p> : null}
    {/* Usage */}
    {usage ? (
      <>
        <h4 className="cq-font-bold cq-mt-2">Usage</h4>
        <p className="cq-pl-4">{usage}</p>
      </>
    ) : null}
    {/* Commands */}
    {subcommands ? (
      <>
        <h4 className="cq-font-bold cq-mt-2">Commands</h4>
        <dl className="cq-grid cq-grid-cols-auto-full cq-pl-4">
          {Object.keys(subcommands).map((commandName) => (
            <Fragment key={commandName}>
              <dt className="cq-pr-6">{`${commandName}:`}</dt>
              <dd className="cq-w-fit">{subcommands[commandName].shortDesc}</dd>
            </Fragment>
          ))}
        </dl>
      </>
    ) : null}
    {/* Flags */}
    {flags ? (
      <>
        <h4 className="cq-font-bold cq-mt-2">Flags</h4>
        <dl className="cq-grid cq-grid-cols-auto-auto-full cq-pl-4">
          {Object.keys(flags).map((flagName) => (
            <Fragment key={flagName}>
              <dt className="cq-pr-2">
                {flags[flagName].shorthand
                  ? `-${flags[flagName].shorthand},`
                  : null}
              </dt>
              <dt className="cq-pr-6">{`--${flagName}`}</dt>
              <dd className="cq-w-fit">{flags[flagName].shortDesc}</dd>
            </Fragment>
          ))}
        </dl>
      </>
    ) : null}
    {/* Examples */}
    {examples ? (
      <>
        <h4 className="cq-font-bold cq-mt-2">Examples</h4>
        <ul className="cq-pl-4">
          {examples.map((exampleItem) => (
            <li key={exampleItem}>{exampleItem}</li>
          ))}
        </ul>
      </>
    ) : null}
    {/* Learn More */}
    {learnMore ? (
      <>
        <h4 className="cq-font-bold cq-mt-2">Learn More</h4>
        <div className="cq-pl-4">{learnMore}</div>
      </>
    ) : null}
  </>
);
