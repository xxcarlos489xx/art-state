import { createHash } from 'crypto'

export const generateFileName = (name: string): string => {
  const md5 = createHash('md5').update(name).digest('hex').toUpperCase()
  const timestamp = Math.floor(Date.now() / 1000)
  return `${md5}_${timestamp}`
}