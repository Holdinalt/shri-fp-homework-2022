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

    const getWriteLog = () => prop('writeLog')
    const getHandleSuccess = () => prop('handleSuccess')
    const getHandleError = () => prop('handleError')
    const Error = () => 'ValidationError'



    const logIt = () => tap(getWriteLog)
    const consoleIt = tap(console.log)

    const createSafeFunction = (fn) => tryCatch(fn, getHandleError);
    const createSafeAPI = (url) => createSafeFunction(api.get(url))
    const getAnimalFromAPI = (url) => createSafeAPI(url)({})
    const getNumberFromAPI = createSafeAPI('https://api.tech/numbers/base')

    const buildAnimalGet = id => `https://animals.tech/${id}`
    const createPropForAPI = number => set(lensProp('number'), number, {from: 10, to: 2, number: 1})



    const modDigit3 = number => mathMod(number)(3)

    const parseToDigit = compose(logIt, pipe(Number, Math.round))
    const logLen = compose(logIt, length, pipe(String))
    const square = compose(logIt, x => x ** 2)
    const mod3 = compose(logIt, modDigit3)
    const HandleError = compose(getHandleError, Error)

    const validateLen = compose(
        allPass([
            gte(10),
            lt(2)
        ]),
        length,
    )

    const validation = compose(
        allPass([
            validateLen,
            test(/^\d*$/)
        ])
    )

    const getAnimal = compose(
        andThen(compose(
            getHandleSuccess,
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
             HandleError
         ),
         logIt,
     )

    return does(value)
}

export default processSequence;
