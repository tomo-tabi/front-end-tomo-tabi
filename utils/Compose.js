import React from "react";

export default function Compose(props) {
  const { components = [], children } = props
  // console.log(JSON.stringify(components));

  return (
    <>
      {components.reduceRight((acc, Comp) => {
        return <Comp>{acc}</Comp>
      }, children)}
    </>
  )
}