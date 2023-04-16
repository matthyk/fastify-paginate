import { AbstractPagination } from '../abstract-pagination'
import { PageNumber } from './page-number'

export class PageNumberPagination extends AbstractPagination<PageNumber> {
  protected totalCount: number

  protected pageSize: number

  /*
  We do not accept negative values to keep the logic simple.
  If the page size value is negative, it is set to 10. If the page value is negative, it is set to 1.
  */
  constructor(totalCount: number, current: PageNumber, pageSize: number) {
    super({
      page: current.page < 0 ? 1 : current.page,
    })
    this.totalCount = totalCount < 0 ? 0 : totalCount
    this.pageSize = pageSize < 0 ? 10 : pageSize
  }

  protected getNext(): PageNumber {
    return {
      page: this.current.page + 1,
    }
  }

  protected getPrev(): PageNumber {
    return {
      page: this.current.page - 1,
    }
  }

  protected hasNext(): boolean {
    return this.current.page * this.pageSize < this.totalCount
  }

  protected hasPrev(): boolean {
    return this.current.page > 1
  }

  protected hasFirst(): boolean {
    return this.current.page > 2
  }

  protected hasLast(): boolean {
    return (this.current.page + 1) * this.pageSize < this.totalCount
  }

  protected getLast(): PageNumber | undefined {
    return {
      page: Math.ceil(this.totalCount / this.pageSize),
    }
  }

  protected getFirst(): PageNumber | undefined {
    return {
      page: 1,
    }
  }
}
