// Create clients and set shared const values outside of the handler.
/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
const calculateZ = (L, M, S, X) => {
  return (((X / M) ** L) - 1) / (L * S)
}

const getAgemos = (months, agemosByGender) => {
  // validate if provided months exists in the data. Because we have tables from 0 - 36 and from 24 - 240
  // we use this values to validate if an equal agemos exists.
  if (['0', '36', '24', '240'].includes(months) && agemosByGender.includes(`${months}`)) {
    return `${months}`
  }
  // validating agemos exists
  if (agemosByGender.includes(`${months}.5`)) {
    return `${months}.5`
  }
  return null
}

exports.calculateZScore = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error('Not supported method');
  }
  const {
    months,
    attribute,
    sex,
    weight,
    height,
    headc,
    bmi
  } = event.queryStringParameters
  const validAttributes = ['bmi', 'headc', 'length', 'weight', 'height']
  if (!validAttributes.includes(attribute)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: `You are requesting an invalid attribute. Please use one of the following values: ${validAttributes.join(',')}`
      })
    }
  }
  if (!event.queryStringParameters[attribute]) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: `You have requested for the calculation of the ${attribute} but didn't provided the value.`
      })
    }
  }
  const parsedMonths = parseInt(months, 10)
  const fileName = `../data/${attribute}-age.json`
  const data = require(fileName)
  const genderData = data[`${sex}`]
  const agemosByGender = Object.keys(genderData)
  const agemos = getAgemos(parsedMonths, agemosByGender)

  if (!agemos) {
    const { min, max } = agemosByGender.reduce((prev, curr) => {
      prev.max = Math.max(prev.max, parseFloat(curr))
      prev.min = Math.min(prev.min, parseFloat(curr))
      return prev;
    }, { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY })
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: `there is no information for the months provided. Plz provide a value between ${min} and ${max} months`
      })
    }
  }
  const { L, M, S } = genderData[agemos]

  let response = {};
  try {
    response = {
      statusCode: 200,
      body: JSON.stringify({
        zScore: calculateZ(L, M, S, event.queryStringParameters[attribute])
      })
    }
  } catch (e) {
    response = {
      statusCode: 500,
      body: JSON.stringify({
        msg: "something went wrong",
        e
      }),

    }
  }

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
