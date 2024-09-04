import React, { PropsWithChildren } from "react"
import { ControllerRenderProps } from "react-hook-form"
import { Form, Input, InputNumber } from "rsuite"

type FormData = Record<string, string | number | undefined | null>

export const Textarea = React.forwardRef<HTMLTextAreaElement>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
))

export type CommonFieldProps = {
  label: string
  error?: string
  autoFocus?: boolean
}

export type FieldProps<T extends Record<string, unknown>> = PropsWithChildren<
  CommonFieldProps & {
    field: ControllerRenderProps<T>
  }
>

export function Field({ children, error, label }: PropsWithChildren<CommonFieldProps>) {
  return (
    <Form.Group>
      <Form.ControlLabel>{label}</Form.ControlLabel>
      {children}
      <Form.ErrorMessage show={!!error} placement="bottomStart">
        {error}
      </Form.ErrorMessage>
    </Form.Group>
  )
}

export function TextField<T extends FormData>({ field, label, error, autoFocus }: FieldProps<T>) {
  return (
    <Field label={label} error={error}>
      <Form.Control
        autoFocus={autoFocus}
        accepter={Input}
        name={field.name}
        value={field.value}
        onChange={(value) => field.onChange(value)}
      />
    </Field>
  )
}

export function TextAreaField<T extends FormData>({ field, label, error, autoFocus }: FieldProps<T>) {
  return (
    <Field label={label} error={error}>
      <Form.Control
        autoFocus={autoFocus}
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
}: FieldProps<T> & {
  unit?: string
}) {
  const formatter = unit ? (value: number | string) => `${value} ${unit}` : undefined

  return (
    <Field label={label} error={error}>
      <Form.Control
        autoFocus={autoFocus}
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
