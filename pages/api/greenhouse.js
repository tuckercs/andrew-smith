import axios from 'axios'

export default async function handler(request, response) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://boards-api.greenhouse.io/v1/boards/trialspark/jobs?content=true',
    headers: {},
  }

  const res = await axios.request(config)
  response.json(res.data)
}
