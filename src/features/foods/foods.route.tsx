import { ContentLayout } from "../../content-layout.tsx"
import { useStore } from "../store.ts"
import { useState } from "react"
import { FoodsTable } from "./foods-table.tsx"

import { FoodsBreadcrumb } from "./foods-breadcrumb.tsx"
import { Button, ButtonToolbar, Form, Modal } from "rsuite"
import { PiPlusBold } from "react-icons/pi"

import "./foods.css"
import { Food } from "../types.ts"
import { Controller, ControllerRenderProps, useForm } from "react-hook-form"

type AddFoodFormValue = Omit<Food, "id">

function Field({
  field,
  error,
  label,
  ...rest
}: {
  field: ControllerRenderProps<AddFoodFormValue>
  error?: string
  label: string
}) {
  return (
    <Form.Group>
      <Form.ControlLabel>{label}</Form.ControlLabel>
      <Form.Control name={field.name} value={field.value} onChange={(value) => field.onChange(value)} {...rest} />
      <Form.ErrorMessage show={!!error} placement="bottomStart">
        {error}
      </Form.ErrorMessage>
    </Form.Group>
  )
}

function AddFoodDialog() {
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const { addFood, foods } = useStore()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddFoodFormValue>({
    defaultValues: {
      name: "",
      description: "",
      kcal: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
      fiber: 0,
      sugar: 0,
    },
  })

  function handleOpen() {
    reset()
    setOpenAddDialog(true)
  }

  function handleClose() {
    setOpenAddDialog(false)
  }

  const onSubmit = handleSubmit((data) => {
    addFood(data)
    setOpenAddDialog(false)
    reset()
  })

  return (
    <>
      <Button startIcon={<PiPlusBold />} onClick={handleOpen}>
        Hinzufügen
      </Button>
      <Modal open={openAddDialog} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Lebensmittel hinzufügen</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="add-food-form" onSubmit={(_, event) => onSubmit(event)}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name ist erforderlich",
                validate: (value) => {
                  const duplicate = foods.some((food) => food.name === value)

                  if (duplicate) {
                    return "Name existiert bereits"
                  } else {
                    return undefined
                  }
                },
              }}
              render={({ field }) => <Field field={field} error={errors[field.name]?.message} label="Name" />}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Field field={field} error={errors[field.name]?.message} label="Beschreibung" />}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button form="add-food-form" type="submit">
            Ok
          </Button>
          <Button onClick={handleClose}>Abbrechen</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export function FoodsRoute() {
  return (
    <ContentLayout header={<FoodsBreadcrumb />}>
      <div id="foods-root">
        <ButtonToolbar>
          <AddFoodDialog />
        </ButtonToolbar>
        <div style={{ flexGrow: 1 }}>
          <FoodsTable />
        </div>
      </div>
    </ContentLayout>
  )
}
