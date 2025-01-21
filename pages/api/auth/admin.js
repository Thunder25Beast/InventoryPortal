import config from '@/utils/config'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;

  if (password === config.adminPassword) {
    return res.status(200).json({
      isAdmin: true,
      message: 'Admin login successful'
    });
  }

  return res.status(401).json({
    isAdmin: false,
    message: 'Invalid admin password'
  });
} 