import React from "react";
import { DefaultProps } from "../utils/Tools";

export default function GlobalContent(props: DefaultProps) {
    return (
        <div className="global_content">
            {props.children}
        </div >
    )
}