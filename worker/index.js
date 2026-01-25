import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { createRenderWorker } from '../lib/queue.js'
import { uploadFile } from '../lib/s3.js'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()

// Aspect ratio configurations
const ASPECT_CONFIGS = {
  LANDSCAPE: { width: 1920, height: 1080 },
  PORTRAIT: { width: 1080, height: 1920 },
  SQUARE: { width: 1080, height: 1080 },
}

console.log('Starting video render worker...')

const worker = createRenderWorker(async (job) => {
  const { renderJobId, compositionId, aspectRatio = 'LANDSCAPE' } = job.data

  console.log(`Processing render job: ${renderJobId}`)
  console.log(`Composition: ${compositionId}, Aspect: ${aspectRatio}`)

  try {
    // Update job status to rendering
    const renderJob = await prisma.renderJob.update({
      where: { id: renderJobId },
      data: {
        status: 'RENDERING',
        startedAt: new Date(),
        progress: 0,
      },
    })

    const inputProps = renderJob.inputProps

    // Bundle the Remotion project
    console.log('Bundling Remotion project...')
    const bundleLocation = await bundle({
      entryPoint: path.resolve(__dirname, '../remotion/index.tsx'),
      webpackOverride: (config) => config,
    })

    // Select the composition
    console.log('Selecting composition...')
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps,
    })

    // Override dimensions based on aspect ratio
    const { width, height } = ASPECT_CONFIGS[aspectRatio] || ASPECT_CONFIGS.LANDSCAPE

    // Create temp output path
    const tempDir = process.env.RENDER_TEMP_DIR || os.tmpdir()
    const outputPath = path.join(tempDir, `${renderJobId}_${aspectRatio}.mp4`)

    // Render the video
    console.log(`Rendering video to ${outputPath}...`)
    await renderMedia({
      composition: {
        ...composition,
        width,
        height,
      },
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
      onProgress: async ({ progress }) => {
        const percent = Math.round(progress * 100)
        console.log(`Render progress: ${percent}%`)

        // Update progress every 10%
        if (percent % 10 === 0) {
          await prisma.renderJob.update({
            where: { id: renderJobId },
            data: { progress: percent },
          })
        }
      },
    })

    console.log('Render complete. Uploading to S3...')

    // Read the rendered file
    const videoBuffer = fs.readFileSync(outputPath)

    // Upload to S3
    const s3Key = `videos/${renderJob.organizationId}/${renderJobId}_${aspectRatio}.mp4`
    await uploadFile(s3Key, videoBuffer, 'video/mp4')

    // Clean up temp file
    fs.unlinkSync(outputPath)

    // Update job as completed
    await prisma.renderJob.update({
      where: { id: renderJobId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        videoUrl: s3Key,
        completedAt: new Date(),
        duration: Math.round(composition.durationInFrames / composition.fps),
      },
    })

    console.log(`Render job ${renderJobId} completed successfully!`)

  } catch (error) {
    console.error(`Render job ${renderJobId} failed:`, error)

    // Update job as failed
    await prisma.renderJob.update({
      where: { id: renderJobId },
      data: {
        status: 'FAILED',
        error: error.message || 'Unknown error',
      },
    })

    throw error
  }
})

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})

worker.on('error', (err) => {
  console.error('Worker error:', err)
})

console.log('Video render worker is running...')

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down worker...')
  await worker.close()
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('Shutting down worker...')
  await worker.close()
  await prisma.$disconnect()
  process.exit(0)
})
