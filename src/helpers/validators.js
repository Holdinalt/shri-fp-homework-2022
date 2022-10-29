
import {
    allPass,
    anyPass,
    compose,
    equals,
    prop,
    countBy, values, toLower, propEq, not, lte, converge
} from 'ramda';

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const countColors = compose(
    countBy(toLower),
    values
)

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({star, square, triangle, circle}) => {
    if (triangle !== 'white' || circle !== 'white') {
        return false;
    }

    return star === 'red' && square === 'green';
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(
    lte(2),
    prop(true),
    countBy(equals('green')),
    values
)

// 3. Количество красных фигур равно кол-ву синих.

export const validateFieldN3 = compose(

    converge(
        equals,
        [
            prop('red'),
            prop('blue')
        ]
    ),
    countColors,
)



// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    propEq('circle', 'blue'),
    propEq('star', 'red'),
    propEq('square', 'orange'),
])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (obj) => {

    const termFunc = lte(3)

    const terms = compose(
        anyPass([
            compose(
                termFunc,
                prop('blue'),
            ),
            compose(
                termFunc,
                prop('red'),
            ),
            compose(
                termFunc,
                prop('green'),
            ),
            compose(
                termFunc,
                prop('orange'),
            ),
        ]),
        countColors
    )

    return terms(obj)
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    compose(
        allPass([
            compose(
                equals(1),
                prop('red'),
            ),
            compose(
                equals(2),
                prop('green'),
            ),
        ]),
        countColors
    ),
    compose(
        equals('green'),
        prop('triangle')
    )
])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(
    equals(4),
    prop('orange'),
    countColors
);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(
    allPass([
        compose(
            not,
            equals('red')
        ),
        compose(
            not,
            equals('white')
        ),
    ]),
    prop('star')
)


// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(
    equals(4),
    prop('green'),
    countColors
);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    compose(
        converge(
            equals,
            [
                prop('square'),
                prop('triangle')
            ]
        )
    ),
    compose(
        not,
        equals('white'),
        prop('square'),
    )
]);
