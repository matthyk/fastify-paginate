import { OffsetLimit, OffsetLimitPagination, PaginationResult } from '../src'

describe('offset-limit-pagination', function () {
  let paginationResult: PaginationResult<OffsetLimit>

  beforeAll(function () {
    paginationResult = new OffsetLimitPagination(100, { offset: 30, limit: 8 }).build()
  })

  describe('self', function () {
    it('should always return self', function () {
      expect(paginationResult.self).toBeDefined()
    })

    it('should always set current values in self', function () {
      expect(paginationResult.self.offset).toBe(30)
      expect(paginationResult.self.limit).toBe(8)
    })
  })

  describe('next', function () {
    it('should increase the offset by the limit', function () {
      expect(paginationResult.next?.offset).toBe(38)
    })

    it('should keep the limit the same', function () {
      expect(paginationResult.next?.limit).toBe(8)
    })

    it('should not return next if last item is reached', function () {
      const result = new OffsetLimitPagination(13, { offset: 10, limit: 3 }).build()

      expect(result.next).toBeUndefined()
    })

    it('should return next if only one item is available', function () {
      const result = new OffsetLimitPagination(57, { offset: 50, limit: 6 }).build()

      expect(result.next).toBeDefined()
    })

    it('should keep the limit even it exceeds the total count', function () {
      const result = new OffsetLimitPagination(11, { offset: 0, limit: 10 }).build()

      expect(result.next).toBeDefined()
      expect(result.next?.limit).toBe(10)
    })

    it('should set totalcount - 1 as maximum offset', function () {
      const result = new OffsetLimitPagination(21, { offset: 10, limit: 10 }).build()

      expect(result.next?.offset).toBe(20)
    })
  })

  describe('last', function () {
    it('should have last if there are items available after the next page', function () {
      const result = new OffsetLimitPagination(30, { offset: 11, limit: 9 }).build()

      expect(result.last).toBeDefined()
    })

    it('should not have last if the next page is already the last page', function () {
      const result = new OffsetLimitPagination(10, { offset: 0, limit: 7 }).build()

      expect(result.last).toBeUndefined()
    })

    it('should keep the limit', function () {
      const result = new OffsetLimitPagination(90, { offset: 80, limit: 4 }).build()

      expect(result.last?.limit).toBe(4)
    })

    it('should point to the last items', function () {
      const result = new OffsetLimitPagination(50, { offset: 13, limit: 3 }).build()

      expect(result.last?.offset).toBe(47)
    })

    it('should adjust the offset when the next page overlaps the last page', function () {
      const result = new OffsetLimitPagination(1000, { offset: 940, limit: 25 }).build()

      expect(result.last?.offset).toBe(990)
    })
  })
})
