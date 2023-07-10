import request from 'superagent';

const testOuboundRequests = async () => {
  const result = (await request.get('https://ipinfo.io/ip')) as any;
  return {
    msg: 'Working as expected',
    result,
  };
};

export default testOuboundRequests;
