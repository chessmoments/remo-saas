import { Queue, Worker, Job } from 'bullmq'
import IORedis from 'ioredis'

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
}

// Lazy-initialized queues
let _renderQueue: Queue | null = null
let _parseQueue: Queue | null = null

export function getRenderQueue(): Queue {
  if (!_renderQueue) {
    _renderQueue = new Queue('video-rendering', {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    })
  }
  return _renderQueue
}

export function getParseQueue(): Queue {
  if (!_parseQueue) {
    _parseQueue = new Queue('data-parsing', {
      connection,
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    })
  }
  return _parseQueue
}

// Worker factory for video rendering
export function createRenderWorker(
  processor: (job: Job) => Promise<void>
): Worker {
  return new Worker('video-rendering', processor, {
    connection,
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '2'),
  })
}

// Worker factory for data parsing
export function createParseWorker(
  processor: (job: Job) => Promise<void>
): Worker {
  return new Worker('data-parsing', processor, {
    connection,
    concurrency: parseInt(process.env.PARSE_WORKER_CONCURRENCY || '4'),
  })
}

// Redis client for direct operations
export function getRedisClient(): IORedis {
  return new IORedis(connection)
}
