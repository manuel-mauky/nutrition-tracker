import React, { ComponentPropsWithoutRef, PropsWithChildren, useEffect, useRef, useState } from "react"
import { ControllerRenderProps } from "react-hook-form"
import { Form, IconButton, Input, InputNumber, InputPicker } from "rsuite"
import { Id } from "../features/types.ts"
import { PiCheck, PiX } from "react-icons/pi"

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

export function InputPickerField<T extends FormData>({
  field,
  label,
  error,
  autoFocus,
  readOnly,
  plaintext,
  data,
  ...rest
}: FieldProps<T> & {
  data: Array<{ label: string; value: Id }>
}) {
  return (
    <Field label={label} error={error} {...rest}>
      <Form.Control
        autoFocus={autoFocus}
        plaintext={plaintext}
        readOnly={readOnly}
        accepter={InputPicker}
        data={data}
        name={field.name}
        value={field.value}
        onChange={(value) => field.onChange(value)}
      />
    </Field>
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

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current && autoFocus) {
      const input = ref.current.querySelector("input")
      if (input) {
        input.select()
      }
    }
  }, [ref, autoFocus])

  return (
    <Field label={label} error={error} {...rest}>
      <Form.Control
        ref={ref}
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

export function InlineNumberField({ value, onSave }: { value: number; onSave: (newValue: number) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [editMode, setEditMode] = useState(false)

  const [internalValue, setInternalValue] = useState<number>(value)

  useEffect(() => {
    if (editMode) {
      setEditMode(false)
    }
    setInternalValue(value)
  }, [value])

  useEffect(() => {
    if (ref.current && editMode) {
      ref.current.querySelector("input")?.select()
    }
  }, [ref, editMode])

  function onChange(newValue: string | number | null) {
    setInternalValue(Number(newValue))
  }

  function onDoubleClick() {
    if (!editMode) {
      setEditMode(true)
    }
  }

  function onOk() {
    onSave(internalValue)
    setEditMode(false)
  }

  function onCancel() {
    setInternalValue(value)
    setEditMode(false)
  }

  return (
    <div onDoubleClick={onDoubleClick}>
      {editMode ? (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
          <InputNumber ref={ref} value={internalValue} onChange={onChange} size="xs" />
          <IconButton icon={<PiCheck />} aria-label="Ok" onClick={onOk} size="xs" />
          <IconButton icon={<PiX />} aria-label="Abbrechen" onClick={onCancel} size="xs" />
        </div>
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}
