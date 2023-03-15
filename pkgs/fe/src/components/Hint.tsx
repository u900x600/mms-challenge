import React from "react"

export default (props: { hint: string }) => {
  return (
    <span className="hint">{props.hint}</span>
  )
}