declare module 'typewriter-effect/dist/core' {
  interface TypewriterOptions {
    delay?: number | 'natural'
    deleteSpeed?: number | 'natural'
    loop?: boolean
    cursor?: string
    autoStart?: boolean
    devMode?: boolean
    skipAddStyles?: boolean
    wrapperClassName?: string
    cursorClassName?: string
    strings?: string[]
  }

  class Typewriter {
    constructor(element: Element | string, options?: TypewriterOptions)
    typeString(str: string): this
    deleteAll(speed?: number): this
    deleteChars(amount: number): this
    pauseFor(ms: number): this
    start(): this
    stop(): this
    changeDelay(delay: number): this
    changeDeleteSpeed(speed: number): this
    callFunction(cb: () => void): this
  }

  export default Typewriter
}
