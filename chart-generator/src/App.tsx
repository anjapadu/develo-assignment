import { useState } from 'react';
import './App.css';
import Input from './components/Input';
import bmiAgeData from './bmi-age.json'
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption

const Button = ({ onClick }: any) => {
  return (
    <div className="">
      <button onClick={onClick} type="button" className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
      </button>
    </div>
  )
}

const BMIForm = ({ isLast = false, addExtra = () => { }, id = '', showErrorAge = false, showErrorBmi = false }) => {
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
function App() {
  const percentilesValue = ['P5', 'P10', 'P25', 'P50', 'P75', 'P85', 'P95']
  const [ageArray, setAgeArray] = useState([{ showErrorAge: false, showErrorBmi: false, bmi: '', ageMonths: '', id: 1 }])
  const addObAjectToArray = () => {
    setAgeArray([...ageArray, { showErrorAge: false, showErrorBmi: false, bmi: '', ageMonths: '', id: ageArray.length + 1 }])
    console.log({ ageArray })
  }
  const generateChartData = () => {
    let hasErrors = false
    const result = ageArray.reduce((prev: any, { id }) => {
      const bmiInput: any = document.querySelector(`#item-${id}-bmi`)
      const ageInput: any = document.querySelector(`#item-${id}-age`)
      let age, bmi, errorBmi = false, errorAge = false
      if (ageInput) {
        if (ageInput.value.trim() === '') {
          errorAge = true
          hasErrors = true
        }
        age = parseInt(ageInput.value)
        if (!(age >= 24 && age <= 240.5)) {
          errorAge = true
          hasErrors = true
        }
      }
      if (bmiInput) {
        if (bmiInput.value.trim() === '') {
          errorBmi = true
          hasErrors = true
        } else {
          bmi = parseFloat(bmiInput.value)
        }
      }
      return [
        ...prev,
        {
          showErrorAge: errorAge,
          showErrorBmi: errorBmi,
          ageMonths: age || '',
          bmi: bmi || '',
          id
        }]
    }, [])

    const sexInput: HTMLInputElement | null = document.querySelector('[name=sex]:checked')
    let sex = sexInput?.value
    setAgeArray(result)
    if (hasErrors) {
      return
    }
    //@ts-ignore
    const dataPerGender = bmiAgeData[sex]
    // transform age to agemos
    const xAxisData = result.reduce((prev: any, current: any) => {
      const { ageMonths } = current
      return [...prev, `${ageMonths}.5`]
    }, [])
    const yAxisData = xAxisData.map((curr: any) => percentilesValue.map((columnName) => {
      return dataPerGender[curr][columnName]
    }))
    const series = yAxisData.map((data: any) => {
      return {
        data,
        type: 'line',
        areaStyle: {}
      }
    })
    series.push({
      data: result.map(({ bmi }: any) => bmi),
      type: 'line'
    })
    const chartData = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      series
    }
    const chartDom = document.getElementById('chart-dom')
    //@ts-ignore
    const myChart = echarts.init(chartDom)
    let option: EChartsOption
    //@ts-ignore
    option = chartData
    myChart.setOption(option)
    console.log(JSON.stringify(chartData))
  }
  return (
    <div className="App px-20 py-20">
      <h1 className="text-3xl font-bold underline text-zinc-900">
        BMI Calculator
      </h1>
      <div>
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">BMI Information</h3>
                <p className="mt-1 text-sm text-gray-600">Add age in months and the bmi value. Valid age values (2-20 years in month format)</p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form action="#" onSubmit={(e) => e.preventDefault()}>
                <div className="overflow-hidden shadow sm:rounded-md">
                  {/* Sex selection */}
                  <div className='p-5'>
                    <fieldset className="mt-4">
                      <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        <div className="flex items-center">
                          <input id="male" name="sex" type="radio"
                            defaultChecked className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" value='1' />
                          <label htmlFor="male" className="ml-3 block text-sm font-medium text-gray-700">Male</label>
                        </div>
                        <div className="flex items-center">
                          <input id="female" name="sex" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" value='2' />
                          <label htmlFor="female" className="ml-3 block text-sm font-medium text-gray-700">Female</label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  {/* sex selection end */}
                  {ageArray.map(({ id, showErrorBmi, showErrorAge }, index) => {
                    return (
                      <BMIForm
                        key={id}
                        id={`item-${index + 1}`}
                        isLast={index === ageArray.length - 1}
                        addExtra={addObAjectToArray}
                        showErrorAge={showErrorAge}
                        showErrorBmi={showErrorBmi}
                      />
                    )
                  })}
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button onClick={generateChartData} type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Show Chart / Update Values
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div id='chart-dom' style={{ height: 500 }}></div>
      </div>
    </div>
  )
}

export default App;
