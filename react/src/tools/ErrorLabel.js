import React, { Component } from "react";

class ErrorLabel extends Component {
    render() {
        return (
            <div hidden={!this.props.error} class="invalid-feedback">{this.props.error}</div>
        )
    }
}

export default ErrorLabel