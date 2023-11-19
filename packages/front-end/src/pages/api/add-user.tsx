// pages/api/getMods.tsx
import { NextApiRequest, NextApiResponse } from 'next';

const apiURl = process.env.API_URL || 'http://127.0.0.1:50000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log(req.body, "API");
    const response = await fetch(`${apiURl}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body)
    });
    const responseData = await response.json();
    const { success } = responseData;
    if(success){
        res.status(200).json(responseData.data);
    }
    else{
        console.log('Error: ', responseData.message);
        res.status(500).json({error: responseData.message});
    }

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
