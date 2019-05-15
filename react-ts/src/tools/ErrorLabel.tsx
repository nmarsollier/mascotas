import React from "react";

export interface IErrorLabelProps {
    error: string;
}

export default class ErrorLabel extends React.Component<IErrorLabelProps, void> {
    public render() {
        return (
            <div hidden={!this.props.error} className="invalid-feedback">{this.props.error}</div>
        );
    }
}
