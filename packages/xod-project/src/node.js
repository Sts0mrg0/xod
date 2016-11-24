
/**
 * @typedef {Object} Node
 * @property {Position} position - coordinates of the node center
 * @property {string} typeId - read-only type name of the node
 */

/**
 * A {@link Node} object or just its ID as {@link string}
 * @typedef {(Node|string)} NodeOrId
 */

/**
 * Pin value can be one of this type:
 *
 * - {@link string}
 * - {@link number}
 * - {@link boolean}
 * - {@link Pulse}
 *
 * And it is never can be {@link Null} or {@link undefined}
 *
 * @typedef {(string|number|boolean|Pulse)} PinValue
 */

/**
 * @function createNode
 * @param {Position} position - coordinates of new node’s center
 * @param {Patch} type - type of node to create
 * @returns {Either<Error|Node>} error or a new node
 */
// TODO: implement

/**
 * @function duplicateNode
 * @param {Node} node - node to clone
 * @returns {Node} cloned node with new id
 */
// TODO: implement

/**
 * @function getNodeId
 * @param {Node} node
 * @returns {Maybe<Null|string>}
 */
// TODO: implement

/**
 * @function setNodeLabel
 * @param {string} label
 * @param {Node} node
 * @returns {Node}
 */
// TODO: implement

/**
 * @function setNodePosition
 * @param {Position} position - new coordinates of node’s center
 * @param {Node} node - node to move
 * @returns {Node} copy of node in new coordinates
 */
 // TODO: implement

 // =============================================================================
 //
 // Pins
 //
 // =============================================================================

/**
 * @function listPinKeys
 * @param {Node} node
 * @returns {string[]}
 */
 // TODO: implement

/**
 * @function listInputPinKeys
 * @param {Node} node
 * @returns {string[]}
 */
 // TODO: implement

/**
 * @function listOutputPinKeys
 * @param {Node} node
 * @returns {string[]}
 */
 // TODO: implement

/**
 * @function getPinType
 * @param {string} key
 * @param {Node} node
 * @returns {Either<Error|PIN_TYPE>}
 */
 // TODO: implement

/**
 * @function getPinLabel
 * @param {string} key
 * @param {Node} node
 * @returns {Either<Error|string>}
 */
 // TODO: implement

/**
 * @function getPinDescription
 * @param {string} key
 * @param {Node} node
 * @returns {Either<Error|string>}
 */
 // TODO: implement

/**
 * Get seed value of output pin.
 *
 * It's like a default value for pin before node has been evaluated.
 *
 * @function getPinSeedValue
 * @param {string} key
 * @param {Node} node
 * @returns {Either<Error|PinValue>}
 */
 // TODO: implement

/**
 * Set seed value to output pin.
 *
 * @function setPinSeedValue
 * @param {PinValue} value
 * @param {string} key
 * @param {Node} node
 * @returns {Either<Error|PinValue>}
 */
 // TODO: implement


/**
 * Get curried value of input pin.
 *
 * It will return value even if pin isn't curried.
 *
 * @function setPinCurriedValue
 * @param {string} key
 * @param {Node} node
 * @returns {Either<Error|PinValue>}
 */

/**
 * Set curried value to input pin.
 *
 * @function getPinCurriedValue
 * @param {string} key
 * @param {PinValue} value
 * @param {Node} node
 * @returns {Either<Error|PinValue>}
 */

 /**
  * Set pin curried or uncurried.
  *
  * @function curryPin
  * @param {boolean} curry
  * @param {string} key
  * @param {Node} node
  * @returns {Either<Error|Node>}
  */

/**
 * @function isPinCurried
 * @param {string} key
 * @param {Node} node
 * @returns {Either<Error|boolean>}
 */

/**
 * Returns list of all links that connected with specified pin.
 *
 * @function listLinksByPin
 * @param {string} key
 * @param {Node} node
 * @param {Patch} patch
 * @returns {Link[]}
 */
