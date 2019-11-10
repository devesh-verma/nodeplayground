const { calculateTip, add } = require('../src/math')

test('calc total with tip', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('calculate tip with default value', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

// test('Async Demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 5000)
// })

//////////////////////////////
test('add', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})
// ===========OR=========
test('async await add', async () => {
    const sum = await add(20, 20)
    expect(sum).toBe(40) 
})
//////////////////////////////