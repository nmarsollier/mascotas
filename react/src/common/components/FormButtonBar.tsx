import { DefaultProps } from "../utils/Tools";
import React from "react";

export default function FormButtonBar(props: DefaultProps) {
    return (
        <div className="btn-group ">
            {props.children}
        </div >
    )
}