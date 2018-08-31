/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;

const contributors = [
  {
    name: 'Stevche Radevski',
    privateSite: 'https://sradevski.com',
    githubAccount: 'sradevski',
  },
];

class Help extends React.Component {
  render() {
    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h1>Contributors</h1>
            </header>
            <div style={{ marginTop: 40 }}>
              {contributors.map(contributor => {
                const githubUrl = `https://www.github.com/${
                  contributor.githubAccount
                }`;
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={contributor.privateSite || githubUrl}
                    >
                      <img
                        style={{ borderRadius: 5 }}
                        src={`https://avatars.githubusercontent.com/${
                          contributor.githubAccount
                        }`}
                        alt={contributor.name}
                        height="100"
                        width="100"
                      />
                    </a>
                    <div style={{ marginLeft: 20 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {contributor.name}
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={githubUrl}
                        >
                          <img
                            style={{ marginRight: 6, height: 20, width: 20 }}
                            src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.0.0/svg/mark-github.svg"
                          />
                          Github Page
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
