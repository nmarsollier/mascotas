import { Component } from "react";

class ErrorComponent extends Component {
    constructor(props) {
        super(props)

        // Es un mensaje genérico de error
        this.errorMessage = undefined

        // Son errores de los componentes visuales, es un map
        // la clave es el campo con error, el contenido es el mensaje
        this.errors = new Map()
    }

    // Procesa errores rest y llena errors de acuerdo a los resultados
    processRestValidations(data) {
        if (this.errors && this.errors.size > 0) {
            this.cleanRestValidations(this)
        }
        if (data.messages) {
            for (const error of data.messages) {
                this.errors.set(error.path, error.message)
            }
        } else {
            this.errorMessage = data.error
        }
        this.forceUpdate()
    }

    addError(component, message) {
        this.errors.set(component, message)
    }

    // Limpia las validaciones actuales de errores
    cleanRestValidations() {
        this.errorMessage = undefined
        this.errors.clear()
        this.forceUpdate()
    }

    // Devuelve el texto del error de un elemento
    getErrorText(item) {
        return this.errors.get(item)
    }

    getErrorClass(component, baseClass) {
        return baseClass + (this.getErrorText(component) ? " is-invalid" : "")
    }

    hasErrors() {
        return this.errors.size > 0 && !this.errorMessage
    }
}

export default ErrorComponent