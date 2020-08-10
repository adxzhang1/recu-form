import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import MapFormDialog from './map-form.component';
import SimpleFormDialog from './simple-form.component';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { List, AutoSizer } from 'react-virtualized';

import withDialogToggler from './dialog-toggler';
import withDialogLayout from './dialog-layout.component';
import withStandardLayout from './standard-layout.component';

import createSchema from './createSchema';
import arrayMove from 'array-move';
import _ from 'lodash';


// Sortable item
const SortableItem = SortableElement(({ data, config, display, handleDelete, style, ...otherProps }) => {

  // Render
  return <li className="sortable-item" style={style}>
    <div className="sortable-item__body">
      <div className="sortable-item__text">
        {
          config.type === 'map' ?
            `(${data.originalIndex}) ${data[display]}`
            : `${data}`
        }
      </div>
      <div className="sortable-item__actions">
        {
          config.type === 'map' ?
            <MapFormDialog
              config={config}
              data={data}
              maxWidth="md"
              {...otherProps}
            />
            : <SimpleFormDialog
              config={config}
              data={data}
              maxWidth={config.type === 'markdown' || config.type === 'url' ? 'md' : 'sm'}
              {...otherProps}
            />
        }
        <IconButton onClick={handleDelete} >
          <DeleteIcon color="error" />
        </IconButton>
      </div>
    </div>
  </li>
});

const SortableItemMemo = React.memo(SortableItem);

// Sortable list
const SortableList = SortableContainer(({ items, onNestedChange, handleDelete, width, height, listRef, ...otherProps }) => {

  // Render each row
  const renderRow = ({ index, style, key }) => {
    return <SortableItemMemo
      key={key}
      style={style}
      index={index}
      data={items[index]}
      onNestedChange={onNestedChange(index)}
      handleDelete={() => handleDelete(index)}
      {...otherProps}
    />
  }

  // Render
  return <List
    ref={(ref) => {
      listRef.ref = ref;
    }}
    className="virtualized-list"
    rowHeight={52}
    width={width}
    height={height}
    rowCount={items.length}
    rowRenderer={renderRow}
    data={items}
  />
});


// Array form
export class ArrayForm extends React.Component {
  // Init
  constructor(props) {
    super(props);

    // Ref to list
    this.list = {
      ref: null
    };

    // Copy of data
    const dataCopy = this.getInitValues();

    // Set an index for adding new items
    this.index = dataCopy?.length || 0;

    // Set state
    this.state = {
      data: dataCopy,
      searchKey: this.props.config.display,
      searchTerm: '',
      searching: false,
      error: false
    };
  }

  // Update if props changed
  componentDidUpdate(prevProps) {
    if ((prevProps.data) !== this.props.data) {
      const dataCopy = this.getInitValues();
      this.index = dataCopy?.length || 0;
      this.setState({
        data: dataCopy
      });
    }
  }

  // Create copy of data from props and initialize index
  getInitValues() {
    // Make a copy of the data
    const { data, config } = this.props;
    const dataCopy = _.cloneDeep(data);

    // Create an originalIndex field
    if (config.nested.type === 'map') {
      dataCopy.forEach((item, i) => {
        dataCopy[i].originalIndex = i;
      });
    }

    return dataCopy;
  }

  // Validate and retrieve form
  retrieve = async () => {
    return {
      response: await this.validate(),
      data: this.state.data
    };
  }

  // Handle done sorting items
  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ data }) => ({
      data: arrayMove(data, oldIndex, newIndex),
    }));
  };

  // Handle deleting item
  handleDelete = (index) => {
    this.setState(({ data }) => {
      const newData = [...data];
      newData.splice(index, 1);
      return {
        data: newData
      }
    });
    const value = this.state.data[index];
    if (this.props.onItemChange) {
      this.props.onItemChange(value, 'delete');
    }
  }

  // Handle change in item with nested data
  handleNestedChange = (index) => {
    return (value) => {
      this.setState(({ data }) => {
        const newData = [...data];
        newData.splice(index, 1, value);

        if (this.props.onItemChange) {
          this.props.onItemChange(value, 'modify');
        }

        return {
          data: newData
        }
      });
    }
  }

  // Handle change in field data
  handleFilterChange = (event) => {
    const { value } = event.target;
    this.setState({
      searchKey: value
    });
  }

  // Handle search input
  handleSearchChange = (event) => {
    const value = event.target.value;
    this.handleSearch(value);
  }

  // Handle clearing search
  handleSearchClear = () => {
    this.handleSearch('');
  }

  // Handle search
  handleSearch = (value) => {
    // Check if not searching
    if (!value) {
      this.setState({
        searchTerm: '',
        searching: false
      });
      _.debounce(() => {
        this.setState({
          searching: false
        });
      }, 500)();
      return;
    }

    this.setState({
      ...this.state,
      searchTerm: value
    });
    _.debounce(() => {
      this.setState({
        searching: true
      });
    }, 500)();
  }

  checkSearch(config, item) {
    let includesTerm;
    if (config.type === 'number') {
      // eslint-disable-next-line eqeqeq
      includesTerm = item == this.state.searchTerm;
    } else if (config.type === 'bool') {
      if (this.state.searchTerm === 'true') {
        includesTerm = item;
      } else if (this.state.searchTerm === 'false') {
        includesTerm = !item;
      } else {
        includesTerm = false;
      }
    } else {
      includesTerm = item.toLowerCase().includes(this.state.searchTerm);
    }
    return includesTerm;
  }

  // Handle creating new item
  handleAdd = () => {
    const { config } = this.props;
    let newItem;
    if (config.nested.type === 'map') {
      newItem = {
        [config.display]: '(New Item)',
        originalIndex: this.index
      }
    } else {
      newItem = '(New Item)'
    }
    this.index += 1;
    this.setState({
      data: [newItem, ...this.state.data]
    });
    if (this.list.ref) {
      this.list.ref.scrollToRow(0);
    }
  }

  // Validate form
  validate = async () => {
    const { config } = this.props;
    const schema = createSchema(config);
    console.log('config', config, 'validating:', this.state.data, 'schema:', schema)
    try {
      await schema.validate(this.state.data);
      this.setState({
        error: false
      });
      return {
        valid: true
      };
    } catch (err) {
      console.log(err);
      this.setState({
        error: true
      });
      return {
        valid: false,
        error: err
      };
    }
  }

  // Render
  render() {
    // Get visible items
    const { data, config, ...otherProps } = this.props;
    const itemsToShow = this.state.searching ?
      this.state.data.filter((item) => {
        let includesTerm;
        try {
          if (config.nested.type === 'map') {
            includesTerm = this.checkSearch(config.nested.nested[this.state.searchKey], item[this.state.searchKey]);
          } else {
            includesTerm = this.checkSearch(config.nested, item);
          }
        } catch (err) {
          includesTerm = false;
        }
        return includesTerm;
      })
      : this.state.data;

    return <div className="array-form">
      <div className="array-form__header">
        <div className="array-form__search">
          {
            config.nested.type === 'map' &&
            <Select
              name={'Key'}
              className="array-form__filter"
              value={this.state.searchKey}
              onChange={this.handleFilterChange}
              required={config.validate?.required}
            >
              {
                Object.keys(config.nested.nested)
                  .filter((key) => key !== 'map')
                  .map((key) => <MenuItem
                    key={key}
                    label={key}
                    value={key}
                  >
                    {key}
                  </MenuItem>)
              }
            </Select>
          }
          <TextField
            label="Search"
            value={this.state.searchTerm}
            onChange={this.handleSearchChange}
            variant="outlined"
          />
          <IconButton onClick={this.handleSearchClear}>
            <ClearIcon />
          </IconButton>
          {
            this.state.searching &&
            <p>Reording is disabled while searching</p>
          }
        </div>
        <div className="array-form__add-button">
          <IconButton onClick={this.handleAdd}>
            <AddIcon />
          </IconButton>
        </div>
      </div>
      <div className={`array-form__results ${this.state.error ? 'error' : ''}`}>
        {
          itemsToShow.length > 0 ?
            <AutoSizer>
              {
                ({ width, height }) => <SortableList
                  items={itemsToShow}
                  display={config.display}
                  onSortEnd={this.handleSortEnd}
                  pressDelay={this.state.searching ? Math.pow(10, 10) : 200}
                  helperClass='sortable-item--active'
                  onNestedChange={this.handleNestedChange}
                  handleDelete={this.handleDelete}
                  width={width}
                  height={height}
                  config={config.nested}
                  listRef={this.list}
                  {...otherProps}
                />
              }
            </AutoSizer>
            : <p>No items found</p>
        }
      </div>
    </div>
  }
}

// With standard layout
export const ArrayFormStandardLayout = withStandardLayout(ArrayForm);

// With only dialog layout
export const ArrayFormDialogLayout = withDialogLayout(ArrayForm);

// With dialog toggler & layout
const ArrayFormDialog = withDialogToggler(withDialogLayout(ArrayForm));

export default ArrayFormDialog;