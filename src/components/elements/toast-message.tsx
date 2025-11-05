"use client"

import {ToastContainer} from "react-toastify"

export function ToastMessage() {
  return (
    <ToastContainer
      progressClassName="bg-spirited-light"
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  )
}
