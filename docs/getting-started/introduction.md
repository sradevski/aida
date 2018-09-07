---
id: introduction
title: Introduction
sidebar_label: Introduction
---

Data models define applications. In a large system, different teams will very likely work with almost the same model but will have very different definitions and understanding of the data. Data models should be central to a system, and this is what Aida is trying to achieve - **defining models in a single place, and reusing them throughout the entire system.** 

A model will have very similar properties, whether it is used in the frontend, it defines a database schema, or it is used by an analytics team. If you were to implement a system now, you would very likely have everything separately defined, without anything being shared. An example of the forms a very similar model might take is:

- Flow type definition in your React frontend
- TypeScript type definition in your NodeJS backend
- Thrift schema that is used to communicate between services
- Mongoose schema for your MongoDB
- Hive schema in your Hadoop data warehouse

On top of the schema/type definitions, you will also very likely have other metadata directly related to your model scattered all over the place, such as:

- Validation logic in your frontend, backend, and maybe before it goes in your data warehouse
- Fake server for frontend development that will work with exactly the same data model
- Fake requests caller to test your backend (such as Postman)
- Documentation of all your endpoints and models your system provides
- Description of what each property in the model represents used by the analytics team

All of the functionalities and definitions mentioned above have a lot in common. We can see that, for example, the same user ID should have the same type, validation logic, and documentation, regardless of the part of the system where it is used. Having everything related to a property colocated with it makes that property self-contained, allowing for things like applying the same validation on both frontend and backend trivial. 

Aida allows you to define your core model that is common to every part of your system, on top of which you can define your app-specific models. These models can then be used to generate type definitions, schemas, fake data, and much more. Aida data models represent a single source of truth, and everything else is derived and generated automatically. Such an approach promotes sharing and reuse, both within and outside an organization.