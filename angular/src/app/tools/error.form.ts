import { FormGroup } from '@angular/forms';

export interface ValidationErrorItem {
    path: string;
    message: string;
}
export interface ValidationErrorMessage {
    error?: string;
    messages?: ValidationErrorItem[];
}

// Este form es la base para cualquier formulario que necesite controlar errores
export class BasicFromGroupController {
    // Es un mensaje genérico de error
    errorMessage: string;

    // Son errores de los componentes visuales, key es el campo, value el mensaje de error
    errors: Map<string, string> = new Map();

    // El form group, el nombre del componente tiene relación con el key en errors
    form: FormGroup;

    // Procesa errores rest y llena errors de acuerdo a los resultados
    processRestValidations = function (data: ValidationErrorMessage) {
        if (this.errors && this.errors.size > 0) {
            this.cleanRestValidations(this);
        }
        if (data.messages) {
            for (const error of data.messages) {
                this.errors.set(error.path, error.message);
            }
        } else {
            this.errorMessage = data.error;
        }
    };

    // Limpia las validaciones actuales de errores
    cleanRestValidations = function () {
        this.errorMessage = undefined;
        this.errors.clear();
    };

    // Determina si existe algún error en el item especificado
    hasError(item: string) {
        if (this.form) {
            const formItem = this.form.get(item);
            if (formItem && formItem.touched && formItem.invalid) {
                return true;
            }
        }

        if (this.errors.get(item)) {
            return true;
        }

        return false;
    }

    // Devuelve el texto del error de un elemento
    getErrorText(item: string) {
        if (this.errors.get(item)) {
            return this.errors.get(item);
        }

        if (this.form) {
            const formItem = this.form.get(item);
            if (formItem && formItem.touched && formItem.invalid) {
                return 'Valor inválido';
            }
        }

        return undefined;
    }
}

