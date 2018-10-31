# Aida - Unified data modeling

Aida is a data and endpoint modeling tool. You can document your data models from different parts of the system in one place and share commonalities between them, representing a single source of truth. It allows you to unify how your data models and endpoints are defined, with all the necessary metadata being co-located.

Once everything is defined and ready to be used, the possibilities are endless. Some of the use-cases for Aida are:

- Generate dummy data for your development database
- Generate API documentation for your API
- Generate schemas and validation for both your frontend and backend
- Generate types (Flow, TypeScript, etc.)
- Mock your API on the client-side for truly independent frontend development
- Fire mocked requests to your backend for testing
- ...


> Although the aim is for Aida to be language-independent, which is true for some of the things Aida can be used for, other things (such as validation) target JavaScript as of now.

## Usage

> Aida is currently in a very early beta, so there will be some breaking changes as the tool evolves. That being said, we will provide a proper changelog with upgrade steps as detailed and automated as possible.

You can find all the documentation about Aida at [Aida's website](https://sradevski.com/aida/). Please refer to the [**Getting Started**](https://sradevski.com/aida/docs/getting-started) section for an introduction to how you can start using Aida, or check the [**Reference**](https://sradevski.com/aida/docs/getting-started) section when you need a quick lookup.

## What Does "Aida" Mean?

The name "Aida" comes from the Japanese kanji **間**, which can mean "in-between" - signifying, in this case, something that sits between different parts of a system, with the goal of enabling smoother integration between the parts. 

## Contributing

We use Lerna to manage the Aida monorepo. You can setup your development enviornment just by running `git clone` on the repo and run `lerna bootstrap` to install all dependencies. You can run the CLI using `lerna run cli` if you wish to manually test Aida.

Pull requests should be done against the `master` branch. Any pull request for a code change should be accompanied with unit tests.