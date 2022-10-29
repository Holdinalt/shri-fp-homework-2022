/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
 import Api from '../tools/api';
import {
    allPass,
    andThen,
    compose, gte,
    ifElse,
    length,
    lensProp, lt, mathMod,
    pipe,
    prop,
    set,
    tap,
    test,
    tryCatch,
} from "ramda";

 const api = new Api();

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {

    const logIt = tap(writeLog)
    const consoleIt = tap(console.log)
    const createSafeFunction = (fn) => tryCatch(fn, handleError);
    const createSafeAPI = (url) => createSafeFunction(api.get(url))
    const getNumberFromAPI = createSafeAPI('https://api.tech/numbers/base')
    const getAnimalFromAPI = (url) => createSafeAPI(url)({})

    const buildAnimalGet = (id) => `https://animals.tech/${id}`

     const validation = compose(
         allPass([
             compose(
                 allPass([
                     gte(10),
                     lt(2)
                 ]),
                 length,
             ),
             compose(
                 test(/^\d*$/)
             )
         ])
     )

     //     consoleIt(),
     //     tap(handleError('ValidationError'))
     // )

    const parseToDigit = compose(logIt, pipe(Number, Math.round))

    const createPropForAPI = number => set(lensProp('number'), number, {from: 10, to: 2, number: 1})

    const modDigit3 = number => mathMod(number)(3)

    const logLen = compose(logIt, length, pipe(String))
    const square = compose(logIt, x => x ** 2)
    const mod3 = compose(logIt, modDigit3)
    const Error = () => 'ValidationError'

    const getAnimal = compose(
        andThen(compose(
            handleSuccess,
            prop('result'),
        )),
        getAnimalFromAPI,
        buildAnimalGet,
    )


    const mathIt = compose(
        mod3,
        consoleIt,
        square,
        logLen,
    )

    const convert = compose(

        andThen(compose(
            getAnimal,
            mathIt,
            prop('result'),
        )),
        getNumberFromAPI,
        createPropForAPI
    )

     const does = compose(
         ifElse(
             validation,
             compose(
                 convert,
                 parseToDigit,
             ),
             compose(
                 handleError,
                 Error,
             )
         ),
         logIt
     )

    return does(value)
}

 export default processSequence;
