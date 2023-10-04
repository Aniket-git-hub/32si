import crypto from 'crypto'

function generateDeletionToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

export default generateDeletionToken;
