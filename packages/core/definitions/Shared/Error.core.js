//TODO: Think how to manage error objects.

const Error = {
  description: {
    vtype: 'string',
    required: true,
    faker: 'lorem.sentences',
  },
  errorCode: {
    vtype: 'integer',
    faker: 'random.number',
  },
};

export default Error;
