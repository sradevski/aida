const SocialNetwork = {
  id: {
    vtype: 'string',
    faker: ['facebook', 'instagram', 'twitter'],
  },
  name: {
    vtype: 'string',
    faker: ['Facebook', 'Instagram', 'Twitter'],
  },
  fontLogo: {
    vtype: 'string',
    faker: ['logo-facebook', 'logo-instagram', 'logo-twitter'],
  },
  color: {
    vtype: 'string',
    faker: ['#3b5998', '#fb3958', '#0077B5'],
  },
};

export default SocialNetwork;
