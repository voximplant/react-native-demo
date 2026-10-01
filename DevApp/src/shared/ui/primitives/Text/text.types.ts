export type TextVariant =
  /** Screen/Page heading */
  | 'display'

  /** Modal heading, page subheadings */
  | 'heading_1'

  /** Modal subheading, body subheading */
  | 'heading_2'

  /** Smaller body subheading, table heading */
  | 'heading_3'

  /** Main content, forms, etc. */
  | 'body'

  /** Small body text */
  | 'body_sm'

  /** Captions, hints, counters, secondary text */
  | 'caption'

  /** Smallest captions, hints, counters, secondary text */
  | 'caption_sm'

  /** Code blocks */
  | 'code'
