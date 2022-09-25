import { ReactElement } from "react"
import Button from "./Button"
import Input from "./Input"

interface BMIFormInterface {
  isLast: boolean
  addExtra: () => void
  id: string
  showErrorAge: boolean
  showErrorBmi: boolean
}

const BMIForm = ({ isLast = false, addExtra = () => { }, id = '', showErrorAge = false, showErrorBmi = false }: BMIFormInterface): ReactElement => {
  return (
    <div className="bg-white px-4 py-5 sm:p-6">
      <div className="grid grid-cols-3 gap-4">
        <Input
          id={`${id}-age`}
          label='Age (months)'
          error={showErrorAge}
        />
        <Input
          error={showErrorBmi}
          id={`${id}-bmi`}
          label='BMI (kg/m2)'
        />
        {isLast && <Button onClick={addExtra} />}
      </div>
    </div>
  )
}

export default BMIForm
