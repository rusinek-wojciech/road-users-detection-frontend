/**
 * @url https://medium.com/swlh/semaphores-in-javascript-e415b0d684bc
 */
export class Semaphore {
  private requests: { resolve: any; reject: any; fn: any; args: any }[]
  private runningRequests: number
  private maxConcurrentRequests: number
  /**
   * Creates a semaphore that limits the number of concurrent Promises being handled
   */
  constructor() {
    this.requests = []
    this.runningRequests = 0
    this.maxConcurrentRequests = 1
  }

  /**
   * Returns a Promise that will eventually return the result of the function passed in
   * Use this to limit the number of concurrent function executions
   * @param {*} fn function that has a cap on the number of concurrent executions
   * @param  {...any} args any arguments to be passed to fnToCall
   * @returns Promise that will resolve with the resolved value as if the function passed in was directly called
   */
  public call<T>(
    fn: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requests.push({
        resolve,
        reject,
        fn,
        args,
      })
      this.next()
    })
  }

  private next(): void {
    if (!this.requests.length) {
      return
    }

    if (this.runningRequests >= this.maxConcurrentRequests) {
      return
    }

    const { resolve, reject, fn, args } = this.requests.shift()!
    this.runningRequests++
    fn(...args)
      .then((res: any) => resolve(res))
      .catch((err: any) => reject(err))
      .finally(() => {
        this.runningRequests--
        this.next()
      })
  }
}
