import React, { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { ControllerRenderProps } from "react-hook-form"
import { Form, Input, InputNumber } from "rsuite"

type FormData = Record<string, string | number | undefined | null>

export const Textarea = React.forwardRef<HTMLTextAreaElement>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
))

export type CommonFieldProps = ComponentPropsWithoutRef<"div"> & {
  label: string
  error?: string
  autoFocus?: boolean
  plaintext?: boolean
  readOnly?: boolean
}

export type FieldProps<T extends Record<string, unknown>> = PropsWithChildren<
  CommonFieldProps & {
    field: ControllerRenderProps<T>
  }
>

export function Field({ children, error, label, ...rest }: PropsWithChildren<CommonFieldProps>) {
  return (
    <Form.Group {...rest}>
      <Form.ControlLabel>{label}</Form.ControlLabel>
      {children}
      <Form.ErrorMessage show={!!error} placement="bottomStart">
        {error}
      </Form.ErrorMessage>
    </Form.Group>
  )
}

export function TextField<T extends FormData>({
  field,
  label,
  error,
  autoFocus,
  readOnly,
  plaintext,
  ...rest
}: FieldProps<T>) {
  return (
    <Field label={label} error={error} {...rest}>
      <Form.Control
        autoFocus={autoFocus}
        plaintext={plaintext}
        readOnly={readOnly}
        accepter={Input}
        name={field.name}
        value={field.value}
        onChange={(value) => field.onChange(value)}
      />
    </Field>
  )
}

export function TextAreaField<T extends FormData>({
  field,
  label,
  error,
  autoFocus,
  readOnly,
  plaintext,
  ...rest
}: FieldProps<T>) {
  return (
    <Field label={label} error={error} {...rest}>
      <Form.Control
        autoFocus={autoFocus}
        plaintext={plaintext}
        readOnly={readOnly}
        accepter={Textarea}
        name={field.name}
        value={field.value}
        onChange={(value) => field.onChange(value)}
      />
    </Field>
  )
}

export function NumberField<T extends FormData>({
  field,
  unit,
  label,
  error,
  autoFocus,
  plaintext,
  readOnly,
  ...rest
}: FieldProps<T> & {
  unit?: string
}) {
  const formatter = unit ? (value: number | string) => `${value} ${unit}` : undefined

  return (
    <Field label={label} error={error} {...rest}>
      <Form.Control
        autoFocus={autoFocus}
        plaintext={plaintext}
        readOnly={readOnly}
        accepter={InputNumber}
        formatter={formatter}
        min={0}
        name={field.name}
        value={field.value}
        onChange={(value) => field.onChange(value)}
      />
    </Field>
  )
}
