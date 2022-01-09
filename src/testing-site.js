

const testAvailable = (testType, resultTimeline) => 
  ({
    testType: testType,
    resultTimeline: resultTimeline
  })

const address = (street, neighborhood, borough, postal) => 
  ({
    street: street,
    neighborhood: neighborhood,
    borough: borough,
    postal: postal
  })

const scheduleDay = (date, start, end) => 
  ({
    date: date,
    start: start,
    end: end
  })

