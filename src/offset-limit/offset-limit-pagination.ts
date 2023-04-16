import { AbstractPagination } from '../abstract-pagination'
import { OffsetLimit } from './offset-limit'

export class OffsetLimitPagination extends AbstractPagination<OffsetLimit> {
  protected limit: number

  protected offset: number

  protected totalCount: number

  /*
  We do not accept negative values to keep the logic simple.
  If the limit value is negative, it is set to 10.
  */
  constructor(totalCount: number, current: OffsetLimit) {
    const c = {
      offset: current.offset < 0 ? 0 : current.offset,
      limit: current.limit < 0 ? 10 : current.limit,
    }
    super(c)
    this.limit = c.limit
    this.offset = c.offset
    this.totalCount = totalCount < 0 ? 0 : totalCount
  }

  protected override getFirst(): OffsetLimit {
    return {
      offset: 0,
      limit: Math.min(this.limit, this.offset - this.limit),
    }
  }

  // We keep the limit even if it exceeds the total count so that each link contains the same limit.
  protected override getLast(): OffsetLimit {
    return {
      limit: this.limit,
      offset: Math.max(this.currentOffsetPlusTwoPages(), this.totalCount - this.limit),
    }
  }

  // We keep the limit even if it exceeds the total count so that each link contains the same limit.
  protected override getNext(): OffsetLimit {
    return {
      limit: this.limit,
      offset: Math.min(this.totalCount - 1, this.offset + this.limit),
    }
  }

  protected override getPrev(): OffsetLimit {
    return {
      limit: this.limit,
      offset: Math.max(0, this.offset - this.limit),
    }
  }

  protected override hasFirst(): boolean {
    return this.totalCount > 0 && this.offset - this.limit > 0
  }

  protected override hasLast(): boolean {
    return this.currentOffsetPlusTwoPages() < this.totalCount
  }

  protected override hasNext(): boolean {
    return this.offset + this.limit < this.totalCount
  }

  protected override hasPrev(): boolean {
    return this.offset > 0 && this.totalCount > 0
  }

  private currentOffsetPlusTwoPages(): number {
    return this.offset + this.limit * 2
  }
}
