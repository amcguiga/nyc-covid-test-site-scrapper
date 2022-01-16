

const test = () => {
  const testingMatcher = new Map([
    ['rapid', { matches: ['rapid antigen'], timeline: '1 Day' }],
    ['pcr', { matches: ['pcr', 'testing available'], timeline: '3-5 Days' }],
    ['saliva', { matches: ['saliva'], timeline: '3-5 Days' }],
    ['flu', { matches: ['flu'], timeline: '3-5 Days' }],
  ])

  const testSet = [
    '(PCR testing only)',
    '(Rapid antigen testing available)',
    '(Saliva self-testing site)',
    '(Rapid antigen testing only)',
    '(Rapid antigen and flu testing available)',
    '(Rapid antigen + flu testing available)',
    'CDC Mobile Testing Site',
  ]

  testSet.forEach(tests => {    
    let testResult = Array.from(testingMatcher.entries()).reduce((acc, [key, { matches, timeline}]) => {
      let matcher = new RegExp(matches.join('|'))
      if (matcher.test(tests?.toLowerCase()))
        return [...acc, { testType: key, resultTimeline: timeline}]
      else 
        return acc
    }, [])
    console.log({
      raw: tests,
      testResult: testResult
    })
  })
}

test()