'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    function* stringDivider(str) {
        let digitWidth = 3;
        let offset = 0;
        let lineLength = 25;

        for (let i = 0; i < 9; i++) {
            let digit = '';

            let startIndex = offset, endIndex = offset + digitWidth;
            digit = str.slice(startIndex, endIndex);

            startIndex = offset + digitWidth + lineLength;
            endIndex = offset + digitWidth + lineLength + digitWidth;
            digit += str.slice(startIndex, endIndex);

            startIndex = offset + digitWidth + lineLength + digitWidth + lineLength;
            endIndex = offset + digitWidth + lineLength + digitWidth + lineLength + digitWidth;
            yield digit + str.slice(startIndex, endIndex);

            offset += 3;
        }
    }

    function convertDigit(strDigit) {
        let strDigits = [' _ | ||_|', '     |  |', ' _  _||_ ', ' _  _| _|', '   |_|  |', ' _ |_  _|', ' _ |_ |_|', ' _   |  |', ' _ |_||_|', ' _ |_| _|'];
        return strDigits.indexOf(strDigit);
    }

    
    let output = 0;
    let it = stringDivider(bankAccount);

    for (let digit of it) {
        output = output * 10 + convertDigit(digit);
    }

    return output;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let arr = text.split(' ');
    let sum = 0;
    let line = '';
    let i = 0;

    while(i < arr.length) {
        if (sum + arr[i].length <= columns) {
            line += arr[i] + ' ';
            sum += arr[i].length + 1;
            i++;
        } else {
            yield line.trim();
            line = '';
            sum = 0;
        }
    } 

    if (line.length > 0) {
        yield line.trim();
    }
}

/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    const ranks = 'A234567891JQKA';

    hand = hand.sort((card1, card2) => {
        const sortedRanks = '234567891JQKA';
        return sortedRanks.indexOf(card1[0]) - sortedRanks.indexOf(card2[0]);
    });

    function checkRanks(cards) {
        let output = true;
        let kind = cards[0][0];

        cards.forEach(card => {
            if (card[0] !== kind) {
                output = false;
                return;
            }
        });

        return output;
    }

    function isStraightFlush() {
        return isFlush() && isStraight();
    }

    function isFourOfKind() {
        return checkRanks(hand.slice(1)) || checkRanks(hand.slice(0, 4));
    }

    function isFullHouse() {
        return (checkRanks(hand.slice(0, 3)) && checkRanks(hand.slice(-2))) || 
                (checkRanks(hand.slice(0, 2)) && checkRanks(hand.slice(-3)));
    }

    function isFlush() {
        function checkSuits(cards) {
            let output = true;
            let kind = cards[0][cards[0].length - 1];

            cards.forEach(card => {
                if (card[card.length - 1] !== kind) {
                    output = false;
                    return;
                }
            });

            return output;
        }

        return checkSuits(hand);
    }

    function isStraight() {
        let temp = '';
        hand.forEach(card => temp += card[0]);

        if (temp[0] === '2' && temp[temp.length - 1] === 'A') {
            temp = 'A' + temp.slice(0, temp.length - 1);
        }

        return ranks.indexOf(temp) !== -1;
    }

    function isThreeOfKind() {
        return checkRanks(hand.slice(-3)) || 
                checkRanks(hand.slice(0, 3)) || 
                checkRanks(hand.slice(1, 4));
    }

    function isTwoPairs() {
        function check(cards) {
            let set = new Set();
            cards.forEach(card => set.add(card[0]));
            return set.size;
        }

        return check(hand) === 3;
    }

    function isOnePair() {
        function check(cards) {
            let set = new Set();
            cards.forEach(card => set.add(card[0]));
            return set.size;
        }

        return check(hand) === 4;
    }

    if (isStraightFlush()) 
        return PokerRank.StraightFlush;

    if (isFourOfKind())
        return PokerRank.FourOfKind;

    if (isFullHouse())
        return PokerRank.FullHouse;

    if (isFlush())
        return PokerRank.Flush;
    
    if (isStraight()) 
        return PokerRank.Straight;

    if (isThreeOfKind())
        return PokerRank.ThreeOfKind;

    if (isTwoPairs())
        return PokerRank.TwoPairs;

    if (isOnePair())
        return PokerRank.OnePair;

    return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    let arr = figure.split('\n');
    arr.pop();

    function getRectangleDimensions(line_, column_) {
        let width = 0, height = 0;
        let completeWidth = false, completeHeight = false;
        
        for (let i = column_ + 1; i < arr[line_].length; i++) {
            if (arr[line_][i] === '+' && (arr[line_ + 1][i] === '|' || arr[line_ + 1][i] === '+')) {
                completeWidth = true;
                break;
            } else {
                width++;
            }
        }

        for (let i = line_ + 1; i < arr.length; i++) {
            if (arr[i][column_] === '+' && (arr[i][column_ + 1] === '-' || arr[i][column_ + 1] === '+')) {
                completeHeight = true;
                break;
            } else {
                height++;
            }
        }

        return {height, width, complete: completeWidth && completeHeight};
    }

    function getRectangle(dimensions_) {
        let top = '+' + '-'.repeat(dimensions_.width) + '+\n';
        let middle = '';

        if (dimensions_.height > 0) {
            middle = '|' + ' '.repeat(dimensions_.width) + '|\n';
        }
        
        return top + middle.repeat(dimensions_.height) + top;
    }

    let line = 0, column = 0;

    while(line < arr.length - 1) {
        if (arr[line][column] === '+' && 
            (arr[line + 1][column] === '|' || arr[line + 1][column] === '+') &&
            (arr[line][column + 1] === '-' || arr[line][column + 1] === '+')) {
            
            let dimensions = getRectangleDimensions(line, column);

            if (dimensions.complete) {
                yield getRectangle(dimensions);
            }
        }

        if (column === arr[0].length - 1) {
            column = 0;
            line++;
        } else {
            column++;
        }
    }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
