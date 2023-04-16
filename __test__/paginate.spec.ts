import Fastify, { FastifyInstance } from 'fastify'
import fastifyPaginate from '../src'

describe('paginate decorators', function () {
  let fastify: FastifyInstance

  beforeAll(async function () {
    fastify = Fastify()
    await fastify.register(fastifyPaginate)
  })

  it('should decorate fastify instance with the paginate methods', function () {
    expect(fastify.paginate).toBeDefined()
    expect(fastify.paginate.offsetLimit).toBeDefined()
    expect(fastify.paginate.pageNumbers).toBeDefined()
  })

  describe('offsetLimit', function () {
    it('should return pagination result', function () {
      const result = fastify.paginate.offsetLimit(100, { offset: 10, limit: 20 })

      expect(result).toBeDefined()
      expect(result.self).toBeDefined()
      expect(result.prev).toBeDefined()
      expect(result.next).toBeDefined()
      expect(result.last).toBeDefined()
      expect(result.first).toBeUndefined()
    })
  })

  describe('pageNumbers', function () {
    it('should set default page size to 10', function () {
      const result = fastify.paginate.pageNumbers(100, { page: 9 })

      expect(result).toBeDefined()
      expect(result.next).toBeDefined()
      expect(result.last).toBeUndefined()
    })

    it('should use page size provided in the plugin options', async function () {
      const fastify = Fastify()
      await fastify.register(fastifyPaginate, { pageSize: 9 })

      const result = fastify.paginate.pageNumbers(100, { page: 9 })

      expect(result).toBeDefined()
      expect(result.next).toBeDefined()
      expect(result.last).toBeDefined()
    })

    it('should use given page size', function () {
      const result = fastify.paginate.pageNumbers(100, { page: 1 }, 100)

      expect(result.self).toBeDefined()
      expect(result.next).toBeUndefined()
      expect(result.prev).toBeUndefined()
    })

    it('should return pagination result', function () {
      const result = fastify.paginate.pageNumbers(100, { page: 5 })

      expect(result).toBeDefined()
      expect(result.self).toBeDefined()
      expect(result.prev).toBeDefined()
      expect(result.next).toBeDefined()
      expect(result.last).toBeDefined()
      expect(result.first).toBeDefined()
    })
  })
})
