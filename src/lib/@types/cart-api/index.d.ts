export type AddToCartResponse = {
  success: boolean
  data: {
    message: string
    summary_qty?: number
  }
}
