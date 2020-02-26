// NODE_ENV有三个值，分别对应如下:

// 运行npm start，为development
// 运行npm test，为test
// 运行npm run build，为production

const development = {
  // 线上后端地址
  BASE_URL: 'http://127.0.0.1:8000',
  // 本地后端地址
  // BASE_URL: 'http://192.168.0.43:7000',
};

const prod = {
  BASE_URL: 'http://192.168.0.43:7001',
};

const qa = {
  BASE_URL: 'http://192.168.0.43:7001',
};

function getConfig() {
  const env = CUSTOM_ENV; //eslint-disable-line
  console.log(env)
  if (env === 'qa') {
    return qa;
  }
  if (env === 'prod') {
    return prod;
  }
  return development;
}

const config = getConfig();

export default config;
