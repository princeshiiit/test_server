import env from '#start/env'

const redisConfig = {
  url: env.get('REDIS_URL'),
  token: null, 
}

export default redisConfig