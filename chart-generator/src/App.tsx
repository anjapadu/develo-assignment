import { useState } from 'react';
import './App.css';
import Input from './components/Input';
import bmiAgeData from './bmi-age.json'
import * as echarts from 'echarts';
import BMIForm from './components/BMIForm';

type EChartsOption = echarts.EChartsOption

interface ItemInterface {
  showErrorAge?: boolean
  showErrorBmi?: boolean
  bmi?: string | number
  ageMonths?: string | number
  id?: number
}

function App() {
  const percentilesValue = ['P5', 'P10', 'P25', 'P50', 'P75', 'P85', 'P95']
  const [ageArray, setAgeArray] = useState([{ showErrorAge: false, showErrorBmi: false, bmi: '', ageMonths: '', id: 1 }])

  const addObAjectToArray = () => {
    setAgeArray([...ageArray, { showErrorAge: false, showErrorBmi: false, bmi: '', ageMonths: '', id: ageArray.length + 1 }])
  }

  // function to generate echarts data
  const generateChartData = () => {
    let hasErrors = false
    let max: number | undefined
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
          max = !max || bmi > max ? bmi : max
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
    const xAxisData = result.reduce((prev: ItemInterface[], current: ItemInterface) => {
      const { ageMonths } = current
      return [...prev, `${ageMonths}.5`]
    }, [])
    const yAxisData = xAxisData.map((curr: any) => percentilesValue.map((columnName) => {
      return dataPerGender[curr][columnName]
    }))
    const clientData: number[] = result.map(({ bmi }: ItemInterface) => bmi)
    const series = yAxisData.map((data: any, index: number) => {
      return {
        data,
        showSymbol: false,
        type: 'line',
        areaStyle: {
          color: '#abdbe3'
        },
        lineStyle: {
          color: '#76b5c5'
        },

        name: percentilesValue[index]
      }
    })
    series.push({
      data: clientData,
      type: 'line',
      lineStyle: {
        color: 'black'
      },
      itemStyle: {
        color: 'black'
      },
    })
    const min = Math.min(...clientData) * 0.9
    const chartData = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        name: 'agemos'
      },
      yAxis: {
        type: 'value',
        name: 'bmi(kg/m2)',
        min,
        max: max ? max * 1.2 : max
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

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0" />
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">

              <div id='chart-dom' style={{ height: 500, width: 750 }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
