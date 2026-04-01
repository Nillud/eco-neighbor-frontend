import { jwtVerify } from 'jose'

export async function jwtVerifyServer(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    return payload
  } catch {
    return null
  }
}
