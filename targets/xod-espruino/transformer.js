
import R from 'ramda';
import * as PIN_DIRECTION from '../../app/constants/pinDirection';
import * as PIN_TYPE from '../../app/constants/pinType';

// From: https://github.com/ramda/ramda/wiki/Cookbook#rename-keys-of-an-object
/**
 * Creates a new object with the own properties of the provided object, but the
 * keys renamed according to the keysMap object as `{oldKey: newKey}`.
 * When some key is not found in the keysMap, then it's passed as-is.
 *
 * Keep in mind that in the case of keys conflict is behaviour undefined and
 * the result may vary between various JS engines!
 *
 * @sig {a: b} -> {a: *} -> {b: *}
 */
const renameKeys = R.curry(
  (keysMap, obj) => R.reduce(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj)
  )
);

// :: [k] -> {k: v} -> v | Undefined -- returns a value in obj for
//    an existing key that found first in priorityKeys
const priorityValue = R.curry(
  (priorityKeys, obj) => {
    const key = R.head(R.intersection(priorityKeys, R.keys(obj)));
    return R.prop(key, obj);
  }
);

/**
  * Transforms JSON data as it seen it *.xod files to
  * a shape expected by the runtime.
  *
  * @param {Object} project -- project from app world
  * @param {Array.<String>} implPlatforms -- allowed platforms to extract
  *   implementation for given in prioritized list. E.g. ['espruino', 'js'].
  */
export default function transform(project, implPlatforms = []) {
  // :: () -> Patch -- joins all patches into one shallow
  const mergedPatch = R.compose(
    R.omit('id'),
    R.reduce(R.mergeWith(R.merge), {}),
    R.values,
    R.propOr({}, 'patches')
  )(project);

  // :: String -> {a} -- extacts a specific key branch from the merged patch
  const mergedEntities = key => R.propOr({}, key)(mergedPatch);

  const nodes = () => mergedEntities('nodes');

  const pins = () => mergedEntities('pins');
  const pinList = R.compose(R.values, pins);
  const pinById = id => R.propOr({}, id, pins());

  const links = () => mergedEntities('links');
  const linkList = R.compose(R.values, links);

  const nodeTypes = () => R.propOr({}, 'nodeTypes', project);
  const nodeTypeById = id => R.propOr({}, id, nodeTypes());

  const usedNodeTypeIds = () => R.pluck('typeId', R.values(nodes()));
  const usedNodeTypes = () => R.pick(usedNodeTypeIds(), nodeTypes());

  // :: Node -> NodeType
  const nodeTypeByNode = R.compose(nodeTypeById, R.prop('typeId'));

  // :: NodeType -> {Key: NodeType.Pin}
  const nodeTypePins = R.propOr({}, 'pins');

  // :: String -> JSType -- converts pin string type name to native JS type object
  const nativeType = R.pipe(
    R.when(R.equals(PIN_TYPE.PULSE), R.always(Boolean)),
    R.when(R.equals(PIN_TYPE.BOOL), R.always(Boolean)),
    R.when(R.equals(PIN_TYPE.NUMBER), R.always(Number)),
    R.when(R.equals(PIN_TYPE.STRING), R.always(String))
  );

  // :: {Key: NodeType.Pin} -> {Key: NodeType.Pin}
  const filterByDirection = dir => R.filter(R.propEq('direction', dir));

  // :: NodeType -> {Key: NodeType.Pin}
  const inputs = R.compose(filterByDirection(PIN_DIRECTION.INPUT), nodeTypePins);
  const outputs = R.compose(filterByDirection(PIN_DIRECTION.OUTPUT), nodeTypePins);

  // :: NodeType -> {Key: JSType}
  const inputTypes = R.compose(
    R.map(pin => nativeType(pin.type)),
    inputs
  );

  // :: NodeType -> TransformedNodeType
  const transformedNodeType = nodeType => R.merge(
    R.pick(['pure'])(nodeType),
    R.objOf('inputTypes', inputTypes(nodeType))
  );

  // :: Link -> OutLink
  const linkDestination = R.compose(
    R.pick(['nodeId', 'key']),
    pinById,
    R.nth(1),
    R.prop('pins')
  );

  // :: Pin -> [Link]
  const outgoingLinks = (pin) => R.filter(
    R.compose(
      R.equals(pin.id),
      R.nth(0),
      R.prop('pins')
    )
  )(linkList());

  // :: NodeType.Pin -> Pin
  const pinByNodeTypePin = R.curry(
    (ownerNode, nodeTypePin) => R.compose(
      R.defaultTo({}),
      R.find(R.where({
        nodeId: R.equals(ownerNode.id),
        key: R.equals(nodeTypePin.key),
      }))
    )(pinList())
  );

  // :: NodeType.Pin -> [OutLink]
  const nodeTypePinOutLinks = ownerNode => R.compose(
    R.map(linkDestination),
    outgoingLinks,
    pinByNodeTypePin(ownerNode)
  );

  // :: Node -> [OutLink]
  const nodeOutLinks = node => R.compose(
    R.reject(R.isEmpty),
    R.map(nodeTypePinOutLinks(node)),
    outputs,
    nodeTypeByNode
  )(node);

  // :: Node -> TransformedNode
  const transformedNode = node => R.mergeAll([
    renameKeys({ typeId: 'implId' }, R.pick(['id', 'typeId'])(node)),
    R.compose(transformedNodeType, nodeTypeByNode)(node),
    R.objOf('outLinks', nodeOutLinks(node)),
  ]);

  // :: NodeType -> ImplementationString
  const nodeTypeImpl = R.compose(
    priorityValue(implPlatforms),
    R.propOr({}, 'impl')
  );

  return {
    nodes: R.map(transformedNode, nodes()),
    impl: R.map(nodeTypeImpl, usedNodeTypes()),
  };
}
