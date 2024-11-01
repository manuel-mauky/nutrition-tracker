import React, { ComponentPropsWithoutRef, PropsWithChildren, useEffect, useRef, useState } from "react"
import { ControllerRenderProps } from "react-hook-form"
import { DatePicker, Form, IconButton, Input, InputNumber, InputPicker, TimePicker } from "rsuite"
import { PiCheck, PiX } from "react-icons/pi"
import { DateTime } from "luxon"
import { areDateTimesEqual } from "../utils/date-utils.ts"

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
  data: Array<{ label: string; value: string }>
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
  step,
  ...rest
}: FieldProps<T> & {
  unit?: string
  step?: number
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
        step={step}
        name={field.name}
        value={field.value}
        onChange={(value) => field.onChange(Number.parseFloat(value))}
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

function DateOrTimePickerField<T extends Record<string, string | number | undefined | null | DateTime>>({
  field,
  label,
  error,
  autoFocus,
  readOnly,
  plaintext,
  dateOrTime,
  ...rest
}: FieldProps<T> & {
  dateOrTime: "time" | "date"
}) {
  const jsDate =
    field.value instanceof DateTime
      ? field.value
      : typeof field.value === "string"
        ? DateTime.fromISO(field.value)
        : undefined

  return (
    <Field label={label} error={error} {...rest}>
      <Form.Control
        autoFocus={autoFocus}
        plaintext={plaintext}
        readOnly={readOnly}
        accepter={dateOrTime === "date" ? DatePicker : TimePicker}
        oneTap={dateOrTime === "date"}
        hideMinutes={(minute) => minute % 5 !== 0}
        cleanable={false}
        value={jsDate?.toJSDate()}
        name={field.name}
        onChange={(value) => {
          field.onChange(value ? DateTime.fromJSDate(value) : undefined)
        }}
      />
    </Field>
  )
}

export function DatePickerField<T extends Record<string, string | number | undefined | null | DateTime>>(
  props: FieldProps<T>,
) {
  return <DateOrTimePickerField dateOrTime="date" {...props} />
}

export function TimePickerField<T extends Record<string, string | number | undefined | null | DateTime>>(
  props: FieldProps<T>,
) {
  return <DateOrTimePickerField dateOrTime="time" {...props} />
}

export function DateTimePickerField<T extends Record<string, string | number | undefined | null | DateTime>>({
  field,
  label,
  error,
  autoFocus,
  readOnly,
  plaintext,
  ...rest
}: FieldProps<T>) {
  const jsDate =
    field.value instanceof DateTime
      ? field.value
      : typeof field.value === "string"
        ? DateTime.fromISO(field.value)
        : undefined

  const [value, setValue] = useState<DateTime | undefined>(jsDate)

  useEffect(() => {
    if (value === undefined) {
      field.onChange(undefined)
    } else if (field.value instanceof DateTime && !areDateTimesEqual(field.value, value)) {
      field.onChange(value)
    }
  }, [field, value])

  function dateChanged(newDate: DateTime | undefined) {
    if (newDate === undefined) {
      setValue(undefined)
    } else if (value) {
      setValue(
        value.set({
          year: newDate.year,
          month: newDate.month,
          day: newDate.day,
        }),
      )
    }
  }

  function timeChanged(newTime: DateTime | undefined) {
    if (newTime === undefined) {
      setValue(undefined)
    } else if (value) {
      setValue(
        value.set({
          hour: newTime.hour,
          minute: newTime.minute,
        }),
      )
    }
  }

  return (
    <Field label={label} error={error} {...rest}>
      <div>
        <Form.Control
          autoFocus={autoFocus}
          plaintext={plaintext}
          readOnly={readOnly}
          accepter={DatePicker}
          value={value?.toJSDate()}
          oneTap={true}
          cleanable={false}
          name={field.name}
          onChange={(value) => {
            dateChanged(value ? DateTime.fromJSDate(value) : undefined)
          }}
        />

        <Form.Control
          autoFocus={autoFocus}
          plaintext={plaintext}
          readOnly={readOnly}
          accepter={TimePicker}
          cleanable={false}
          hideMinutes={(minute) => minute % 5 !== 0}
          editable={false}
          value={value?.toJSDate()}
          name={field.name}
          onChange={(value) => {
            timeChanged(value ? DateTime.fromJSDate(value) : undefined)
          }}
        />
      </div>
    </Field>
  )
}
