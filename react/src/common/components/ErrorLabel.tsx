import React from "react";

interface IProps {
    error: string | undefined;
}

export default function ErrorLabel(props: IProps) {
    return (
        <div hidden={!props.error} className="invalid-feedback">{props.error}</div>
    );
}
