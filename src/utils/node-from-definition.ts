import { FocusNode, NodeDefinition, Node, NodeNavigationItem } from '../types';

export default function nodeFromDefinition({
  nodeDefinition,
  parentNode,
}: {
  nodeDefinition: NodeDefinition;
  parentNode: Node;
}) {
  const {
    onKey,
    onArrow,
    onLeft,
    onRight,
    onUp,
    onDown,
    onSelected,
    onBack,

    onFocused,
    onBlurred,

    defaultFocusColumn,
    defaultFocusRow,

    isExiting = false,

    onMove,
    onGridMove,
  } = nodeDefinition;

  const parentId = parentNode.focusId;
  let nodeNavigationItem: NodeNavigationItem = 'default';

  if (nodeDefinition.navigationStyle === 'grid') {
    nodeNavigationItem = 'grid-container';
  } else if (parentNode && parentNode.navigationStyle === 'grid') {
    nodeNavigationItem = 'grid-row';
  } else if (parentNode && parentNode.nodeNavigationItem === 'grid-row') {
    nodeNavigationItem = 'grid-item';
  }

  const navigationStyle = nodeDefinition.navigationStyle ?? 'first-child';
  const isGridContainer = navigationStyle === 'grid';

  const defaultFocusColumnValue = defaultFocusColumn ?? 0;
  const defaultFocusRowValue = defaultFocusRow ?? 0;

  const node: FocusNode = {
    focusId: nodeDefinition.focusId,
    isRoot: false,
    parentId,

    isExiting,

    // These will be updated to their actual values within the call to `createNodes` below.
    isFocused: false,
    isFocusedLeaf: false,
    active: false,

    trap: Boolean(nodeDefinition.trap),
    orientation: nodeDefinition.orientation ?? 'horizontal',
    wrapping: Boolean(nodeDefinition.wrapping),
    disabled: Boolean(nodeDefinition.initiallyDisabled),
    navigationStyle,
    nodeNavigationItem,

    defaultFocusColumn: defaultFocusColumnValue,
    defaultFocusRow: defaultFocusRowValue,

    restoreTrapFocusHierarchy: Boolean(
      nodeDefinition.restoreTrapFocusHierarchy ?? true
    ),
    children: [],
    focusedChildIndex: null,
    prevFocusedChildIndex: null,
    _gridColumnIndex: isGridContainer ? defaultFocusColumnValue : null,
    _gridRowIndex: isGridContainer ? defaultFocusRowValue : null,
    wrapGridColumns: Boolean(nodeDefinition.wrapGridColumns),
    wrapGridRows: Boolean(nodeDefinition.wrapGridRows),
    _focusTrapPreviousHierarchy: [],

    onKey,
    onArrow,
    onLeft,
    onRight,
    onUp,
    onDown,
    onSelected,
    onBack,

    onFocused,
    onBlurred,

    onMove,
    onGridMove,
  };

  return node;
}
