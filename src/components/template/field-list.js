'use strict'

const React = require('react')
const { PureComponent } = React
const { TemplateField } = require('./field')
const { insert, move, remove } = require('../../common/util')
const { arrayOf, bool, func, object, shape, string } = require('prop-types')


let tmpId = -1

const newField = () => ({
  id: tmpId--,
  property: '',
  isRequired: false
})

const updateFields = (props) => (
  props.isDisabled || !props.template ?
    props.fields :
    props.fields.length > 0 ?
      [...props.fields] :
      [newField()]
)


class TemplateFieldList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      fields: updateFields(props)
    }
  }

  componentWillReceiveProps(props) {
    if (props.fields !== this.props.fields) {
      this.setState({
        fields: updateFields(props)
      })
    }
  }

  handleFieldSave = (id, idx, data) => {
    if (id < 0) {
      this.props.onFieldAdd({
        id: this.props.template,
        field: data
      }, { idx })
    }
  }

  handleFieldInsert = (field, at) => {
    this.setState({
      fields: insert(this.state.fields, at, newField())
    })
  }

  handleFieldRemove = (field) => {
    if (field.id < 0) {
      this.setState({
        fields: remove(this.state.fields, field)
      })
    } else {
      this.props.onFieldRemove({
        id: this.props.template,
        field: field.id
      })
    }
  }

  handleSort = () => {
  }

  handleSortPreview = (from, to, offset) => {
    this.setState({
      fields: move(this.state.fields, from, to, offset)
    })
  }

  handleSortReset = () => {
  }

  render() {
    if (this.props.template == null) return
    const isSingle = this.state.fields.length === 1

    return (
      <ul className="template-field-list">
        {this.state.fields.map((field, idx) =>
          <TemplateField
            key={field.id}
            field={field}
            position={idx}
            properties={this.props.properties}
            isDisabled={this.props.isDisabled}
            isSingle={isSingle}
            isTransient={field.id < 0}
            onInsert={this.handleFieldInsert}
            onRemove={this.handleFieldRemove}
            onSave={this.handleFieldSave}
            onSort={this.handleSort}
            onSortPreview={this.handleSortPreview}
            onSortReset={this.handleSortReset}/>)}
      </ul>
    )
  }

  static propTypes = {
    isDisabled: bool,
    template: string.isRequired,
    fields: arrayOf(object).isRequired,
    properties: arrayOf(shape({
      id: string.isRequired
    })).isRequired,
    onFieldAdd: func.isRequired,
    onFieldRemove: func.isRequired,
    onFieldSave: func.isRequired,
  }
}

module.exports = {
  TemplateFieldList
}
