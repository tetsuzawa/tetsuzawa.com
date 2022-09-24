import React from "react"

export default function ConditionalRendering(props) {
    const {slug, component} = props
    console.log("location.href.includes(slug): ",location.href.includes(slug))
    console.log(location.href)
    console.log(slug)
    console.log(component)
    if (location.href.includes(slug)) {
        return component
    }
    return <></>
}