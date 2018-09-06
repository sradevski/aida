/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button
              href={docUrl('getting-started/introduction.html', language)}
            >
              Get Started
            </Button>
            <Button href={'https://www.github.com/sradevski/aida'}>
              Github Repo
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="threeColumn">
    {[
      {
        content:
          'Instead of having multiple definitions of the same data model, Aida allows you to have everything defined in one place, bringing standardization and understanding between different parts of your system.',
        image: imgUrl('brain.png'),
        imageAlign: 'top',
        title: 'Single source of truth for your data',
      },
      {
        content:
          'Every time you make a change to your model, automatically propagate that change in its appropriate form to every part of your system.',
        image: imgUrl('propagate.png'),
        imageAlign: 'top',
        title: 'Automated data model propagation',
      },
      {
        content:
          'Have a common, yet flexible language to communicate the evolution of your data and endpoints. Clean separation of concerns, along with automated data mocking, leads to true independent development between teams.',
        image: imgUrl('communicate.png'),
        imageAlign: 'top',
        title: 'A communication tool',
      },
    ]}
  </Block>
);

const FeatureCallout = props => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: 'center' }}
  >
    <h2>There is much more to come.</h2>
    <p>
      Aida is still in its infancy, with unclear use cases and lacking features.
      We need your feedback and participation to drive the evolution of Aida and
      bring data models as a centerpiece to every organization.
    </p>
  </div>
);

const LearnHow = props => (
  <Block background="light">
    {[
      {
        content:
          'Aida provides a data and endpoint modeling structure. You can document your data models from different parts of the system in one place, while sharing commonalities between them. Aida allows you to unify how your data models and endpoints are defined, with all the necessary metadata being co-located. <br/><br/> Once everything is defined and ready to be used, the possibilities are endless. You can mock your API on your client-side for trully independent frontend development, generate dummy data for your development database, generate API documentation for your backend, and generate validation and schemas, all done automatically. For more information, head to our **[getting started](docs/getting-started/introduction.html)** guide',
        image: imgUrl('nutshell.png'),
        imageAlign: 'right',
        title: 'Aida in a Nutshell',
      },
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned;
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} key={i}>
          <img src={user.image} alt={user.caption} title={user.caption} />
        </a>
      );
    });

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          <LearnHow />
          {/* <Showcase language={language} /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
