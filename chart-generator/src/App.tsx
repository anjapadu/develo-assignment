import { useState } from 'react';
import './App.css';
import Input from './components/Input';

const Button = () => {
  return (
    <div className="">
      <button type="button" className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
      </button>
    </div>
  )
}

const BMIForm = ({ isLast = false }) => {
  return (
    <div className="bg-white px-4 py-5 sm:p-6">
      <div className="grid grid-cols-3 gap-4">
        <Input
          label='Age (months)'
          value=''
          onChange={() => { }}
        />
        <Input
          label='BMI (kg/m2)'
          value=''
          onChange={() => { }}
        />
        {isLast && <Button />}
      </div>
    </div>
  )
}
function App() {
  const [ageArray, setAgeArray] = useState([{ ageMonths: '', bmi: '' }])
  const addObAjectToArray = () => {
    setAgeArray([...ageArray, { ageMonths: '', bmi: '' }])
  }
  return (
    <div className="App">
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
              <form action="#" method="POST">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <BMIForm />
                  <div className="bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label='Age (months)'
                        value=''
                        onChange={() => { }}
                      />
                      <Input
                        label='BMI (kg/m2)'
                        value=''
                        onChange={() => { }}
                      />
                      <Button />
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
