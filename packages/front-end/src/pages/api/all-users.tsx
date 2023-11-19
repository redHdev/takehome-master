// pages/api/getMods.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { buildQueryString } from '../../util';

const apiURl = process.env.API_URL || 'http://127.0.0.1:50000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { query } = req;
    const queryString = buildQueryString(query);
    const response = await fetch(`${apiURl}/users?${queryString}`);
    const responseData = await response.json();
    const { success } = responseData;
    if(success){
        res.status(200).json(responseData);
    }
    else{
        console.log('Error: ', responseData.message);
        res.status(500).json({error: responseData.message});
    }

  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
