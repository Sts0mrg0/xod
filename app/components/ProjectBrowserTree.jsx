import R from 'ramda';
import React from 'react';
import classNames from 'classnames';
import Tree from 'react-ui-tree';
import { Icon } from 'react-fa';


class ProjectBrowserTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
      tree: props.tree,
    };

    this.onClickNode = this.onClickNode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderNode = this.renderNode.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tree !== this.state.tree) {
      this.updateTree(nextProps.tree);
    }
  }

  onClickNode(node) {
    const nodeRef = node;
    if (!node.hasOwnProperty('leaf')) {
      nodeRef.collapsed = !nodeRef.collapsed;
    }

    this.setActive(nodeRef);
  }

  onDoubleClickNode(node) {
    if (!node.leaf || !node.id) { return; }

    this.props.onSwitchPatch(node.id);
  }

  onChange(tree) {
    this.props.onChange(tree);
  }

  setActive(val) {
    this.setState(R.assoc('active', val, this.state));

    let selected = {
      type: null,
      id: null,
    };

    if (val !== null) {
      selected = {
        type: (val.leaf) ? 'patch' : 'folder',
        id: val.id || null,
      };
    }

    this.props.onSelect(selected.type, selected.id);
  }

  updateTree(tree) {
    this.setState(R.assoc('tree', tree, this.state));
  }

  deselect() {
    this.setActive(null);
  }

  renderNode(node) {
    const nodeClassName = classNames('node', {
      'is-active': node === this.state.active,
      'is-current': (node.hasOwnProperty('leaf') && node.id === this.props.currentPatchId),
    });

    const onClick = this.onClickNode.bind(this, node);
    const onDblClick = this.onDoubleClickNode.bind(this, node);

    let iconName = 'folder-open-o';
    if (node.leaf) { iconName = 'file-o'; }
    if (node.collapsed) { iconName = 'folder-o'; }

    return (
      <span
        className={nodeClassName}
        onClick={onClick}
        onDoubleClick={onDblClick}
      >
        <Icon name={iconName} className="icon" />
        {node.module}
      </span>
    );
  }

  render() {
    return (
      <div className="ProjectBrowserTree">
        <Tree
          tree={this.state.tree}
          renderNode={this.renderNode}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

ProjectBrowserTree.propTypes = {
  tree: React.PropTypes.object.isRequired,
  currentPatchId: React.PropTypes.number,
  onSelect: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onSwitchPatch: React.PropTypes.func,
};

export default ProjectBrowserTree;
