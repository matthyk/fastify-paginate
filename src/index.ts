import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { OffsetLimit, OffsetLimitPagination } from './offset-limit'
import { PaginationResult } from './pagination-result'
import { PageNumber, PageNumberPagination } from './page-number'

declare module 'fastify' {
  export interface FastifyInstance {
    paginate: {
      offsetLimit: (totalCount: number, current: OffsetLimit) => PaginationResult<OffsetLimit>

      pageNumbers: (totalCount: number, current: PageNumber, pageSize?: number) => PaginationResult<PageNumber>
    }
  }

  export interface FastifyRequest {
    paginationUrls: <T extends Record<string, string | number>>(
      paginationResult: PaginationResult<T>
    ) => PaginationResult<string>
  }
}

export interface FastifyPaginateOptions {
  pageSize?: number
}

const fastifyPaginate: FastifyPluginAsync<FastifyPaginateOptions> = async (
  fastify: FastifyInstance,
  opts: FastifyPaginateOptions
): Promise<void> => {
  const defaultPageSize = opts.pageSize ?? 10

  function offsetLimit(totalCount: number, current: OffsetLimit): PaginationResult<OffsetLimit> {
    return new OffsetLimitPagination(totalCount, current).build()
  }

  function pageNumbers(totalCount: number, current: PageNumber, pageSize?: number): PaginationResult<PageNumber> {
    return new PageNumberPagination(totalCount, current, pageSize ?? defaultPageSize).build()
  }

  function paginationUrls<T extends Record<string, string | number>>(
    this: FastifyRequest,
    paginationResult: PaginationResult<T>
  ): PaginationResult<string> {
    const result: PaginationResult<string> = {
      self: '',
    }

    const keys = ['self', 'first', 'prev', 'last', 'next'] as (keyof PaginationResult<T>)[]

    keys.forEach((key) => {
      if (typeof paginationResult[key] === 'object') {
        const searchParams = new URLSearchParams(this.query as Record<string, string>)

        Object.keys(paginationResult[key]).forEach((param) => {
          searchParams.set(param, paginationResult[key][param].toString())
        })

        result[key] = searchParams.toString()
      }
    })

    return result
  }

  fastify.decorate('paginate', {
    offsetLimit,
    pageNumbers,
  })

  fastify.decorateRequest('paginationUrls', paginationUrls)
}

export * from './pagination-result'
export * from './offset-limit'
export * from './pagination-result'
export default fp<FastifyPaginateOptions>(fastifyPaginate, {
  fastify: '4.x',
  name: 'fastify-paginate',
})
