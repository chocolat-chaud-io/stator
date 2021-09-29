import { ClassType, transformAndValidate } from "class-transformer-validator"
import { ValidationError } from "class-validator"
import { useState } from "react"

// Extending object is required for this generic type T
// eslint-disable-next-line @typescript-eslint/ban-types
export function useFormValidator<T extends object>(classType: ClassType<T>) {
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isValid, setIsValid] = useState(false)

  /**
   * @param entity The entity object (doesn't need to be a class instance)
   */
  const validateForm = async (entity: T) => {
    try {
      await transformAndValidate(classType, entity)
      setErrors([])
      setIsValid(true)

      return true
    } catch (errors) {
      setErrors(errors)
      setIsValid(false)

      return false
    }
  }

  /**
   *
   * @param property The property of the object as a string
   */
  const getPropertyErrors = <T>(property: keyof T) => {
    const propertyError = errors.find(error => error.property === property)
    const constraints = propertyError?.constraints || {}

    return (Object.values(constraints) || []).join("\n")
  }

  const errorsByProperty = errors.reduce(
    (container, error) => ({
      ...container,
      [error.property]: getPropertyErrors(error.property),
    }),
    {}
  )

  return { errors, errorsByProperty, validateForm, getPropertyErrors, isValid }
}
