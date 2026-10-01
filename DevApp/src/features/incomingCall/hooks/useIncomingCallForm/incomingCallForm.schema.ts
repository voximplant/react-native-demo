import z from 'zod'

export const incomingCallFormSchema = z.object({
  muteAudio: z.boolean(),
  receiveVideo: z.boolean()
})

export type IncomingCallFormData = z.infer<typeof incomingCallFormSchema>
