# Aida

Data modeling done right.

## Introduction

Data models define applications. In a large system, different teams would work with almost the same model, but have very different definitions and understanding of the data. Data models should be central to a system, and this is what Aida is trying to achieve - **defining models in properties in a single place, and reusing it throughout the entire system.** 

A model will have very similar properties, whether is used in the frontend, it defines a database schema, or is used by an analytics team. If you were to implement a system now, you would very likely have everything separately defined, without anything being shared. An example of the forms a very similar model might take is:

- A Flow type in your React frontend.
- A TypeScript type in your NodeJS backend
- A Mongoose schema for your MongoDB
- A Hive schema in your Hadoop data warehouse

Each of these might have an accompanying validation, all implemented separately. Moreover, you might have a fake server for the frontend that will also have another endpoints and schema definition, and the backend might use Postman to fire HTTP requests. Some of the properties in a model might lack a description and the analytics team will have no idea what the some team meant by "shippingTypes" (likely an enum with some values). These are problems that are present in any system, especially as they grow and communication between teams gets very complex.

We can see that, for example, the same user ID should have the same type, validation logic, and documentation, regardless of the part of the system where it is used. Having everything related to a property colocated with it makes that property self-contained, allowing for things like applying the same validation on both frontend and backend trivial. 

## What Does Aida Enable?

Aida allows you to define your core model that is common to every part of your system, on top of which you can define your app-specific models. You can then specify a list of injectors that will generate something derived from the data models, and consumers that will use the product of the injectors. You can find a list of existing injectors and consumers further down in this readme.

TBD