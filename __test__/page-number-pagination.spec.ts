import { PageNumber, PageNumberPagination } from '../src/page-number'
import { PaginationResult } from '../src'

describe('page-number-pagination', function () {
  let paginationResult: PaginationResult<PageNumber>

  beforeAll(function () {
    paginationResult = new PageNumberPagination(100, { page: 4 }, 10).build()
  })

  it('should always return self', function () {
    expect(paginationResult.self).toBeDefined()

    expect(new PageNumberPagination(0, { page: 1 }, 0).build().self).toBeDefined()
  })

  it('should always set current values in self', function () {
    expect(paginationResult.self.page).toBe(4)
  })

  describe('next', function () {
    it('should return next page if available', function () {
      expect(paginationResult.next).toBeDefined()
    })

    it('should not return next page if current is last', function () {
      expect(new PageNumberPagination(50, { page: 5 }, 10).build().next).toBeUndefined()
    })

    it('should increase page number by one', function () {
      expect(paginationResult.next?.page).toBe(5)
    })
  })

  describe('last', function () {
    it('should return last page if available', function () {
      expect(paginationResult.last).toBeDefined()
    })

    it('should not return last page if next is last page', function () {
      const result = new PageNumberPagination(30, { page: 5 }, 5).build()

      expect(result.next).toBeDefined()
      expect(result.last).toBeUndefined()
    })

    it('should ceil page number', function () {
      const result = new PageNumberPagination(110, { page: 2 }, 15).build()

      expect(result.last).toBeDefined()
      expect(result.last?.page).toBe(8)
    })

    it('should set correct page size', function () {
      expect(paginationResult.last?.page).toBe(10)
    })
  })

  describe('prev', function () {
    it('should return prev if available', function () {
      expect(paginationResult.prev).toBeDefined()
    })

    it('should not return prev if current is first page', function () {
      const result = new PageNumberPagination(32, { page: 1 }, 5).build()

      expect(result.prev).toBeUndefined()
    })

    it('should decrease page number by one', function () {
      expect(paginationResult.prev?.page).toBe(3)
    })
  })

  describe('first', function () {
    it('should return first if available', function () {
      expect(paginationResult.first).toBeDefined()
    })

    it('should not return first if prev is first page', function () {
      const result = new PageNumberPagination(10, { page: 2 }, 2).build()

      expect(result.first).toBeUndefined()
    })

    it('should set page to one', function () {
      expect(paginationResult.first?.page).toBe(1)
    })
  })
})
