'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;

    Rectangle.prototype.getArea =  function() {
        return this.width * this.height;
    }
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CSSSelector {
    constructor() {
        this.element_ = '';
        this.id_ = ''; 
        this.classes = []; 
        this.attributes = []; 
        this.pseudoClasses = []; 
        this.pseudoElement_ = '';

        this.Parts = {
            NONE: 0,
            ELEMENT: 1,
            ID: 2,
            CLASS: 3,
            ATTR: 4,
            PSEUDOCLASS: 5,
            PSEUDOELEMENT: 6
        };

        this.lastAddedPart = this.Parts.NONE;
    }

    checkPartsOrder(currentPart) {
        if (this.lastAddedPart > currentPart)
            throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

        return currentPart;
    }

    addCSSSelectorPart(separator, part) {
        return part === '' ? '' : separator + part;
    }



    element(value) {
        if (this.element_ !== '') 
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');

        this.lastAddedPart = this.checkPartsOrder(this.Parts.ELEMENT);
        this.element_ = value;

        return this;
    }

    id(value) {
        if (this.id_ !== '') 
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');

        this.lastAddedPart = this.checkPartsOrder(this.Parts.ID);
        this.id_ = value;

        return this;
    }

    class(value) {
        this.lastAddedPart = this.checkPartsOrder(this.Parts.CLASS);
        this.classes.push(value);

        return this;
    }

    attr(value) {
        this.lastAddedPart = this.checkPartsOrder(this.Parts.ATTR);
        this.attributes.push(value);

        return this;
    }

    pseudoClass(value) {
        this.lastAddedPart = this.checkPartsOrder(this.Parts.PSEUDOCLASS);
        this.pseudoClasses.push(value);

        return this;
    }

    pseudoElement(value) {
        if (this.pseudoElement_ !== '') 
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');

        this.lastAddedPart = this.checkPartsOrder(this.Parts.PSEUDOELEMENT);
        this.pseudoElement_ = value;

        return this;
    }

    stringify() {
        let output = this.element_;
        output += this.addCSSSelectorPart('#', this.id_);
        output += this.addCSSSelectorPart('.', this.classes.join('.'));
        output += this.attributes.map(elem => `[${elem}]`).join('');
        output += this.addCSSSelectorPart(':', this.pseudoClasses.join(':'));
        output += this.addCSSSelectorPart('::', this.pseudoElement_);

        return output;
    }
}

class CSSCombinator {
    constructor() {
        this.combined = [];
    }


    combine(selector1, combinator, selector2) {
        let combinators = [ ' ', '+', '~', '>' ];

        if (combinators.indexOf(combinator) === -1) {
            throw new Error('Invalid combinator');
        } else {
            this.combined.push(selector1);
            this.combined.push(combinator);
            this.combined.push(selector2);
        }

        return this;
    }

    stringify() {
        return `${this.combined[0].stringify()} ${this.combined[1]} ${this.combined[2].stringify()}`;
    }
}


const cssSelectorBuilder = {

    element: function(value) {
        return new CSSSelector().element(value);
    },

    id: function(value) {
        return new CSSSelector().id(value);
    },

    class: function(value) {
        return new CSSSelector().class(value);
    },

    attr: function(value) {
        return new CSSSelector().attr(value);
    },

    pseudoClass: function(value) {
        return new CSSSelector().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new CSSSelector().pseudoElement(value);
    },

    combine: function(selector1, combinator, selector2) {
        return new CSSCombinator().combine(selector1, combinator, selector2);
    },
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
