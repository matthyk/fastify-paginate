import Fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import fastifyPaginate from '../src'

describe('paginationUrls decorator', function () {
  let fastify: FastifyInstance

  beforeAll(async function () {
    fastify = Fastify()
    await fastify.register(fastifyPaginate)

    fastify.get('/users/with/offsetlimit', async function (req: FastifyRequest) {
      return req.paginationUrls({
        self: { offset: 10, limit: 20 },
        next: { offset: 30, limit: 20 },
      })
    })
  })

  it('should create paginate urls', async function () {
    const result = await fastify.inject({
      method: 'GET',
      url: '/users/with/offsetlimit',
    })

    const body = JSON.parse(result.body)

    expect(body.self).toBeDefined()
    expect(body.next).toBeDefined()

    const selfUrl = new URLSearchParams(body.self)

    expect(selfUrl.get('offset')).toBe('10')
    expect(selfUrl.get('limit')).toBe('20')
  })

  it('should overwrite parameters', async function () {
    const fastify = Fastify()
    await fastify.register(fastifyPaginate)

    fastify.get('/users/with/offsetlimit', async function (req: FastifyRequest) {
      return req.paginationUrls({
        self: { offset: 10, limit: 20 },
        next: { offset: 30, limit: 20 },
      })
    })

    const result = await fastify.inject({
      method: 'GET',
      url: '/users/with/offsetlimit?offset=100&limit=200',
    })

    const body = JSON.parse(result.body)

    expect(body.self).toBeDefined()
    expect(body.next).toBeDefined()

    const nextUrl = new URLSearchParams(body.next)

    expect(nextUrl.get('offset')).toBe('30')
    expect(nextUrl.get('limit')).toBe('20')
  })

  it('should build relative url correctly', async () => {
    const fastify = Fastify()
    await fastify.register(fastifyPaginate)

    fastify.get('/posts', async function (req: FastifyRequest) {
      return req.paginationUrls({
        self: { offset: 100, limit: 50 },
        prev: { offset: 50, limit: 50 },
      })
    })

    const result = await fastify.inject({
      method: 'GET',
      url: '/posts?offset=100&limit=50&name=matthyk&tag=food',
    })

    const body = JSON.parse(result.body)

    expect(body.self).toBeDefined()
    expect(body.prev).toBeDefined()

    const selfUrl = new URLSearchParams(body.self)
    const nextUrl = new URLSearchParams(body.prev)

    expect(selfUrl.get('offset')).toBe('100')
    expect(selfUrl.get('limit')).toBe('50')
    expect(selfUrl.get('name')).toEqual('matthyk')
    expect(selfUrl.get('tag')).toEqual('food')

    expect(nextUrl.get('offset')).toBe('50')
    expect(nextUrl.get('limit')).toBe('50')
    expect(nextUrl.get('name')).toEqual('matthyk')
    expect(nextUrl.get('tag')).toEqual('food')
  })
})
