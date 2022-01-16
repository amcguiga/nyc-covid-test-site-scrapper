const test = () => {
  const testingMatcher = new Map([
    ['rapid', { matches: ['rapid testing'] }],
    ['pcr', { matches: ['non-rapid testing'] }],
    ['saliva', { matches: ['saliva testing'] }],
    ['antibody', { matches: ['antibody'] }]
  ])

  const testSet = [
    { mainTest: ['Rapid Testing Results in 9 Minutes', 'Non-Rapid Testing Results in .30 Days'], antibody: [] },
    { mainTest: ['Rapid Testing Results in 30 Minutes'], antibody: [] },
    { mainTest: ['Non-Rapid Testing Results in 5 Days'], antibody: [] },
    { mainTest: ['Non-Rapid Testing Results in 3-5 Days'], antibody: ['Antibody Testing: Available'] },
    { antibody: ['Antibody Testing: Available'], mainTest: [] }
  ]

  testSet.forEach( ({ mainTest, antibody }) => {
    let initialTestList = antibody.find((contents) => (contents.includes('Available'))) ? [{ testType: 'antibody' }] : []
    let tests = mainTest.reduce((acc, test) => {
      let [testName, timeline] = test.toLowerCase().split('results in').map(part => part.trim())
      return Array.from(testingMatcher.entries()).reduce((acc1, [key, { matches }]) => {
        let matcher = new RegExp(matches.join('|'))
        if (matcher.test(testName))
          return [...acc1, { testType: key, resultTimeline: timeline }]
        else 
          return acc1
      }, acc)
    }, initialTestList)
    console.log({raw: [...mainTest, ...antibody], siteTests: tests})
  })
}

test()