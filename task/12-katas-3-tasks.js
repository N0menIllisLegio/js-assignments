'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let letters = [];
    let path = [];

    searchStr.split('').forEach(letter => {
        let encounters = [];

        for (let i = 0; i < puzzle.length; i++) {
            for (let j = 0; j < puzzle[i].length; j++) {
                if (puzzle[i][j] === letter) {
                    encounters.push([i, j]);
                }
            }
        }

        letters.push({
            letter,
            encounters
        });
    });

    function isValidEncounter(nextEncounter) {
        if (path.length === 0) {
            return true;
        }

        let valid = true;

        path.forEach(encounter => {
            if (encounter[0] === nextEncounter[0] && encounter[1] === nextEncounter[1]) {
                valid = false;
                return;
            }
        });

        if (!valid) {
            return false;
        }

        let prevEncounter = path[path.length - 1];
        let deltaY = prevEncounter[0] - nextEncounter[0];
        let deltaX = prevEncounter[1] - nextEncounter[1];

        if (((deltaY === 1 || deltaY === -1) && deltaX === 0) || ((deltaX === 1 || deltaX === -1) && deltaY === 0)) {
            return true;
        }

        return false;
    }

    function findNextLetterEncounter(letterIndex) {
        let isFound = false;

        letters[letterIndex].encounters.forEach((encounter, index) => {
            if (isValidEncounter(encounter) && !isFound) {  
                isFound = true; 
                path.push(letters[letterIndex].encounters[index]);

                if (letterIndex + 1 !== letters.length) {
                    isFound = findNextLetterEncounter(letterIndex + 1);
                    
                    if (isFound) {
                        return; 
                    } 
                    
                    path.pop();
                }
            }
        });

        return isFound;
    }

    return findNextLetterEncounter(0);
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    yield chars;

    let arr = chars.split('');

    function swap(index1, index2) {
        let temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }

    function format(array) {
        let output = '';
        array.forEach(elem => output += elem);
        return output;
    }
    
    let c = new Array(arr.length);
    let i = 0;
    c.fill(0);

    while (i < arr.length) {

        if (c[i] < i) {
            if (i % 2 === 0) {
                swap(0, i);
            } else {
                swap(c[i], i);
            }

            yield format(arr);
            c[i]++;
            i = 0;
        } else {
            c[i] = 0;
            i++;
        }
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let buySell = new Array(quotes.length);
    let maxQuot = quotes[quotes.length - 1];
    buySell.fill(1);
    buySell[buySell.length - 1] = 0;

    for (let i = quotes.length - 2; i >= 0; i--) {
        if (quotes[i] > maxQuot) {
            buySell[i] = 0;
            maxQuot = quotes[i];
        }
    }

    let profit = 0;
    let quotesBuyed = 0;

    for (let i = 0; i < quotes.length; i++) {
        if (buySell[i] === 1) {
            profit -= quotes[i];
            quotesBuyed++;
        } else {
            profit += quotesBuyed * quotes[i];
            quotesBuyed = 0;
        }
    }

    return profit < 0 ? 0 : profit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {
        let result = '';

        for (let i = 0; i < url.length; i += 2) {
            let a = url.charCodeAt(i);
            let b = url.charCodeAt(i + 1);
            let code = (a << 8) | b;

            result += String.fromCharCode(code);
        }

        return result;
    },

    decode: function(code) {
        let result = "";

        for (let i = 0; i < code.length; i++) {
            let char = parseInt(code.charCodeAt(i), 10);
            let b = char & 255;
            let a = (char >> 8) & 255;

            if (b === 0) {
                result += String.fromCharCode(a)
            } else {
                result += String.fromCharCode(a) + String.fromCharCode(b);
            }
        }

        return result;
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
